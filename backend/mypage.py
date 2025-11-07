from flask import Flask,request,jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from models import db, Circle, User, Session, EditAuthorization

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "supersecretkey-for-session"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

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
    target_user_id = data.get("target_user_id")

    if not circle_id or not target_user_id:
        return jsonify({"error": "circle_id と target_user_id が必要です"}), 400

    owner_auth = EditAuthorization.query.filter_by(
        user_id=user_id, circle_id=circle_id
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

# オーナー権限の譲渡
@app.route("/api/transfer-ownership", methods=["POST"])
def transfer_ownership():
    # ログイン確認
    user_id, err, code = verify_login()
    if err:
        return err, code
    
    # リクエストデータ取得
    data = request.get_json() or {}
    circle_id = data.get("circle_id")
    new_owner_id = data.get("new_owner_id")
    if not circle_id or not new_owner_id:
        return jsonify({"error": "circle_id と new_owner_id が必要です"}), 400
    
    # 現オーナー確認
    current_owner = EditAuthorization.query.filter_by(
        user_id=user_id, circle_id=circle_id, role="owner"
    ).first()
    if not current_owner:
        return jsonify({"error": "オーナーのみが譲渡できます"}), 403
    
    # 譲渡先ユーザー確認
    candidate = EditAuthorization.query.filter_by(
        user_id=new_owner_id, circle_id=circle_id
    ).first()
    if not candidate:
        return jsonify({"error": "譲渡先のユーザーが見つかりません"}), 400
    
    # 権限の入れ替え
    candidate.role = "owner" 
    db.session.delete(current_owner)  
    
    # DB反映
    db.session.commit()
    return jsonify({
        "message": "オーナー権限を譲渡し、元オーナーは退部しました",
        "circle_id": circle_id,
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