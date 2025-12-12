import sqlite3
import hash
import database_operating as dbop
import itertools

def demonstration():
    dbop.reset()
    conn = sqlite3.connect("./instance/project.db")
    cursor = conn.cursor()
    user1 = (153156, "てじ", "6323080@ed.tus.ac.jp", hash.hash_pass("ad", 153156))
    user2 = (744332, "にも", "6323022@ed.tus.ac.jp", hash.hash_pass("as", 744332))

    conn.execute("INSERT INTO users (user_id, user_name, mail_address, password)" \
                    "VALUES (?, ?, ?, ?)",user1)
    conn.execute("INSERT INTO users (user_id, user_name, mail_address, password)" \
                    "VALUES (?, ?, ?, ?)",user2)
    

    circle1 = (1, "軽音部「コード・ブルー」", "ロック、ポップスを中心に活動するバンドサークル。学園祭でのライブがメイン。", 3000, 15, 8, "/api/uploads/music.jpg")
    circle2 = (2, "競技プログラミング研究会", "アルゴリズム、データ構造を学習し、コンテスト出場を目指す。初心者歓迎！", 0, 22, 3, "/api/uploads/kyoupro.png")
    circle3 = (3, "ボードゲーム愛好会", "世界中のボードゲームを週に一度集まって遊ぶ。和気あいあいとした雰囲気。", 1000, 10, 12, "/api/uploads/boardgame.jpg")
    circle4 = (4, "写真サークル「一瞬を永遠に」", "風景、ポートレートなど様々なジャンルに挑戦。月1回の撮影会を実施。", 5000, 7, 14, "/api/uploads/camera.jpg")
    circle5 = (5, "フットサルサークル「蹴球魂」", "楽しく体を動かすことを目的とした初心者中心のサークル。", 2500, 30, 5, "/api/uploads/foot.jpg")
    circle6 = (6, "料理研究会「味の探求者」", "各国の料理をテーマに、レシピ開発と調理を行う。試食会が人気。", 4000, 5, 18, "/api/uploads/pan.jpg")
    circle7 = (7, "英語ディベートクラブ", "時事問題をテーマに英語でディベート練習を行う。国際交流イベントにも参加。", 0, 11, 9, "/api/uploads/whitehouse.jpg")
    circle8 = (8, "美術部（非公式）", "油絵、水彩、デッサンなど各自が好きな制作活動を行う。展示会も開催。", 2000, 6, 10, "/api/uploads/art.jpg")
    circle9 = (9, "地域ボランティア「ひまわり」", "地元の清掃活動や子供たちへの学習支援を行う社会貢献サークル。", 0, 8, 17, "/api/uploads/sunflower.jpg")
    circle10 = (10, "鉄道研究会", "鉄道模型制作、廃線跡探訪、時刻表研究など。幅広く「鉄」を究める。", 1500, 18, 2, "/api/uploads/train.jpg")
    
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle1)
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle2)
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle3)
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle4)
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle5)
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle6)
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle7)
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle8)
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle9)
    conn.execute("INSERT INTO circles (circle_id, circle_name, circle_description, " \
                    "circle_fee, number_of_male, number_of_female, circle_icon_path)" \
                    "VALUES (?, ?, ?, ?, ?, ?, ?)", circle10)
    
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 1, "owner"))
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 2, "owner"))
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 3, "owner"))
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 4, "owner"))
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 5, "owner"))
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 6, "owner"))
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 7, "owner"))
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 8, "owner"))
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 9, "owner"))
    conn.execute("INSERT INTO edit_authorizations (user_id, circle_id, role) VALUES (?, ?, ?)", (153156, 10, "owner"))


    #3222122222
    #7567775756
    #8809890998
    datalist = [3,2,2,2,1,2,2,2,2,2,7,5,6,7,7,7,5,7,5,6,8,8,10,9,8,9,10,9,9,8,13,13,13,14,14,14,13,14,13,13,16,15,17,15,15,16,15,17,15,15]
    def makepairs(datalist):
        index_cycle = itertools.cycle(range(1, 11))
        indexed_pairs = list(zip(index_cycle, datalist))
        return indexed_pairs
    tuple_list = makepairs(datalist)
    for tuple in tuple_list:
        conn.execute("INSERT INTO circle_tag (circle_id, tag_id) VALUES (?, ?)", tuple)
    
    conn.commit()

    cursor.close()
    conn.close()

if __name__ == "__main__":
    demonstration()