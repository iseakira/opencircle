from flask import Flask
from models import db
import insert_tag
import os

def create_database():
    # アプリケーションの仮インスタンスを作成
    app = Flask(__name__)

    # データベースのファイル名を指定（ここで project.db と命名）
    db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'project.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # dbをアプリに紐付ける
    db.init_app(app)

    # データベース作成実行
    with app.app_context():
        # 既存のテーブルがあってもエラーにならないよう作成
        db.create_all()
        print(f"データベースを作成しました: {db_path}")
        insert_tag.it()

if __name__ == '__main__':
    create_database()