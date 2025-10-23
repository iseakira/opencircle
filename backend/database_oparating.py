import sqlite3
import json

#database.dbは仮
conn = sqlite3.connect('database.db')

def get_circle_search(json_dict):
    cursor = conn.cursor()
    #tmp_dictは検索内容をidに変換して保存する
    tmp_dict = dict()
    tmp_dict["search_term"]  = json_dict["search_term"]
    tmp_dict["field"]        = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dict["field"])        )).fetchone()[0]
    tmp_dict["circle_fee"]   = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dict["circle_fee"])   )).fetchone()[0]
    tmp_dict["gender_ratio"] = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dict["gender_ratio"]) )).fetchone()[0]
    tmp_dict["place"]        = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dict["place"])        )).fetchone()[0]
    tmp_dict["mood"]         = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dict["mood"])         )).fetchone()[0]
    tmp_dict["frequency"]    = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dict["frequency"])    )).fetchone()[0]
    #TagとCircleの間の関係性の名前はどれだ？
    res = cursor.execute("SELECT c.circle_name, c.circle_iconpath " \
                        "FROM Circle AS c " \
                        "JOIN circle_tag_table AS ctt ON c.circle_id = ctt.circle_id " \
                        "WHERE ")#ここどうしようか考えてる
    res.fetchall()