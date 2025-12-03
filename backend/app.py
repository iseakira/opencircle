from flask import Flask, jsonify, make_response
from flask_cors import CORS # ◀ flask_corsをインポート
from flask import Flask, jsonify, make_response, request, send_from_directory, session
import json
from  models import db, Circle, Tag, EditAuthorization, User, Session 
import os
from sqlalchemy.exc import IntegrityError
import database_operating as dbop
import send_mail as sm
from datetime import datetime, timedelta, timezone
import uuid
from werkzeug.utils import secure_filename
import threading
import hash

# --- ▼ 1. 画像アップロード設定 ▼ ---
# 許可する拡張子
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
# 画像を保存するサーバー上のフォルダパス
# (app.py と同じ階層に 'uploads' フォルダが作成されます)
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
# フロントエンドが画像にアクセスするためのURLプレフィックス
UPLOAD_BASE_URL = "/api/uploads"
# --- ▲ 画像アップロード設定 ▲ ---

TAG_CATEGORY_ORDER = [
    "bunya", "fee", "ratio", "place", "mood", "active"
]

# --- ▼▼▼ この「ID→カテゴリ対応表」を追加 ▼▼▼ ---
TAG_ID_TO_CATEGORY = {
    # "bunya" (分野)
    1: "bunya", 2: "bunya", 3: "bunya", 4: "bunya",
    # "fee" (費用)
    5: "fee", 6: "fee", 7: "fee",
    # "ratio" (男女比)
    8: "ratio", 9: "ratio", 10: "ratio",
    # "place" (活動場所)
    11: "place", 12: "place",
    # "mood" (雰囲気)
    13: "mood", 14: "mood",
    # "active" (活動頻度)
    15: "active", 16: "active", 17: "active",
    # (ID: 0 の "未選択" はカテゴリがないのでここでは無視)
}
# --- ▲▲▲ 対応表の追加完了 ▲▲▲ ---

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
    
    #定期的にデータベースの不要データを処理するスレッドを立てる
    clean_thread = threading.Thread(target = dbop.cleanup_session_tmpid, daemon = True)
    clean_thread.start()

    return app

app = create_app()

# --- ここからテスト用のコード ---

# `/api/hello` というURLにアクセスが来たら動く関数
@app.route('/api/hello', methods=['GET'])
def say_hello():
    # JSON形式でメッセージを返す
    return jsonify({"message": "バックエンドからの返事です！🎉"})


@app.route('/home', methods=['POST'])
def search():
    try:
        json_data = request.json 
        if json_data is None:
            print('search_circles error: Request body is empty or not JSON')
            return jsonify({"error": "不正なデータ形式"}), 400
        items = dbop.search_circles(json_data)
        return jsonify({"items": items, "total": len(items)})
    except Exception as e:
        # エラー時はログ出力して 500 を返す
        print('search_circles error:', e)
        return jsonify({"error": "サーバーエラー"}), 500

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

@app.route('/Circle_Page', methods=['POST'])
def circle_page():
    json_dict = request.get_json()
    circle_id = json_dict["circle_id"]
    circle_detail = dbop.get_circle_detail(circle_id)
    if circle_detail is None:
        return jsonify({"message": f"サークルID {circle_id} の詳細情報の取得失敗"}), 404
    return jsonify(circle_detail)

#--- ここからアカウント作成 ---
@app.route('/add_account', methods=['POST'])
def make_tmp_account():
    #json_dict のキーは {"emailaddress"}
    json_dict = request.get_json()
    emailaddress = json_dict["emailaddress"]
    #data_tuple は (success, auth_code, tmp_id) の形
    data_tuple = dbop.tmp_registration(emailaddress)
    if data_tuple[0]:
        mail_thread = threading.Thread(target = sm.send_auth_code, args=(emailaddress, data_tuple[1]))
        mail_thread.start()
        return jsonify({"message": "success", "tmp_id": data_tuple[2]})
    else:
        return jsonify({"message": "failure"})

@app.route("/create_account", methods=["POST"])
def create_account():
    #json_dict のキーは {"auth_code", "tmp_id", "emailaddress", "password", "user_name"}
    json_dict = request.get_json()
    checked_dict = dbop.check_auth_code(json_dict["auth_code"], json_dict["tmp_id"])
    if checked_dict["message"] == "failure":
        return jsonify(checked_dict)
    success = dbop.create_account(json_dict["emailaddress"], json_dict["password"], json_dict["user_name"])
    if not success:
        return jsonify({"message": "failure", "error_message": "アカウント作成に失敗しました。もう一度入力してください。"})
    return jsonify({"message": "success"})
# --- ここまでアカウント作成---

