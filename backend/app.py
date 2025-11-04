from flask import Flask, jsonify, session,redirect
from flask_cors import CORS # ◀ flask_corsをインポート
from flask import request
import json
from  models import db, Circle, Tag, EditAuthorization, User, Session 
import os
from sqlalchemy.exc import IntegrityError
import database_operating as dbop
import send_mail as sm
from datetime import datetime, timedelta, timezone
import base64
import uuid
import re

# ▼ 画像アップロード先フォルダの *Web URL* プレフィックス
UPLOAD_BASE_URL = "/uploads/" 
# ▼ 許可する画像拡張子
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Flaskアプリケーションのインスタンスを作成
def create_app():
    app = Flask(__name__)

    # DB の場所をプロジェクトの backend ディレクトリ内の project.db に設定
    base_dir = os.path.dirname(__file__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(base_dir, "project.db")
    
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # CORSを有効にする（これでフロントからの通信が許可される）
    # origins=["http://localhost:3000"] のように限定することも可能
    
    #CORS(app,
    #     origins=["http://localhost:3000"],  # Reactのオリジンを明示
    #     supports_credentials=True,
    #     resources={r"/*": {"origins": "http://localhost:3000"}} # すべてのリソース (/*) を許可
    #)
    
    CORS(app, origins="http://localhost:3000",supports_credentials=True)

    #CORS(app, 
     #resources={r"/api/*": {"origins": "http://localhost:3000"}},  #変更クッキー関係
     #supports_credentials=True

    db.init_app(app)
    return app

app = create_app()

# --- ここからテスト用のコード ---

@app.route('/api/hello', methods=['GET'])
def say_hello():
    # JSON形式でメッセージを返す
    return jsonify({"message": "バックエンドからの返事です！🎉"})

#'/hometest'というURLにPOSTリクエストが来たら動く関数
@app.route('/hometest', methods=['POST'])
def search():
    #json_dataのキーは["search_term","field","circle_fee","gender_ration","place","mood","frequency"]
    json_dict = request.get_json()
    #print(json.dumps(json_dict))
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
    #json_dataのキーは["search_term","field","circle_fee","gender_ration","place","mood","frequency"]
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

# ▼▼▼ Base64デコード・保存用ヘルパー関数 ▼▼▼
def save_base64_image(base64_string):
    """
    Base64エンコードされた画像文字列をデコードし、ファイルに保存する。
    "data:image/png;base64,..." のようなヘッダーに対応。
    保存したファイルのWebパス (例: /uploads/xxxxx.png) を返す。
    """
    
    # "data:image/png;base64,..." のヘッダー部分を正規表現で分離
    match = re.match(r'data:image/(?P<ext>.*?);base64,(?P<data>.*)', base64_string)
    
    if match:
        image_ext = match.group('ext').lower() # 'png' や 'jpeg' など
        base64_data = match.group('data')
        
        # 許可された拡張子かチェック (ALLOWED_EXTENSIONS がグローバルにある前提)
        if image_ext not in ALLOWED_EXTENSIONS:
            print(f"許可されていない拡張子です: {image_ext}")
            return None
    else:
        # ヘッダーがない場合、純粋なBase64データとみなし、拡張子をpngにフォールバック
        # (ただし、セキュリティ的には非推奨)
        print("Base64ヘッダーが見つかりません。pngとして扱います。")
        image_ext = "png"
        base64_data = base64_string

    try:
        # Base64データをデコード
        decoded_data = base64.b64decode(base64_data)
        
        # 重複しないファイル名を生成
        filename = f"{uuid.uuid4()}.{image_ext}"
        
        # サーバー上の保存先フルパス
        # (app は Flask アプリケーションインスタンス)
        save_location = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # デコードしたバイナリデータをファイルに書き込む
        with open(save_location, "wb") as f:
            f.write(decoded_data)
            
        # DBに保存するパスは、Webからアクセス可能なURLパス
        saved_db_path = f"{UPLOAD_BASE_URL}{filename}" # (例: /uploads/uuid.png)
        print(f"Base64画像ファイル {filename} を保存しました。")
        return saved_db_path

    except (base64.binascii.Error, IOError) as e:
        print(f"Base64画像のデコードまたは保存に失敗: {e}")
        return None
    except Exception as e:
        print(f"予期せぬエラー (Base64保存): {e}")
        return None
# ▲▲▲ ヘルパー関数ここまで ▲▲▲


#'/api/circles'というURLにPOSTリクエストが来たら動く関数#
@app.route('/api/circles', methods=['POST'])
def add_circle():

    # # --- ▼ 1. Cookie からセッションIDを取得 ▼ ---
    # session_id_str = request.cookies.get("session_id")

    # if not session_id_str:
    #     # ヘッダーにセッションIDがない
    #     return jsonify({"error": "認証されていません (Cookieが見つかりません)"}), 401

    # try:
    #     session_id = int(session_id_str)
    # except ValueError:
    #     # IDが数値ではない
    #     return jsonify({"error": "不正なセッションID形式です"}), 401

    # # データベースでセッションIDを検索
    # active_session = db.session.get(Session, session_id)

    # if not active_session:
    #     # セッションが存在しない（ログアウト済みか不正なID）
    #     return jsonify({"error": "セッションが無効です（ログインしていません）"}), 401

    # # --- 2. セッションの有効期限チェック ---
    # session_timeout_hours = 24
    # utc_now = datetime.now(timezone.utc) # タイムゾーン対応の現在時刻

    # session_last_access = active_session.session_last_access_time
    # if not session_last_access.tzinfo:
    #      session_last_access = session_last_access.replace(tzinfo=timezone.utc)
         
    # if session_last_access < utc_now - timedelta(hours=session_timeout_hours):
    #     db.session.delete(active_session) # 期限切れセッションを削除
    #     db.session.commit()
    #     return jsonify({"error": "セッションが期限切れです。再度ログインしてください"}), 401
    
    # # 認証成功。セッションに紐づくユーザーIDを取得
    # user_id = active_session.user_id
    
    # # (任意) 最終アクセス時刻を更新（セッション期限を延長する場合）
    # active_session.session_last_access_time = utc_now
    # # --- ▲ 認証チェック完了 ▲ ---

    # --- 3. JSONでデータを受け取る ---
    data = request.get_json() or {}

    # 必須チェック（circle_name と circle_description が必須）
    if not data.get('circle_name') or not data.get('circle_description'):
        return jsonify({"error": "circle_name と circle_description は必須です"}), 400

    # --- ▼ 4. Base64画像の処理 ▼ ---
    # (注) フロントエンドは "circle_icon_path" ではなく
    # "circle_icon_base64" のようなキーでBase64文字列を送る想定
    
    base64_image_string = data.get("circle_icon_base64") # Base64文字列を取得
    saved_db_path = None # DBに保存するパス

    if base64_image_string:
        # ヘルパー関数を呼び出して画像を保存し、DB用のパスを取得
        saved_db_path = save_base64_image(base64_image_string)
    # --- ▲ Base64画像の処理完了 ▲ ---


    # サーバーが自動で発番するので circle_id は無視
    circle_data = {
        "circle_name": data.get("circle_name"),
        "circle_description": data.get("circle_description"),
        "circle_fee": data.get("circle_fee"),
        "number_of_male": data.get("number_of_male", 0),
        "number_of_female": data.get("number_of_female", 0),
        # ▼ Base64から変換・保存したサーバー上のパスをDBに登録
        "circle_icon_path": saved_db_path 
    }
    # None の値は渡さない（DBのデフォルトを使いたい場合）
    circle_data = {k: v for k, v in circle_data.items() if v is not None}

    new_circle = Circle(**circle_data)

    # タグ紐付け（任意）
    selected_tag_ids = data.get("tags", [])
    if selected_tag_ids:
        tags = Tag.query.filter(Tag.tag_id.in_(selected_tag_ids)).all()
        for tag in tags:
            new_circle.tags.append(tag)

    try:
        db.session.add(new_circle)
        # 
        # ▼ 2. サークルを先にコミットし、new_circle.circle_id を確定させる
        # 
        db.session.commit() 

        # # --- ▼ 3. 作成者をサークルの管理者として権限テーブルに登録 ▼ ---
        # # (認証を有効にしたため、こちらも有効化)
        # new_authorization = EditAuthorization(
        #     user_id=user_id,                # ◀ 認証して取得した user_id を使用
        #     circle_id=new_circle.circle_id, # 今作成したサークルのID
        #     role="admin"                    # "admin" や "owner" などの役割を付与
        # )
        # db.session.add(new_authorization)
        
        # # 最終アクセス時刻の更新(active_session)も、ここでまとめてコミット
        # db.session.add(active_session) 
        # db.session.commit() # 権限とセッション更新をコミット

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": "データベースエラー（整合性違反など）", "detail": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "サーバーエラー", "detail": str(e)}), 500

    return jsonify({
        "message": "サークルを追加しました",
        "circle_id": new_circle.circle_id
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