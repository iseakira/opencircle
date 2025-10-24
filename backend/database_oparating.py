import sqlite3
import json
import random
import secrets
import string


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
    cursor.execute("INSERT INTO account_creates(tmp_id, auth_code, account_expire_time, account_create_time, attempt_count) " \
                    "VALUES ({}, {}, datetime('now','+10 minute'), datetime('now'), 0)".format(tmp_id,auth_code))
    cursor.close()
    conn.close()
    return auth_code
