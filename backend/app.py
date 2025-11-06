from flask import Flask, jsonify, redirect
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

    # DB の場所をプロジェクトの backend ディレクトリ内の project.db に設定
    base_dir = os.path.dirname(__file__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(base_dir, "project.db")
    
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    upload_dir = os.path.join(base_dir, "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    app.config["UPLOAD_FOLDER"] = upload_dir
    print("UPLOAD_FOLDER 設定:", app.config["UPLOAD_FOLDER"]) 
    # CORSを有効にする（これでフロントからの通信が許可される）
    # origins=["http://localhost:3000"] のように限定することも可能
    CORS(app, 
     resources={r"/*": {"origins": "http://localhost:3000"}},  #変更クッキー関係
     supports_credentials=True

)
    db.init_app(app)
    return app

app = create_app()

# --- ここからテスト用のコード ---

# `/api/hello` というURLにアクセスが来たら動く関数
@app.route('/api/hello', methods=['GET'])
def say_hello():
    # JSON形式でメッセージを返す
    return jsonify({"message": "バックエンドからの返事です！🎉"})

#'/hometest'というURLにPOSTリクエストが来たら動く関数
@app.route('/hometest', methods=['POST'])
def search():
    #json_dataのキーは["search_term","field","circle_fee","gender_ration","place","mood","frequency"]
    json_dict = request.get_json()
    print(json.dumps(json_dict))
    #f = open("testdata.txt")
    #json_text = f.read()
    #f.close()
    json_text = dbop.search_circles(json_dict)
    return jsonify(json_text)

    # return jsonify([{"circle_icon_path": "/test_image/head_image.png",
    #                 "circle_name": "サークルAの名前",
    #                 "tag_name":"サークルAの分野のタグ"},
    #                 {"circle_icon_path": "サークルBのアイコン",
    #                 "circle_name": "サークルBの名前",
    #                 "tag_name":"サークルBの分野のタグ"}])

@app.route('/home', methods=['POST'])
def initial_circles():
    # DB から初期表示用のサークル一覧を取得して返す
    try:
        items = dbop.get_initial_circles()
        return jsonify({"items": items, "total": len(items)})
    except Exception as e:
        # エラー時はログ出力して 500 を返す
        print('get_initial_circles error:', e)
        return jsonify({"error": "サーバーエラー"}), 500

@app.route('/home', methods=['GET'])
def search_results():
    return jsonify([{"circle_name": "サークルA",
                    "circle_description": "これはサークルAの説明です。"},
                    {"circle_name": "サークルB",
                     "circle_description": "これはサークルBの説明です。"},
                    {"circle_name": "サークルC",
                     "circle_description": "これはサークルCの説明です。"}])

@app.route('/Circle_Page', methods=['POST'])
def circle_page():
    json_dict = request.get_json()
    circle_id = json_dict["circle_id"]
    return jsonify({"message": f"サークルID {circle_id} の詳細情報の取得成功"})

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

#'/api/circles'というURLにPOSTリクエストが来たら動く関数#
@app.route('/api/circles', methods=['POST'])
def add_circle():

    # # --- ▼ 1. Cookieによるログイン認証チェック ▼ ---
    # session_id_str = request.cookies.get("session_id")

    # if not session_id_str:
    #     return jsonify({"error": "認証されていません (Cookieが見つかりません)"}), 401
    
    # try:
    #     session_id = int(session_id_str)
    # except ValueError:
    #     return jsonify({"error": "不正なセッション形式です"}), 401

    # active_session = db.session.get(Session, session_id)

    # if not active_session:
    #     return jsonify({"error": "セッションが無効です（ログインしていません）"}), 401

    # session_timeout_hours = 24
    # if active_session.session_last_access_time < datetime.utcnow() - timedelta(hours=session_timeout_hours):
    #     db.session.delete(active_session) 
    #     db.session.commit()
    #     return jsonify({"error": "セッションが期限切れです。再度ログインしてください"}), 401
    
    # user_id = active_session.user_id
    # active_session.session_last_access_time = datetime.utcnow()
    # # --- ▲ 認証チェック完了 ▲ ---


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
    
    print("FORM:", request.form)
    print("FILES:", request.files)

    
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

        # # --- 3. 作成者を管理者として登録 ---
        # new_authorization = EditAuthorization(
        #     user_id=user_id,
        #     circle_id=new_circle.circle_id,
        #     role="admin"
        # )
        # db.session.add(new_authorization)
        
        # db.session.add(active_session) # セッション時刻更新
        # db.session.commit() # 権限とセッション更新をコミット

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
    # まず、指定されたIDのサークルを探す
    circle = Circle.query.get(circle_id)

    # サークルが見つからなかった場合
    if not circle:
        return jsonify({"error": "指定されたサークルが見つかりません"}), 404
        
    # TODO: 認証チェック
    # 必要であれば、ここで「ログイン中のユーザーがこのサークルを
    # 閲覧/編集する権限があるか」をチェックする
    # (例: if circle.owner_id != session.get('user_id'): return 403)

    # フロントエンド（React）が使いやすい形（辞書）に変換
    circle_data = {
        "circle_id": circle.circle_id,
        "circle_name": circle.circle_name,
        "circle_description": circle.circle_description,
        "circle_fee": circle.circle_fee,
        "number_of_male": circle.number_of_male,
        "number_of_female": circle.number_of_female,
        "circle_icon_path": circle.circle_icon_path,
        # 現在紐付いているタグのIDリストも渡す
        "tags": [tag.tag_id for tag in circle.tags]
    }

    # 辞書をJSONにして返す
    return jsonify(circle_data), 200

# PUT: 1件のサークル情報を更新する
@app.route('/api/circles/<int:circle_id>', methods=['PUT'])
def update_circle(circle_id):
    # まず、更新対象のサークルを探す
    circle_to_update = Circle.query.get(circle_id)

    # サークルが見つからなかった場合
    if not circle_to_update:
        return jsonify({"error": "指定されたサークルが見つかりません"}), 404

    # TODO: 重要な認証チェック！
    # ここで「ログイン中のユーザーがこのサークルを
    # 編集する権限があるか」を必ずチェックしてください。
    # (例: if circle_to_update.owner_id != session.get('user_id'): 
    #          return jsonify({"error": "編集権限がありません"}), 403)

    # Reactから送られてきた新しいデータを取得
    data = request.get_json() or {}

    # 必須チェック（add_circle と同様）
    if not data.get('circle_name') or not data.get('circle_description'):
        return jsonify({"error": "circle_name と circle_description は必須です"}), 400

    # データベースのオブジェクトの値を新しいデータで上書き
    circle_to_update.circle_name = data.get("circle_name")
    circle_to_update.circle_description = data.get("circle_description")
    circle_to_update.circle_fee = data.get("circle_fee")
    circle_to_update.number_of_male = data.get("number_of_male", 0)
    circle_to_update.number_of_female = data.get("number_of_female", 0)
    circle_to_update.circle_icon_path = data.get("circle_icon_path")

    # タグの更新 (少し面倒)
    # 1. いったん既存のタグ紐付けを全部クリア
    circle_to_update.tags.clear() 
    # 2. 送られてきたタグIDリストで新しく紐付け
    selected_tag_ids = data.get("tags", [])
    if selected_tag_ids:
        tags = Tag.query.filter(Tag.tag_id.in_(selected_tag_ids)).all()
        for tag in tags:
            circle_to_update.tags.append(tag)
            
    # データベースに保存（コミット）
    try:
        # db.session.add() は不要（すでに対象はセッションが追跡しているため）
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "サーバーエラー", "detail": str(e)}), 500

    # 成功メッセージを返す
    return jsonify({
        "message": "サークルを更新しました",
        "circle_id": circle_to_update.circle_id
    }), 200
