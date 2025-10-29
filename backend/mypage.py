from flask import Flask,request,jsonify,session
from flask_cors import CORS
from models import db, Circle, User, Session, EditAuthorization

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "supersecretkey-for-session"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "supersecretkey-for-session"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


# 編集可能サークル一覧取得
@app.route("/api/mypage", methods=["GET"])
def get_editable_circles():
    #ログインチェック
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


# 編集権限の付与
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