# --- ここからログイン ---
@app.route("/api/check_login", methods=["POST"])
def check_session():
    #session_id = request.cookies.get("session_id")
    #if session_id == None:
    #    return jsonify({"isLogin": False})
    #isLogin = dbop.check_session(session_id)
    #return jsonify({"isLogin": isLogin})
    dbop.reset()
    user_id = verify_login()[0]
    user_name = ""
    is_login = not (user_id == None)
    if is_login:
        user_name = dbop.get_username(user_id)
    return jsonify({"isLogin": is_login, "userName": user_name})

@app.route("/login", methods=["POST"])
def login():
    #json_dict のキーは {"emailaddress", "password"}
    json_dict = request.get_json()

    checked_dict = dbop.check_login(json_dict["emailaddress"], json_dict["password"])
    if checked_dict["message"] == "failure":
        return jsonify(checked_dict)
    
    result_tuple = dbop.make_session(json_dict["emailaddress"])
    if not result_tuple[0]:
        checked_dict["message"] = "failure"
        return jsonify(checked_dict)
    else:
        response = make_response(jsonify(checked_dict))
        session_id = str(result_tuple[1])
        response.set_cookie("session_id", session_id)
        return response
    
@app.route("/api/logout", methods=["POST"])
def logout():
    session_id = request.cookies.get("session_id")
    print(session_id)
    if session_id == None:
        return jsonify({"message": "success"})
    dbop.delete_session(session_id)
    response = make_response(jsonify({"message": "fromLogout"}))
    response.set_cookie("session_id", "", expires = 0)
    return response

# --- ここまでログイン ---

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

    # --- ▼ 1. Cookieによるログイン認証チェック ▼ ---
    session_id_str = request.cookies.get("session_id")
    print(session_id_str)
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

        # --- 3. 作成者を管理者として登録 ---
        new_authorization = EditAuthorization(
            user_id=user_id,
            circle_id=new_circle.circle_id,
            role="owner"
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

    # --- ▼ 1. 認証チェック (verify_login に統一) ▼ ---
    user_id, err, code = verify_login()
    if err:
        return err, code
    # --- ▲ 認証チェック完了 ▲ ---


    circle = Circle.query.get(circle_id)
    if not circle:
        return jsonify({"error": "指定されたサークルが見つかりません"}), 404
        
    
    # --- ▼ 3. 権限チェック ▼ ---
    auth = EditAuthorization.query.filter_by(
        user_id=user_id, 
        circle_id=circle.circle_id
    ).first()
    
    if not auth:
        # ログインはしているが、このサークルの編集権限がない
        return jsonify({"error": "このサークルの編集権限がありません"}), 403
    # --- ▲ 権限チェック完了 ▲ ---


    # --- ▼ 4. タグの処理 (ID→カテゴリ対応表を使用) ▼ ---
    tag_map = {}
    for tag in circle.tags:
        category = TAG_ID_TO_CATEGORY.get(tag.tag_id)
        if category:
            tag_map[category] = tag.tag_id
            
    tags_id_list = [tag_map.get(category) for category in TAG_CATEGORY_ORDER]
    
    # --- ▼ 5. フロントに返すデータを構築 ▼ ---
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

    try:
        db.session.commit() 
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "サーバーエラー (DBコミット失敗)", "detail": str(e)}), 500

    # 辞書をJSONにして返す (200 OK)
    return jsonify(circle_data), 200