# --- ここまでテスト用のコード ---


@app.route("/api/mypage", methods=["GET"])
def get_editable_circles():
   
    #　ログインチェック
    if "user_id" not in session:
        return jsonify({"error": "ログインが必要です"}), 401


    user_id = session["user_id"]




    # 編集権限を取得
    auths = EditAuthorization.query.filter_by(user_id=user_id).all()
    circle_ids = [a.circle_id for a in auths]




    # 編集できるサークルがない場合
    if not circle_ids:
        return jsonify({"items": [], "total": 0})




    # 対応するサークル情報を取得
    circles = Circle.query.filter(Circle.circle_id.in_(circle_ids)).all()


    # 取得したサークル情報をJSON化
    result = [
        {
            "circle_id": c.circle_id,
            "circle_name": c.circle_name,
            "circle_description": c.circle_description,
        }
        for c in circles
    ]


    return jsonify({"items": result, "total": len(result)})


   




# 新しいサークル追加ボタン押下時
@app.route("/api/mypage/circle/new", methods=["POST"])
def prepare_new_circle():
   
    # ログインチェック
    if "user_id" not in session:
        return jsonify({"error": "ログインが必要です"}), 401




    # DB処理は不要（画面遷移のみ）
    return jsonify({
        "message": "新しいサークル作成ページへ移動します。",
        "next": "/create-circle"
    }), 200




# セッション確認API
@app.route("/api/session/debug", methods=["GET"])
def debug_session():
    """現在のセッション情報を確認"""
    return jsonify(dict(session))




# データベース初期化コマンド
@app.cli.command("initdb")
def initdb():
    """データベースを初期化"""
    db.drop_all()
    db.create_all()
    print("Database initialized.")




# アプリ起動設定
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5001, debug=True)


#--- ここまでマイページ画面用のコード ---


if __name__ == '__main__':
    # ポート5001でサーバーを起動
    # host='0.0.0.0' はコンテナ内で外部からのアクセスを受け付けるために必要
    app.run(host='0.0.0.0', port=5001, debug=True)
