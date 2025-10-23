import sqlite3
import json
import random
import secrets
import string


def get_circle_search(json_dict):
    #database.dbは仮
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    #tmp_dictは検索内容をidに変換して保存する
    tmp_dict = dict()
    tmp_dict["search_term"]  = json_dict["search_term"]
    tmp_dict["field"]        = (cursor.execute("SELECT tag_id FROM Tag where tag_name = {}".format(json_dict["field"])        )).fetchone()[0]
    tmp_dict["circle_fee"]   = (cursor.execute("SELECT tag_id FROM Tag where tag_name = {}".format(json_dict["circle_fee"])   )).fetchone()[0]
    tmp_dict["gender_ratio"] = (cursor.execute("SELECT tag_id FROM Tag where tag_name = {}".format(json_dict["gender_ratio"]) )).fetchone()[0]
    tmp_dict["place"]        = (cursor.execute("SELECT tag_id FROM Tag where tag_name = {}".format(json_dict["place"])        )).fetchone()[0]
    tmp_dict["mood"]         = (cursor.execute("SELECT tag_id FROM Tag where tag_name = {}".format(json_dict["mood"])         )).fetchone()[0]
    tmp_dict["frequency"]    = (cursor.execute("SELECT tag_id FROM Tag where tag_name = {}".format(json_dict["frequency"])    )).fetchone()[0]
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
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    auth_code = random.randint(100000, 999999)
    tmp_id = int(''.join(secrets.choice(string.digits) for _ in range(6)))
    #tmp_idが重複した時の処理を後で書く
    cursor.execute("INSERT INTO account_creates(tmp_id, auth_code, account_expire_time, account_create_time, attempt_count) " \
                    "VALUE ({}, {}, NOW(), DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0)")
    cursor.close()
    conn.close()
    return auth_code
