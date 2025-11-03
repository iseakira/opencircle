import sys
from backend.database_operating import delete_circle_by_id
from backend.app import create_app

# ▼▼▼ 削除したいサークルのIDをここに指定してください ▼▼▼
CIRCLE_ID_TO_DELETE = 1
# ▲▲▲ ------------------------------------------ ▲▲▲

def run_delete(circle_id):
    """
    指定したIDのサークルを削除する
    """
    if circle_id is None:
        print("エラー: 削除するサークルIDを指定してください。")
        return

    print(f"サークルID: {circle_id} の削除処理を開始します...")
    
    # Flaskのアプリケーションコンテキストを作成
    app = create_app()
    with app.app_context():
        # database_operating.py の関数を呼び出す
        success, message = delete_circle_by_id(circle_id)
        
        if success:
            print(f"成功: {message}")
        else:
            print(f"失敗: {message}")

if __name__ == "__main__":
    # コマンドラインからIDが渡されたかチェック
    # (例: python delete_script.py 5)
    if len(sys.argv) > 1:
        try:
            cli_id = int(sys.argv[1])
            run_delete(cli_id)
        except ValueError:
            print(f"エラー: '{sys.argv[1]}' は有効な数値ではありません。")
    else:
        # コマンドラインからIDが渡されなかった場合は、
        # スクリプト上部の CIRCLE_ID_TO_DELETE を使う
        run_delete(CIRCLE_ID_TO_DELETE)