#サークル情報更新API
@app.route('/api/circles/<int:circle_id>', methods=['PUT'])
def update_circle(circle_id):
    
    # --- ▼ 1. 認証チェック  ▼ ---
    session_id_str = request.cookies.get("session_id")
    # print(session_id_str) # (デバッグ用)

    if not session_id_str:
        return jsonify({"error": "認証されていません (Cookieが見つかりません)"}), 401
    
    try:
        session_id = int(session_id_str)
    except ValueError:
        return jsonify({"error": "不正なセッション形式です"}), 401

    active_session = db.session.get(Session, session_id)

    if not active_session:
        return jsonify({"error": "セッションが無効です（ログインしていません）"}), 401

    session_timeout_hours = 24 # (24時間に設定)
    
    utc_now = datetime.utcnow()
    
    if active_session.session_last_access_time < utc_now - timedelta(hours=session_timeout_hours):
        db.session.delete(active_session) 
        db.session.commit()
        return jsonify({"error": "セッションが期限切れです。再度ログインしてください"}), 401
    
    # 認証成功
    user_id = active_session.user_id
    active_session.session_last_access_time = utc_now # セッション時刻を更新
    # --- ▲ 認証チェック完了 ▲ ---


    # ---  2. 編集対象のサークルを取得  ---
    circle_to_update = Circle.query.get(circle_id)
    if not circle_to_update:
        return jsonify({"error": "指定されたサークルが見つかりません"}), 404
        
    
    # ---  3. (推奨) 権限チェック  ---
    auth = EditAuthorization.query.filter_by(
        user_id=user_id, 
        circle_id=circle_to_update.circle_id
    ).first()
    
    if not auth:
        # ログインはしているが、このサークルを編集する権限がない
        return jsonify({"error": "このサークルの編集権限がありません"}), 403
    # ---  権限チェック完了  ---


    # --- ▼ 4. FormData からデータを取得 ▼ ---
    data_name = request.form.get("circle_name")
    data_description = request.form.get("circle_description")
    data_fee = request.form.get("circle_fee")
    data_male = request.form.get("number_of_male", circle_to_update.number_of_male)
    data_female = request.form.get("number_of_female", circle_to_update.number_of_female)
    tags_json_str = request.form.get("tags", "[]")
    file = request.files.get("circle_icon_file")
    
    if not data_name or not data_description:
        return jsonify({"error": "circle_name と circle_description は必須です"}), 400

    # --- ▼ 5. 画像ファイルの保存 ▼ ---
    old_icon_path = circle_to_update.circle_icon_path 
    
    if file:
        # 新しいファイルが送信された場合
        saved_path, error = save_image_file(file)
        if error:
            return jsonify({"error": f"画像保存エラー: {error}"}), 400
        
        # DBのパスを新しいものに更新
        circle_to_update.circle_icon_path = saved_path 
    
        # (古いファイルを削除)
        if old_icon_path and old_icon_path.startswith(UPLOAD_BASE_URL):
            try:
                old_filename = old_icon_path.replace(UPLOAD_BASE_URL + '/', "")
                old_file_physical_path = os.path.join(app.config['UPLOAD_FOLDER'], old_filename)
                
                # ファイルが存在すれば削除
                if os.path.exists(old_file_physical_path):
                    os.remove(old_file_physical_path)
                    print(f"古い画像ファイルを削除しました: {old_file_physical_path}")
                
            except Exception as e:
                # (削除に失敗しても、更新処理自体は続行する)
                print(f"古い画像ファイルの削除に失敗: {e}")
        
    
    
    # --- ▼ 6. テキスト情報の更新 ▼ ---
    circle_to_update.circle_name = data_name
    circle_to_update.circle_description = data_description
    circle_to_update.circle_fee = int(data_fee) if data_fee else None
    circle_to_update.number_of_male = int(data_male)
    circle_to_update.number_of_female = int(data_female)

    # --- ▼ 7. タグ情報の更新 ▼ ---
    circle_to_update.tags.clear() 

    try:
        selected_tag_ids = json.loads(tags_json_str)
        # [1, null, 15, null, null, 30] のように null が含まれるため除去
        valid_tag_ids = [tag_id for tag_id in selected_tag_ids if tag_id is not None]
    except json.JSONDecodeError:
        return jsonify({"error": "タグの形式が不正です"}), 400
        
    if valid_tag_ids:
        tags = Tag.query.filter(Tag.tag_id.in_(valid_tag_ids)).all()
        for tag in tags:
            circle_to_update.tags.append(tag)
            
    try:
        db.session.add(active_session) 
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "サーバーエラー", "detail": str(e)}), 500

    return jsonify({
        "message": "サークルを更新しました",
        "circle_id": circle_to_update.circle_id,
        "circle_icon_path": circle_to_update.circle_icon_path
    }), 200

#サークル情報更新⇧




#ここからマイページのコード

#セッション
def verify_login():
    """Cookieからセッションを確認し、user_idを返す"""
    session_id_str = request.cookies.get("session_id")
    if not session_id_str:
        return None, jsonify({"error": "認証されていません (Cookieが見つかりません)"}), 401

    try:
        session_id = int(session_id_str)
    except ValueError:
        return None, jsonify({"error": "不正なセッション形式です"}), 401

    active_session = db.session.get(Session, session_id)
    if not active_session:
        return None, jsonify({"error": "セッションが無効です（ログインしていません）"}), 401

    # 有効期限チェック（24時間）
    session_timeout_hours = 24
    if active_session.session_last_access_time < datetime.utcnow() - timedelta(hours=session_timeout_hours):
        db.session.delete(active_session)
        db.session.commit()
        return None, jsonify({"error": "セッションが期限切れです。再度ログインしてください"}), 401

    # 最終アクセス時刻を更新
    active_session.session_last_access_time = datetime.utcnow()
    db.session.add(active_session)
    db.session.commit()

    return active_session.user_id, None, None


# 編集可能サークル一覧取得
@app.route("/api/mypage", methods=["GET"])
def get_editable_circles():
    #ログインチェック
    user_id, err, code = verify_login()
    if err:
        return err, code

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
    user_id, err, code = verify_login()
    if err:
        return err, code

    # DB処理は不要（画面遷移のみ）
    return jsonify({
        "message": "新しいサークル作成ページへ移動します。",
        "next": "/create-circle"
    }), 200


