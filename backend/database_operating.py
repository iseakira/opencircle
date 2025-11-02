import sqlite3
import json
import random
import secrets
import string
import datetime

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
"""
import sys
import os
from sqlalchemy.exc import IntegrityError
from backend.app import create_app
from backend.models import db, Tag
"""

def get_circle_search(json_dict):
    """
    サークル検索用の関数。受け取った文字列とタグをもとにサークルを検索して返す。
    termは部分一致させる。サークルの中でtagsをすべて含むサークルを返す。
    {"search_term":"","tags":[]}
    """
    conn = sqlite3.connect('project.db')
    cursor = conn.cursor()
    # tmp_dictは検索内容をidに変換して保存する
    tmp_dict = dict()
    tmp_dict["search_term"] = json_dict["search_term"]
    
    sql = '''
    SELECT c.circle_name, c.circle_iconpath
    FROM Circle AS c
    WHERE c.circle_name LIKE ?
    '''

    cursor.execute(sql, ('%' + tmp_dict["search_term"] + '%',))
    # TagとCircleの間の関係性の名前はどれだ？
    # res = cursor.execute("SELECT c.circle_name, c.circle_iconpath " \
    #                     "FROM Circle AS c " \
    #                     "JOIN circle_tag_table AS ctt ON c.circle_id = ctt.circle_id " \
    #                     "WHERE ")#ここどうしようか考えてる
    # res.fetchall()
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
                    "VALUES (?, ?, datetime('now','+1 minute'), datetime('now'), 0)", (tmp_id,auth_code))
    conn.commit()
    cursor.close()
    conn.close()
    return (auth_code,tmp_id)
    
def check_auth_code(auth_code, tmp_id):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    res = cursor.execute("SELECT auth_code, account_expire_time, account_create_time, attempt_count " \
                        "FROM account_creates WHERE tmp_id = ?", (tmp_id))
    tmp_user_db = res.fetchone()
    #データがない場合
    if tmp_user_db == None:
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "セッション情報がありません。メールアドレスの入力からやり直してください。"}
    #回数制限を超えた場合
    if tmp_user_db[3] > 3:
        cursor.execute("DELETE FROM account_creates WHERE tmp_id = ?", (tmp_id))
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "コードの入力の間違いが一定回数を越えました。メールアドレスの入力からやり直してください。"}
    #期限が切れている場合
    if datetime.datetime.strptime(tmp_user_db[1], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now():
        cursor.execute("DELETE FROM account_creates WHERE tmp_id = ?", (tmp_id))
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "認証コードの期限が過ぎています。メールアドレスの入力からやり直してください。"}
    #認証コードが間違っている場合
    if tmp_user_db[0] != auth_code:
        cursor.execute("UPDATE account_creates SET attempt_count = attmpt_count + 1 WHERE tmp_id = ?", (tmp_id))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "認証コードが間違っています。もう一度入力してください。"}
    #認証成功
    cursor.execute("DELETE FROM account_creates WHERE tmp_id = ?", (tmp_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "success"}

def create_account(emailaddress, password, user_name):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    #ここもuser_id重複時の処理がいる
    user_id = int(''.join(secrets.choice(string.digits) for _ in range(6)))
    cursor.execute("INSERT INTO users (user_id, user_name, mail_adress, password) " \
                    "VALUES (?, ?, ?, ?)", (user_id, user_name, emailaddress, password))
    conn.commit()
    cursor.close()
    conn.close()

def check_login(emailaddress, password):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    res = cursor.execute("SELECT password FROM user WHERE mail_adress = ?", (emailaddress))
    user_tuple = res.fetchone()
    cursor.close()
    conn.close()
    if password != user_tuple[0]:
        return {"message": "failure"}
    else:
        return {"message": "success"}
    
def make_session(emailaddress):
    conn = sqlite3.connect("project_db")
    cursor = conn.cursor()
    res = cursor.execute("SELECT user_id FROM users WHERE maila_adress = ?",(emailaddress))
    user_id = int(res[0])
    session_id = int(''.join(secrets.choice(string.digits) for _ in range(16)))
    complete = False
    for i in range(5):
        try:
            cursor.execute("INSERT INTO sessions (session_id, user_id, session_create_time, session_last_access_time) " \
                            "VALUES (?, ?, datetime('now'), datetime('now'))",(session_id, user_id))
            conn.commit()
        except sqlite3.IntegrityError:
            session_id = int(''.join(secrets.choice(string.digits) for _ in range(16)))
        else:
            complete = True
            break
    cursor.close()
    conn.close()
    return (complete, {"session_id": session_id})