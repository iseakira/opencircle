from flask import Flask, jsonify, redirect
from flask_cors import CORS # ◀ flask_corsをインポート
from flask import request
import json
from models import db, Circle, Tag  # models.py に db = SQLAlchemy() とモデル定義がある前提
import os
from sqlalchemy.exc import IntegrityError
import database_oparating as dbop
import send_mail as sm

# Flaskアプリケーションのインスタンスを作成
def create_app():
    app = Flask(__name__)

    # DB の場所をプロジェクトの backend ディレクトリ内の project.db に設定
    base_dir = os.path.dirname(__file__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(base_dir, "project.db")
    
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # CORSを有効にする（これでフロントからの通信が許可される）
    # origins=["http://localhost:3000"] のように限定することも可能
    CORS(app, 
     resources={r"/api/*": {"origins": "http://localhost:3000"}},  #変更クッキー関係
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
    #f.close

    return jsonify([{"circle_icon_path": "/test_image/head_image.png",
                    "circle_name": "サークルAの名前",
                    "tag_name":"サークルAの分野のタグ"},
                    {"circle_icon_path": "サークルBのアイコン",
                    "circle_name": "サークルBの名前",
                    "tag_name":"サークルBの分野のタグ"}])

@app.route("/add_account", methods=["POST"])
def make_tmp_account():
    json_dict = request.get_json()
    emailaddress = json_dict["emailaddress"]
    #data_tuple は (auth_code, tmp_id) の形
    data_tuple = dbop.tmp_registration(emailaddress)
    sm.send_auth_code(emailaddress, data_tuple[0])
    return jsonify({"message": "success", "tmp_id": data_tuple[1]})

"""
@app.route("/create_account", methods=["POST"])
def create_account():
    json_dict = request.get_json()
    checked_dict = dbop.check_auth_code(json_dict["auth_code"], json_dict["tmp_id"])
"""

#'/api/circles'というURLにPOSTリクエストが来たら動く関数#
@app.route('/api/circles', methods=['POST'])
def add_circle():
    data = request.get_json() or {}

    # 必須チェック（circle_name と circle_description が必須）
    if not data.get('circle_name') or not data.get('circle_description'):
        return jsonify({"error": "circle_name と circle_description は必須です"}), 400

    # サーバーが自動で発番するので circle_id は無視
    circle_data = {
        "circle_name": data.get("circle_name"),
        "circle_description": data.get("circle_description"),
        "circle_fee": data.get("circle_fee"),
        "number_of_male": data.get("number_of_male", 0),
        "number_of_female": data.get("number_of_female", 0),
        "circle_icon_path": data.get("circle_icon_path")
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
        db.session.commit()
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