# 編集権限の付与
@app.route("/api/edit-authorization", methods=["POST"])
def add_edit_authorization():
    # ログインチェック
    user_id, err, code = verify_login()
    if err:
        return err, code
    data = request.get_json() or {}
    circle_id = data.get("circle_id")
    target_email = data.get("target_email")  # メールアドレスを受け取る
    if not circle_id or not target_email:
        return jsonify({"error": "circle_id と target_email が必要です"}), 400
    
    # オーナー権限確認
    owner_auth = EditAuthorization.query.filter_by(
        user_id=user_id, circle_id=circle_id, role="owner"
    ).first()
    if not owner_auth:
        return jsonify({"error": "このサークルに権限を付与する権限がありません"}), 403
    target_user = User.query.filter_by(mail_adress=target_email).first()
    if not target_user:
        return jsonify({"error": "指定したメールアドレスのユーザーが見つかりません"}), 404
    target_user_id = target_user.user_id

    # すでに権限があるか確認
    exists = EditAuthorization.query.filter_by(
        user_id=target_user_id, circle_id=circle_id
    ).first()
    if exists:
        return jsonify({"error": "このユーザーは既に権限を持っています"}), 400
    
    # 権限付与
    new_auth = EditAuthorization(
        user_id=target_user_id,
        circle_id=circle_id,
        role="editor"
    )
    db.session.add(new_auth)
    db.session.commit()
    return jsonify({
        "message": "編集権限を付与しました",
        "circle_id": circle_id,
        "target_email": target_email,
        "target_user_id": target_user_id
    }), 201

# オーナー権限の譲渡
@app.route("/api/transfer-ownership", methods=["POST"])
def transfer_ownership():
    # ログインチェック
    user_id, err, code = verify_login()
    if err:
        return err, code
    data = request.get_json() or {}
    circle_id = data.get("circle_id")
    new_owner_email = data.get("new_owner_email")  # メールアドレスを受け取る
    if not circle_id or not new_owner_email:
        return jsonify({"error": "circle_id と new_owner_email が必要です"}), 400
    
    # 現在のオーナー確認
    current_owner = EditAuthorization.query.filter_by(
        user_id=user_id, circle_id=circle_id, role="owner"
    ).first()
    if not current_owner:
        return jsonify({"error": "オーナーのみが譲渡できます"}), 403
    
    #メールアドレスからユーザー検索
    candidate_user = User.query.filter_by(mail_adress=new_owner_email).first()
    if not candidate_user:
        return jsonify({"error": "指定したメールアドレスのユーザーが存在しません"}), 404
    new_owner_id = candidate_user.user_id

    # 譲渡先がサークル編集者リストに存在するか
    candidate = EditAuthorization.query.filter_by(
        user_id=new_owner_id, circle_id=circle_id
    ).first()

    if not candidate:
        candidate = EditAuthorization(
            user_id=new_owner_id,
            circle_id=circle_id,
            role="editor"
        )
        db.session.add(candidate)

    # 権限の入れ替え
    candidate.role = "owner"
    db.session.delete(current_owner)
    db.session.commit()
    return jsonify({
        "message": "オーナー権限を譲渡しました（元オーナーは退部）",
        "circle_id": circle_id,
        "new_owner_email": new_owner_email,
        "new_owner_id": new_owner_id
    }), 200

# サークル削除API
@app.route("/api/circle/<int:circle_id>", methods=["DELETE"])
def delete_circle(circle_id):
    # ログイン確認
    user_id, err, code = verify_login()
    if err:
        return err, code

    # サークルの存在確認
    circle = Circle.query.get(circle_id)
    if not circle:
        return jsonify({"error": "指定されたサークルが存在しません"}), 404

    # 権限確認
    owner_auth = EditAuthorization.query.filter_by(
        user_id=user_id, circle_id=circle_id, role="owner"
    ).first()
    if not owner_auth:
        return jsonify({"error": "削除権限がありません（オーナーではありません）"}), 403

    # 関連する編集権限をすべて削除
    EditAuthorization.query.filter_by(circle_id=circle_id).delete()

    # サークル自体を削除
    db.session.delete(circle)
    db.session.commit()

    return jsonify({
        "message": f"サークル '{circle.circle_name}' を削除しました。",
        "deleted_circle_id": circle_id
    }), 200


# データベース初期化コマンド
@app.cli.command("initdb")
def initdb():
    #データベースを初期化
    db.drop_all()
    db.create_all()
    print("Database initialized.")

# アプリ起動設定
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5001, debug=True)

#--- ここまでマイページ画面用のコード ---
