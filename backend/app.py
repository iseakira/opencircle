from flask import Flask, jsonify, session,redirect
from flask_cors import CORS # ◀ flask_corsをインポート
from flask import request, send_from_directory
import json
from  models import db, Circle, Tag, EditAuthorization, User, Session 
import os
from sqlalchemy.exc import IntegrityError
import database_operating as dbop
import send_mail as sm
from datetime import datetime, timedelta, timezone
import uuid
from werkzeug.utils import secure_filename

# --- ▼ 1. 画像アップロード設定 ▼ ---
# 許可する拡張子
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
# 画像を保存するサーバー上のフォルダパス
# (app.py と同じ階層に 'uploads' フォルダが作成されます)
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
# フロントエンドが画像にアクセスするためのURLプレフィックス
UPLOAD_BASE_URL = "/api/uploads"
# --- ▲ 画像アップロード設定 ▲ ---

def create_app():
    app = Flask(__name__)
    base_dir = os.path.dirname(__file__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(base_dir, "project.db")
    
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    CORS(app, origins="http://localhost:3000",supports_credentials=True)
    db.init_app(app)
    
    return app

app = create_app()





@app.route('/homestart', methods=['POST'])
def initial_circles():
    # DB から初期表示用のサークル一覧を取得して返す
    try:
        items = dbop.get_initial_circles()
        return jsonify({"items": items, "total": len(items)})
    except Exception as e:
        # エラー時はログ出力して 500 を返す
        print('get_initial_circles error:', e)
        return jsonify({"error": "サーバーエラー"}), 500

@app.route('/home', methods=['POST'])
def search_results():
    json_dict = request.get_json()
    #print(json.dumps(json_dict))
    #f = open("testdata.txt")
    #json_text = f.read()
    #f.close()
    json_text = dbop.search_circles(json_dict)
    return jsonify(json_text)
@app.route('/Circle_Page', methods=['POST'])
def circle_page():
    json_dict = request.get_json() or {}
    circle_id = json_dict.get("circle_id")
    
    if circle_id is None:
        return jsonify({"error": "circle_id is required"}), 400

    try:
        circle_id = int(circle_id)
    except ValueError:
        return jsonify({"error": "invalid circle_id"}), 400

    detail = dbop.get_circle_detail(circle_id)
    if detail is None:
        return jsonify({"error": "circle not found"}), 404

    return jsonify(detail)

@app.route('/add_account', methods=['POST'])
def make_tmp_account():
    json_dict = request.get_json()
    emailaddress = json_dict["emailaddress"]
    #data_tuple は (auth_code, tmp_id) の形
    data_tuple = dbop.tmp_registration(emailaddress)
    sm.send_auth_code(emailaddress, data_tuple[0])
    return jsonify({"message": "success", "tmp_id": data_tuple[1]})

@app.route("/create_account", methods=["POST"])
def create_account():
    json_dict = request.get_json()
    checked_dict = dbop.check_auth_code(json_dict["auth_code"], json_dict["tmp_id"])
    if checked_dict["message"] == "failure":
        return jsonify(checked_dict)
    dbop.create_account(json_dict["emailaddress"], json_dict["password"], json_dict["user_name"])
    return jsonify(checked_dict)

# --- ▼ 2. 画像保存ヘルパー関数 ▼ ---

def allowed_file(filename):
    """許可された拡張子かチェック"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image_file(file_storage):
    """
    request.files から取得した FileStorage オブジェクトを
    安全なファイル名で保存し、アクセス用URLを返す。
    """
    if not file_storage or not allowed_file(file_storage.filename):
        return None, "許可されていないファイル形式です"

    try:
        # ファイル名を安全なものに変更 (例: image.png -> <uuid>.png)
        ext = file_storage.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4()}.{ext}"
        
        # 保存先のフルパス
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # ファイルを保存
        file_storage.save(save_path)
        
        # フロントエンドがアクセスするためのURLパスを返す
        file_url = f"{UPLOAD_BASE_URL}/{filename}"
        return file_url, None

    except Exception as e:
        print(f"ファイル保存エラー: {e}")
        return None, str(e)

# --- ▼ 3. 画像配信用API ▼ ---
# /api/uploads/xxxx.png のようなURLでアクセスされたら、
# UPLOAD_FOLDER からファイルを配信する
@app.route(f'{UPLOAD_BASE_URL}/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- (他のAPI ... /api/hello, /hometest など) ---

@app.route('/api/circles', methods=['POST'])
def add_circle():

    # --- ▼ 1. Cookieによるログイン認証チェック ▼ ---
    session_id_str = request.cookies.get("session_id")

    if not session_id_str:
        return jsonify({"error": "認証されていません (Cookieが見つかりません)"}), 401
    
    try:
        session_id = int(session_id_str)
    except ValueError:
        return jsonify({"error": "不正なセッション形式です"}), 401

    active_session = db.session.get(Session, session_id)

    if not active_session:
        return jsonify({"error": "セッションが無効です（ログインしていません）"}), 401

    session_timeout_hours = 24
    if active_session.session_last_access_time < datetime.utcnow() - timedelta(hours=session_timeout_hours):
        db.session.delete(active_session) 
        db.session.commit()
        return jsonify({"error": "セッションが期限切れです。再度ログインしてください"}), 401
    
    user_id = active_session.user_id
    active_session.session_last_access_time = datetime.utcnow()
    # --- ▲ 認証チェック完了 ▲ ---


    # --- ▼ 2. FormData からデータを取得 ▼ ---
    # (request.get_json() は使わない)
    
    # テキストデータを request.form から取得
    data_name = request.form.get("circle_name")
    data_description = request.form.get("circle_description")
    data_fee = request.form.get("circle_fee")
    data_male = request.form.get("number_of_male", 0)
    data_female = request.form.get("number_of_female", 0)
    
    # タグリスト (JSON文字列として送られてくると想定)
    tags_json_str = request.form.get("tags", "[]")
    
    # 画像ファイルを request.files から取得
    file = request.files.get("circle_icon_file")
    # --- ▲ データ取得完了 ▲ ---
    
    
    # 必須チェック
    if not data_name or not data_description:
        return jsonify({"error": "circle_name と circle_description は必須です"}), 400

    # --- 3. 画像ファイルの保存 ---
    icon_path = None # デフォルトはパスなし
    if file:
        saved_path, error = save_image_file(file)
        if error:
            return jsonify({"error": f"画像保存エラー: {error}"}), 400
        icon_path = saved_path # DBに保存するパス (例: /api/uploads/uuid.png)
    
    # サークルデータを作成
    circle_data = {
        "circle_name": data_name,
        "circle_description": data_description,
        "circle_fee": int(data_fee) if data_fee else None,
        "number_of_male": int(data_male),
        "number_of_female": int(data_female),
        "circle_icon_path": icon_path # DBに保存するパス
    }

    new_circle = Circle(**circle_data)

    # タグ紐付け
    try:
        selected_tag_ids = json.loads(tags_json_str) # JSON文字列をリストに変換
    except json.JSONDecodeError:
        return jsonify({"error": "タグの形式が不正です"}), 400
        
    if selected_tag_ids:
        tags = Tag.query.filter(Tag.tag_id.in_(selected_tag_ids)).all()
        for tag in tags:
            new_circle.tags.append(tag)

    try:
        db.session.add(new_circle)
        db.session.commit() # circle_id を確定

        # --- 3. 作成者を管理者として登録 ---
        new_authorization = EditAuthorization(
            user_id=user_id,
            circle_id=new_circle.circle_id,
            role="admin"
        )
        db.session.add(new_authorization)
        
        db.session.add(active_session) # セッション時刻更新
        db.session.commit() # 権限とセッション更新をコミット

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": "データベースエラー（整合性違反など）", "detail": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "サーバーエラー", "detail": str(e)}), 500

    return jsonify({
        "message": "サークルを追加しました",
        "circle_id": new_circle.circle_id,
        "circle_icon_path": icon_path # 保存した画像のパスを返す
    }), 201



# GET: 1件のサークル情報を取得する
@app.route('/api/circles/<int:circle_id>', methods=['GET'])
def get_circle(circle_id):

    circle = Circle.query.get(circle_id)

    if not circle:
        return jsonify({"error": "指定されたサークルが見つかりません"}), 404
        
    tags_id_list = [tag.tag_id for tag in circle.tags]

    circle_data = {
        "circle_id": circle.circle_id,
        "circle_name": circle.circle_name,
        "circle_description": circle.circle_description,
        "circle_fee": circle.circle_fee,
        "number_of_male": circle.number_of_male,
        "number_of_female": circle.number_of_female,
        "circle_icon_path": circle.circle_icon_path,
        "tags": tags_id_list
    }

    # 辞書をJSONにして返す
    return jsonify(circle_data), 200

# PUT: 1件のサークル情報を更新する
@app.route('/api/circles/<int:circle_id>', methods=['PUT'])
def update_circle(circle_id):
    circle_to_update = Circle.query.get(circle_id)

    # サークルが見つからなかった場合
    if not circle_to_update:
        return jsonify({"error": "指定されたサークルが見つかりません"}), 404

    data = request.get_json() or {}

    if not data.get('circle_name') or not data.get('circle_description'):
        return jsonify({"error": "circle_name と circle_description は必須です"}), 400

    circle_to_update.circle_name = data.get("circle_name")
    circle_to_update.circle_description = data.get("circle_description")
    circle_to_update.circle_fee = data.get("circle_fee")
    circle_to_update.number_of_male = data.get("number_of_male", 0)
    circle_to_update.number_of_female = data.get("number_of_female", 0)
    circle_to_update.circle_icon_path = data.get("circle_icon_path")

    circle_to_update.tags.clear() 

    selected_tag_ids = data.get("tags", [])
    if selected_tag_ids:
        tags = Tag.query.filter(Tag.tag_id.in_(selected_tag_ids)).all()
        for tag in tags:
            circle_to_update.tags.append(tag)
            
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "サーバーエラー", "detail": str(e)}), 500

    return jsonify({
        "message": "サークルを更新しました",
        "circle_id": circle_to_update.circle_id
    }), 200
# --- ここまでサークル編集ページ---


#--- ここからマイページ ---
@app.route("/api/edit-authorization", methods=["POST"])
def add_edit_authorization():
    if "user_id" not in session:
        return jsonify({"error": "ログインが必要です"}), 401
    data = request.get_json() or {}
    circle_id = data.get("circle_id")
    target_user_id = data.get("target_user_id")
    if not circle_id or not target_user_id:
        return jsonify({"error": "circle_id と target_user_id が必要です"}), 400
    owner_auth = EditAuthorization.query.filter_by(
        user_id=session["user_id"], circle_id=circle_id
    ).first()
    if not owner_auth:
        return jsonify({"error": "このサークルに権限を付与する権限がありません"}), 403
    exists = EditAuthorization.query.filter_by(
        user_id=target_user_id, circle_id=circle_id
    ).first()
    if exists:
        return jsonify({"error": "このユーザーは既に権限を持っています"}), 400
    new_auth = EditAuthorization(user_id=target_user_id, circle_id=circle_id)
    db.session.add(new_auth)
    db.session.commit()
    return jsonify({
        "message": "編集権限を付与しました",
        "circle_id": circle_id,
        "target_user_id": target_user_id
    }), 201

@app.route("/api/transfer-ownership", methods=["POST"])
def transfer_ownership():
    data = request.get_json() or {}
    circle_id = data.get("circle_id")
    new_owner_id = data.get("new_owner_id")
    if "user_id" not in session:
        return jsonify({"error": "ログインが必要です"}), 401
    current_owner = EditAuthorization.query.filter_by(
        user_id=session["user_id"], circle_id=circle_id, role="owner"
    ).first()
    if not current_owner:
        return jsonify({"error": "オーナーのみが譲渡できます"}), 403
    candidate = EditAuthorization.query.filter_by(
        user_id=new_owner_id, circle_id=circle_id
    ).first()
    if not candidate:
        return jsonify({"error": "譲渡先のユーザーが見つかりません"}), 400
    candidate.role = "owner"   # 新オーナー昇格
    db.session.delete(current_owner)  # 元オーナーは削除（退部扱い）
    db.session.commit()
    return jsonify({
        "message": "オーナー権限を譲渡し、元オーナーは退部しました",
        "circle_id": circle_id,
        "new_owner_id": new_owner_id
    }), 200

#--- ここまでマイページ ---

if __name__ == '__main__':
    # ポート5001でサーバーを起動
    # host='0.0.0.0' はコンテナ内で外部からのアクセスを受け付けるために必要
    app.run(host='0.0.0.0', port=5001, debug=True)