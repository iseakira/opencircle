from app import app
from models import db
from sqlalchemy.sql import text


def init_db():
    tags_list = [
        {"tag_id": 0, "tag_name": "未選択"},
        {"tag_id": 1, "tag_name": "運動"},
        {"tag_id": 2, "tag_name": "文化"},
        {"tag_id": 3, "tag_name": "音楽"},
        {"tag_id": 4, "tag_name": "学生自治"},
        {"tag_id": 5, "tag_name": "無料"},
        {"tag_id": 6, "tag_name": "2000円未満"},
        {"tag_id": 7, "tag_name": "2000円以上"},
        {"tag_id": 8, "tag_name": "男性多め"},
        {"tag_id": 9, "tag_name": "女性多め"},
        {"tag_id": 10, "tag_name": "男女半々"},
        {"tag_id": 11, "tag_name": "学内"},
        {"tag_id": 12, "tag_name": "学外"},
        {"tag_id": 13, "tag_name": "賑やか"},
        {"tag_id": 14, "tag_name": "落ち着いている"},
        {"tag_id": 15, "tag_name": "週3未満"},
        {"tag_id": 16, "tag_name": "週3以上"},
        {"tag_id": 17, "tag_name": "不定期"}
    ]

    with app.app_context():
        db.create_all()
        print("DBテーブルを作成しました。")
    
        try:
            for tag in tags_list:
                sql = text("INSERT INTO tags (tag_id, tag_name) VALUES (:tag_id, :tag_name)")
                db.session.execute(sql, {"tag_id": tag["tag_id"], "tag_name": tag["tag_name"]})
            db.session.commit()
            print("タグデータを挿入しました。")
        except Exception as e:
            db.session.rollback()
            print("タグデータの挿入中にエラーが発生しました:", e)

if __name__ == '__main__':
    init_db()