import sqlite3

def it():
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
    conn=sqlite3.connect("project.db")
    cursor=conn.cursor()
    for i in range(18):
        cursor.execute("INSERT INTO tags (tag_id, tag_name) VALUES ({}, '{}')".format(tags_list[i]["tag_id"], tags_list[i]["tag_name"]))
        conn.commit()
    conn.close()
    cursor.close()