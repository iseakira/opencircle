import sqlite3
import json

#database.dbは仮
conn = sqlite3.connect('database.db')

def get_circle_search(json_dic):
    cursor = conn.cursor()
    tmp_dict = dict()
    tmp_dict["search_term"]  = json_dic["search_term"]
    tmp_dict["field"]        = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dic["field"])        )).fetchone()[0]
    tmp_dict["circle_fee"]   = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dic["circle_fee"])   )).fetchone()[0]
    tmp_dict["gender_ratio"] = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dic["gender_ratio"]) )).fetchone()[0]
    tmp_dict["place"]        = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dic["place"])        )).fetchone()[0]
    tmp_dict["mood"]         = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dic["mood"])         )).fetchone()[0]
    tmp_dict["frequency"]    = (cursor.execute("SELECT tag_id from Tag where tag_name = {}".format(json_dic["frequency"])    )).fetchone()[0]
    #TagとCircleの間の関係性の名前はどれだ？
    res = cursor.execute("SELECT c.circle_name, c.circle_iconpath " \
                        "FROM Circle AS c " \
                        "JOIN circle_tag_table AS ctt ON c.circle_id = ctt.circle_id " \
                        "WHERE ")#ここどうしようか考えてる