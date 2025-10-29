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
    # 直接 project.db に接続するシンプルな実装
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
        JOIN circle_tag ct ON t.tag_id = ct.tag_id
        WHERE ct.circle_id = c.circle_id
        LIMIT 1
      ) AS field
    FROM circles c
    ORDER BY c.circle_id ASC
    '''

    cur.execute(sql)
    rows = cur.fetchall()
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


def get_circle_search(json_dict):
    #database.dbは仮
    conn = sqlite3.connect('project.db')
    cursor = conn.cursor()
    #tmp_dictは検索内容をidに変換して保存する
    tmp_dict = dict()
    tmp_dict["search_term"]  = json_dict["search_term"]
    
    #TagとCircleの間の関係性の名前はどれだ？
    res = cursor.execute("SELECT c.circle_name, c.circle_iconpath " \
                        "FROM Circle AS c " \
                        "JOIN circle_tag_table AS ctt ON c.circle_id = ctt.circle_id " \
                        "WHERE ")#ここどうしようか考えてる
    res.fetchall()
    cursor.close()
    conn.close()



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