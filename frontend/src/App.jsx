// frontend/src/App.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './css/App.css' 
import headImage from './images/head_image.png';

function App() {
  //const [message, setMessage] = useState('サーバーからの返事を待っています...');

  //useEffect(() => {
    // 1. この処理が呼ばれているか確認
    //console.log('useEffectが実行されました。これから通信を開始します。');

    //fetch('http://localhost:5001/api/hello')
      //.then((response) => {
        // 2. サーバーからの「最初の返事」の中身を確認
        //console.log('サーバーからのレスポンス:', response);
        //if (!response.ok) {
          //throw new Error('ネットワークの応答がありませんでした');
        //}
        //return response.json();
      //})
      //.then((data) => {
        // 3. JSONに変換されたデータの中身を確認
        //console.log('受け取ったデータ:', data);
        //setMessage(data.message);
      //})
      //.catch((error) => {
        // 4. もし何かエラーがあればここで表示
        //console.error('通信エラー:', error);
        //setMessage('バックエンドとの通信に失敗しました。');
      //});
  //}, []);


  return (
    <div>
    
      <body>
        <header class="page-header">
          <h1><img class="logo" src={headImage} alt="アイコン" /></h1>
        </header>
        <h1>東京理科大学サークル情報</h1>
        <p>ここでは東京理科大学のサークル情報を掲載しています。</p>
        <h2>サークル一覧</h2>



      </body>

      <footer>
        <p>created by 東京理科大学IS科3年</p>
        <a href="https://www.tus.ac.jp/" target="_blank">東京理科大学ホームページ</a>
      </footer>
    </div>
  )
}

export default App;
