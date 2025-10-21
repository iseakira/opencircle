from flask import Flask, jsonify
from flask_cors import CORS # ◀ flask_corsをインポート
from flask import request
import json

# Flaskアプリケーションのインスタンスを作成
app = Flask(__name__)

# CORSを有効にする（これでフロントからの通信が許可される）
# origins=["http://localhost:3000"] のように限定することも可能
CORS(app)

# --- ここからテスト用のコード ---

# `/api/hello` というURLにアクセスが来たら動く関数
@app.route('/api/hello', methods=['GET'])
def say_hello():
    # JSON形式でメッセージを返す
    return jsonify({"message": "バックエンドからの返事です！🎉"})

#'/hometest'というURLにPOSTリクエストが来たら動く関数
@app.route('/hometest', methods=['POST'])
def search():
    #json_dataのキーは["search_term","field","circle_fee","gender_ration","place","mood","frequency"]
    json_data = request.get_json()
    print(json.dumps(json_data))
    #f = open("testdata.txt")
    #json_text = f.read()
    #f.close

    return jsonify([{"circle_name": "サークルA",
                    "circle_description": "これはサークルAの説明です。"},
                    {"circle_name": "サークルB",
                     "circle_description": "これはサークルBの説明です。"},
                    {"circle_name": "サークルC",
                     "circle_description": "これはサークルCの説明です。"}])

# --- ここまでテスト用のコード ---

if __name__ == '__main__':
    # ポート5001でサーバーを起動
    # host='0.0.0.0' はコンテナ内で外部からのアクセスを受け付けるために必要
    app.run(host='0.0.0.0', port=5001, debug=True)