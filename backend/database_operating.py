import sqlite3
import json
import random
import secrets
import string
import datetime
from models import db, Circle, EditAuthorization
from sqlalchemy.exc import IntegrityError
import logging # printの代わりにloggingを使うことを推奨
import threading
import time

# サークル情報取得関数（まだ使用されていません）initial_circles、search_circles用
def get_circle_prof(circle_id):
    """
    指定した circle_id のサークルの基本情報を取得して辞書で返す。
    返却フィールド: circle_name, circle_description, circle_icon_path
    """
    conn = sqlite3.connect('project.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    sql = '''
    SELECT circle_name, circle_description, circle_icon_path
    FROM circles
    WHERE circle_id = ?
    LIMIT 1
    '''

    cur.execute(sql, (circle_id,))
    row = cur.fetchone()

    cur.close()
    conn.close()

    return {
        'circle_id': circle_id,
        'circle_name': row['circle_name'],
        'circle_description': row['circle_description'],
        'circle_icon_path': row['circle_icon_path']
    }

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
        FROM tags AS t
        JOIN circle_tag AS ct ON t.tag_id = ct.tag_id
        WHERE ct.circle_id = c.circle_id
        LIMIT 1
      ) AS field
    FROM circles AS c
    ORDER BY c.circle_name;
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
def search_circles(json_dict):
    """
    サークル検索用の関数。受け取った文字列とタグをもとにサークルを検索して返す。
    termは部分一致させる。サークルの中でtagsをすべて含むサークルを返す。
    {"search_term":"","tags":[]}
    """
    conn = sqlite3.connect('project.db')
    cursor = conn.cursor()
    raw_search_term = json_dict.get("search_term", "")
    keywords = [k.strip() for k in raw_search_term.split() if k.strip()]
    tags = [tag for tag in json_dict.get("tags", []) if tag]
    params = []
    tag_placeholders = ','.join(['?'] * len(tags)) if tags else 'NULL'
    keyword_where_sql = "1=1"
    if keywords:
        keyword_conditions = []
        for _ in keywords:
            keyword_conditions.append("(c.circle_name LIKE ? OR c.circle_description LIKE ?)")
        
        keyword_where_sql = " AND ".join(keyword_conditions)
        for keyword in keywords:
            params.extend([f'%{keyword}%', f'%{keyword}%'])
            
    if tags:
        params.extend(tags)
        params.extend(tags)
        params.extend(tags)
        params.extend(tags)
    params.append(len(tags))
    
    sql = f'''
    SELECT c.circle_id, c.circle_name, c.circle_icon_path, c.circle_description, MAX(t.tag_name) AS field_name
    FROM circles AS c
    LEFT JOIN circle_tag AS ct ON c.circle_id = ct.circle_id
    LEFT JOIN circle_tag AS ct_field ON c.circle_id = ct_field.circle_id
    LEFT JOIN tags AS t ON ct_field.tag_id = t.tag_id AND t.tag_id IN (1, 2, 3, 4)
    WHERE ({keyword_where_sql})
        AND (
            NOT EXISTS (SELECT 1 FROM tags WHERE tag_id IN ({tag_placeholders}))
            OR ct.tag_id IN ({tag_placeholders})
        )
    GROUP BY c.circle_id, c.circle_name, c.circle_icon_path, c.circle_description
    HAVING
        -- 3. タグのAND条件 (タグが空なら常に真、タグがあるならCOUNTがタグ総数と一致)
        (
            NOT EXISTS (SELECT 1 FROM tags WHERE tag_id IN ({tag_placeholders}))
            OR COUNT(DISTINCT CASE WHEN ct.tag_id IN ({tag_placeholders}) THEN ct.tag_id END) = ?
        )
    ORDER BY
        c.circle_name;
    '''
    
    try:
        cursor.execute(sql, tuple(params))
        results_tuples = cursor.fetchall()
        results_list_of_dicts = []
        for row in results_tuples:
            item = {
                "circle_id": row[0],
                "circle_name": row[1],
                "circle_icon_path": row[2],
                "circle_description": row[3],
                "field": row[4]
            }
            results_list_of_dicts.append(item)
            
        # 3. Reactが期待する「辞書のリスト」を返す
        return results_list_of_dicts

    except sqlite3.Error as e:
        print(f"データベースエラーが発生しました: {e}")
        raise
    

    finally:
        cursor.close()
        conn.close()


def get_circle_detail(circle_id):
    """
    指定した circle_id の詳細情報を DB から取得して辞書で返す。
    返却フィールド:circle_name, circle_description, circle_fee, number_of_male, number_of_female, circle_icon, tags (リスト)
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

    tag_sql = '''
    SELECT t.tag_name
    FROM tags AS t
    JOIN circle_tag AS ct ON t.tag_id = ct.tag_id
    WHERE ct.circle_id = ?
    '''

    cur.execute(tag_sql, (circle_id,))
    tags = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()

    return {
        'circle_name': row['circle_name'],
        'circle_description': row['circle_description'],
        'circle_fee': row['circle_fee'],
        'number_of_male': row['number_of_male'],
        'number_of_female': row['number_of_female'],
        'circle_icon': row['circle_icon_path'],
        'tags': tags
    }
    
def tmp_registration(mailaddress):
    #database.dbは仮
    conn = sqlite3.connect('project.db')
    cursor = conn.cursor()
    check_user_exist = cursor.execute("SELECT * FROM users WHERE mail_adress = ?", (mailaddress,))
    if check_user_exist.fetchone() != None:
        cursor.close()
        conn.close()
        return (False,)

    auth_code = random.randint(100000, 999999)
    tmp_id = int(''.join(secrets.choice(string.digits) for _ in range(6)))
    complete = False
    for i in range(5):
        try:
            cursor.execute("INSERT INTO account_creates (tmp_id, auth_code, account_expire_time, account_create_time, attempt_count) " \
                            "VALUES (?, ?, datetime('now','+5 minute'), datetime('now'), 0)", (tmp_id,auth_code))
            conn.commit()
        except sqlite3.IntegrityError:
            tmp_id = int(''.join(secrets.choice(string.digits) for _ in range(6)))
        else:
            complete = True
            break
    cursor.close()
    conn.close()
    return (complete, auth_code, tmp_id)
    
def check_auth_code(auth_code, tmp_id):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    res = cursor.execute("SELECT auth_code, account_expire_time, account_create_time, attempt_count " \
                        "FROM account_creates WHERE tmp_id = ?", (tmp_id,))
    tmp_user_db = res.fetchone()
    #データがない場合
    if tmp_user_db == None:
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "セッション情報がありません。メールアドレスの入力からやり直してください。"}
    #回数制限を超えた場合
    if tmp_user_db[3] > 3:
        cursor.execute("DELETE FROM account_creates WHERE tmp_id = ?", (tmp_id,))
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "コードの入力の間違いが一定回数を越えました。メールアドレスの入力からやり直してください。"}
    #期限が切れている場合
    if not datetime.datetime.strptime(tmp_user_db[1], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now():
        print(tmp_user_db[1])
        print(datetime.datetime.now())
        cursor.execute("DELETE FROM account_creates WHERE tmp_id = ?", (tmp_id,))
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "認証コードの期限が過ぎています。メールアドレスの入力からやり直してください。"}
    #認証コードが間違っている場合
    if tmp_user_db[0] != auth_code:
        cursor.execute("UPDATE account_creates SET attempt_count = attempt_count + 1 WHERE tmp_id = ?", (tmp_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "failure", "error_message": "認証コードが間違っています。もう一度入力してください。"}
    #認証成功
    cursor.execute("DELETE FROM account_creates WHERE tmp_id = ?", (tmp_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "success"}

def create_account(emailaddress, password, user_name):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    user_id = int(''.join(secrets.choice(string.digits) for _ in range(6)))
    complete = False
    for i in range(5):
        try:
            print(user_id)
            cursor.execute("INSERT INTO users (user_id, user_name, mail_adress, password) " \
                            "VALUES (?, ?, ?, ?)", (user_id, user_name, emailaddress, password))
            conn.commit()
        except sqlite3.Error as e:
            print(e)
            user_id = int(''.join(secrets.choice(string.digits) for _ in range(6)))
        else:
            complete = True
            break
    cursor.close()
    conn.close()
    return complete

def check_login(emailaddress, password):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    res = cursor.execute("SELECT password FROM users WHERE mail_adress = ?", (emailaddress,))
    user_tuple = res.fetchone()
    cursor.close()
    conn.close()
    if user_tuple == None or password != user_tuple[0]:
        return {"message": "failure"}
    else:
        return {"message": "success"}
    
def make_session(emailaddress):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    res = cursor.execute("SELECT user_id FROM users WHERE mail_adress = ?",(emailaddress,))
    user_id = int(res.fetchone()[0])
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
    return (complete, session_id)

def get_username(user_id):
    conn = sqlite3("project.db")
    cursor = conn.cursor()
    res = cursor.execute("SELECT user_name FROM users WHERE user_id = ?", (user_id,))
    user_name_tuple = res.fetchone()
    cursor.close()
    conn.close()
    return user_name_tuple[0]

# veryfy_loginに置き換えたから使われてない
def check_session(session_id):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    res = cursor.execute("SELECT session_create_time, session_last_access_time " \
                            "FROM sessions WHERE session_id = ?", (session_id,))
    session_data_tuple = res.fetchone()
    if session_data_tuple == None:
        return False
    if not datetime.datetime.strptime(session_id[0], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() + datetime.timedelta(days=7):
        cursor.execute("DELETE FROM sessions WHEWE session_id = ?", (session_id,))
        conn.commit()
        cursor.close()
        return False
    if not datetime.datetime.strptime(session_id[1], '%Y-%m-%d %H:%M:%S') > datetime.datetime.now() + datetime.timedelta(days=1):
        cursor.execute("DELETE FROM sessions WHEWE session_id = ?", (session_id,))
        conn.commit()
        cursor.close()
        return False
    cursor.close()
    conn.close()
    return True

def delete_session(session_id):
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    try:
        print(session_id + "wo kesuzo")
        cursor.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))
        conn.commit()
    except:
        print("time over")
    cursor.close()
    conn.close()

def cleanup_session_tmpid():
    conn = sqlite3.connect("project.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sessions " \
                    "WHERE session_create_time < datetime('now', '-7 days') " \
                    "OR session_last_access_time < datetime('now', '-1 days')")
    cursor.execute("DELETE FROM account_creates " \
                    "WHERE account_expire_time < datetime('now')")
    conn.commit()
    cursor.close()
    conn.close()
    #1時間に一回
    time.sleep(3600)
    clean_thread = threading.Thread(target = cleanup_session_tmpid, daemon = True)
    clean_thread.start()

def delete_circle_by_id(circle_id):
    """
    指定された circle_id のサークルと関連データを削除するヘルパー関数。
    
    前提：この関数はFlaskのアプリケーションコンテキスト内で呼び出される
          (例: APIルート関数の中から呼び出される)。
          
    引数:
        circle_id (int): 削除対象のサークルID。
        
    戻り値:
        tuple: (success, message_or_error)
               成功時 (True, "削除しました")
               失敗時 (False, "エラーメッセージ")
    """
    
    # 1. 削除対象のサークルを取得
    # (SQLAlchemy 1.4+ の db.session.get を使用)
    circle_to_delete = db.session.get(Circle, circle_id)
    
    if not circle_to_delete:
        logging.warning(f"削除対象のサークル ID:{circle_id} が見つかりません。")
        return (False, "指定されたサークルが見つかりません")

    try:
        # 2. 関連する編集権限(EditAuthorization)をすべて削除
        #    (models.pyで cascade="all, delete" が設定されていれば
        #     自動で削除されますが、明示的に行う方が安全です)
        
        # 1.x style (Flask-SQLAlchemy default)
        EditAuthorization.query.filter_by(circle_id=circle_id).delete()
        
        # 3. 関連するタグの紐付けを解除
        #    (circle_tag_table から関連レコードが削除されます)
        circle_to_delete.tags.clear()

        # 4. サークル本体を削除
        db.session.delete(circle_to_delete)
        
        # 5. 変更をデータベースにコミット（保存）
        db.session.commit()
        
        logging.info(f"サークル ID:{circle_id} が正常に削除されました。")
        return (True, f"サークル ID:{circle_id} を削除しました")

    except IntegrityError as e:
        # エラーが発生した場合は変更をロールバック（取り消し）
        db.session.rollback()
        logging.error(f"サークル ID:{circle_id} 削除中に整合性エラー: {e}")
        return (False, f"データベース整合性エラー: {e}")
    except Exception as e:
        db.session.rollback()
        logging.error(f"サークル ID:{circle_id} 削除中に予期せぬエラー: {e}")
        return (False, f"予期せぬエラー: {e}")

