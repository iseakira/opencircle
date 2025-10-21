from flask import Flask, jsonify
from flask_cors import CORS # ◀ flask_corsをインポート

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

@app.route('/hometest', methods=['POST'])
def search():
    # JSON形式でメッセージを返す
    return jsonify({"message": "test"})

# --- ここまでテスト用のコード ---

if __name__ == '__main__':
    # ポート5001でサーバーを起動
    # host='0.0.0.0' はコンテナ内で外部からのアクセスを受け付けるために必要
    app.run(host='0.0.0.0', port=5001, debug=True)