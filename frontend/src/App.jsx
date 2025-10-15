// frontend/src/App.jsx

import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('サーバーからの返事を待っています...');

  useEffect(() => {
    // 1. この処理が呼ばれているか確認
    console.log('useEffectが実行されました。これから通信を開始します。');

    fetch('http://localhost:5001/api/hello')
      .then((response) => {
        // 2. サーバーからの「最初の返事」の中身を確認
        console.log('サーバーからのレスポンス:', response);
        if (!response.ok) {
          throw new Error('ネットワークの応答がありませんでした');
        }
        return response.json();
      })
      .then((data) => {
        // 3. JSONに変換されたデータの中身を確認
        console.log('受け取ったデータ:', data);
        setMessage(data.message);
      })
      .catch((error) => {
        // 4. もし何かエラーがあればここで表示
        console.error('通信エラー:', error);
        setMessage('バックエンドとの通信に失敗しました。');
      });
  }, []);

  return (
    <>
      <h1>コンテナ間通信テスト</h1>
      <p>{message}</p>
    </>
  );
}

export default App;
