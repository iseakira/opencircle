import sqlite3
import json
import random
import secrets
import string
import datetime

import sys
import os
from sqlalchemy.exc import IntegrityError
from .app import create_app
from .models import db, Tag

def get_initial_circles():
    """
    ホーム画面用に全サークルを取得して返す。
    返すフィールド: circle_id, circle_icon_path, circle_name, field
    field はそのサークルに紐づくタグのうち1つ目の tag_name を返す（存在しなければ None）
    """
 
    # データベースに接続
    conn = sqlite3.connect('project.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    sql = '''
    SELECT
      c.circle_id,
      c.circle_icon_path,
      c.circle_name,
      (
        SELECT t.tag_name
        FROM tags t
        JOIN circle_tag AS ct ON t.tag_id = ct.tag_id
        WHERE ct.circle_id = c.circle_id
        LIMIT 1
      ) AS field
    FROM circles c
    ORDER BY c.circle_id ASC
    '''

    cur.execute(sql)
    rows = cur.fetchall()

    # 結果を辞書のリストに変換
    items = []
    for r in rows:
        items.append({
            'circle_id': r['circle_id'],
            'circle_icon_path': r['circle_icon_path'],
            'circle_name': r['circle_name'],
            'field': r['field'] if 'field' in r.keys() else None
        })

    cur.close()
    conn.close()
    return items

import sys
import os
from sqlalchemy.exc import IntegrityError
from backend.app import create_app
from backend.models import db, Tag


def get_circle_search(json_dict):
    """
    サークル検索用の関数。受け取った文字列とタグをもとにサークルを検索して返す。
    """
    conn = sqlite3.connect('project.db')
    cursor = conn.cursor()
    #tmp_dictは検索内容をidに変換して保存する
    tmp_dict = dict()
    tmp_dict["search_term"]  = json_dict["search_term"]
    
    sql = '''
    

    '''
    #TagとCircleの間の関係性の名前はどれだ？
    # res = cursor.execute("SELECT c.circle_name, c.circle_iconpath " \
    #                     "FROM Circle AS c " \
    #                     "JOIN circle_tag_table AS ctt ON c.circle_id = ctt.circle_id " \
    #                     "WHERE ")#ここどうしようか考えてる
    res.fetchall()
    cursor.close()
    conn.close()

def get_circle_detail(circle_id):
    """
    指定した circle_id の詳細情報を DB から取得して辞書で返す。
    返却フィールド:
      - circle_name (str)
      - circle_description (str)
      - circle_fee (int or None)
      - number_of_male (int or None)
      - number_of_female (int or None)
      - circle_icon_path (str or None)

    見つからなければ None を返す。
    """
    conn = sqlite3.connect('project.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    sql = '''
    SELECT circle_name, circle_description, circle_fee, number_of_male, number_of_female, circle_icon_path
    FROM circles
    WHERE circle_id = ?
    LIMIT 1
    '''

    cur.execute(sql, (circle_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row is None:
        return None

    def to_int(v):
        try:
            return int(v) if v is not None else None
        except Exception:
            return None

    return {
        'circle_name': row['circle_name'],
        'circle_description': row['circle_description'],
        'circle_fee': to_int(row['circle_fee']),
        'number_of_male': to_int(row['number_of_male']),
        'number_of_female': to_int(row['number_of_female']),
        'circle_icon_path': row['circle_icon_path']
    }
    
def tmp_registration(mailaddress):
    #database.dbは仮
    conn = sqlite3.connect('project.db')
    cursor = conn.cursor()
    auth_code = random.randint(100000, 999999)
    tmp_id = int(''.join(secrets.choice(string.digits) for _ in range(6)))
    #tmp_idが重複した時の処理を後で書く
    cursor.execute("INSERT INTO account_creates (tmp_id, auth_code, account_expire_time, account_create_time, attempt_count) " \
                    "VALUES ({}, {}, datetime('now','+10 minute'), datetime('now'), 0)".format(tmp_id,auth_code))
    cursor.close()
    conn.close()
    return (auth_code,tmp_id)
    
def check_auth_code(auth_code, tmp_id):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    res = cursor.execute("SELECT auth_code, account_expire_time, account_create_time, attempt_count " \
                        "FROM account_creates WHERE tmp_id = {}".format(tmp_id))
    tmp_user_db = res.fetchone()
    #データがない場合
    if tmp_user_db == None:
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "セッション情報がありません。メールアドレスの入力からやり直してください。"}
    #回数制限を超えた場合
    if tmp_user_db["attempt_count"] > 3:
        cursor.execute("DELETE FROM account_creates WHERE tmp_id = {}".format(tmp_id))
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "コードの入力の間違いが一定回数を越えました。メールアドレスの入力からやり直してください。"}
    #期限が切れている場合
    if tmp_user_db["account_expire_time"] > datetime.datetime.now():
        cursor.execute("DELETE FROM account_creates WHERE tmp_id = {}".format(tmp_id))
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "認証コードの期限が過ぎています。メールアドレスの入力からやり直してください。"}
    #認証コードが間違っている場合
    if tmp_user_db["auth_code"] != auth_code:
        cursor.execute("UPDATE account_creates SET attempt_count = attmpt_count + 1 WHERE tmp_id = {}".format(tmp_id))
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "認証コードが間違っています。もう一度入力してください。"}
    #認証成功
    cursor.close()
    conn.close()
    return {"message": "success"}

def create_account(emailaddress, password, user_name):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    #ここもuser_id重複時の処理がいる
    user_id = int(''.join(secrets.choice(string.digits) for _ in range(6)))
    cursor.execute("INSERT INTO users (user_id, user_name, mail_adress, password) " \
                    "VALUES ({}, {}, {}, {})".format(user_id, user_name, emailaddress, password))
    cursor.close()
    conn.close()

def add_initial_tags():
    """
    データベースに初期タグデータを投入する関数
    """
    
    # App.py の create_app() を使って Flask アプリケーションを初期化
    app = create_app()
    
    # 'with app.app_context():' の中でDB操作を行う
    with app.app_context():
        print("データベースへの接続を開始します...")
        
        # データベースに追加するデータ
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
        
        # 既にデータが投入されていないか、ID=0 でチェック
        existing_tag = db.session.get(Tag, 0)
        
        if existing_tag:
            print(f"ID=0 のタグ '{existing_tag.tag_name}' が既に存在するため、処理をスキップします。")
            return

        print("初期タグデータを追加します...")
        
        tags_to_add = []
        for tag_data in tags_list:
            # models.py の Tag クラスのインスタンスを作成
            new_tag = Tag(tag_id=tag_data["tag_id"], tag_name=tag_data["tag_name"])
            tags_to_add.append(new_tag)

        try:
            # データをセッションに追加 (add_all で一括追加)
            db.session.add_all(tags_to_add)
            # データベースにコミット（変更を保存）
            db.session.commit()
            print(f"正常に {len(tags_to_add)} 件のタグを追加しました。")
        
        except IntegrityError:
            # 主キー(tag_id)が重複した場合など
            db.session.rollback() # エラーが起きたら変更を元に戻す
            print("エラー: データの整合性違反。既にデータが存在する可能性があります。")
        except Exception as e:
            db.session.rollback()
            print(f"予期せぬエラーが発生しました: {e}")

