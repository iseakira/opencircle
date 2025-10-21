import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import '../css/App.css';
import headImage from '../images/head_image.png';
import Toggle from './Toggle.jsx';

function Home() {
  //バックエンドからの応答ステート
  const [response_data, setResponse_data] = useState(null);
  const handleResponse = (data) => {
    console.log("受信したデータ:", data);
    setResponse_data(data);
  };
  return (
    <div>
      <header className="page-header">
        <h1>
          <Link to="/">
            <img className="logo" src={headImage} alt="アイコン" />
          </Link>
        </h1>
        <h3>
          <Link to="Login" className="login">
            ログイン
          </Link>
        </h3>
      </header>

      <main>
        <h1>東京理科大学サークル情報サイト</h1>
        <p>ここでは東京理科大学のサークル情報を掲載しています。</p>
        <h2>サークル一覧</h2>
        <Toggle receivedData_fb={handleResponse} />
        <div>
          {response_data ? (
            <>
              {response_data.map((circle, index) => (
                <div key={index} className="circle-info">
                  <h3>サークル名: {circle.circle_name}</h3>
                  <p>活動内容: {circle.circle_description}</p>
                </div>
              ))}
              <br />
            </>
          ) : (<br/>)}
        </div>
      </main>
      <footer>
        <p>created by 東京理科大学IS科3年</p>
        <a href="https://www.tus.ac.jp/" target="_blank">
          東京理科大学ホームページ
        </a>
      </footer>
    </div>
  );
}

export default Home;
