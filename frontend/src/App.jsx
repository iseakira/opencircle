// frontend/src/App.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './css/App.css';
import headImage from './images/head_image.png';

function App() {
  return (
    <div>
      <body>
        <header class="page-header">
          <h1>
            <img class="logo" src={headImage} alt="アイコン" />
          </h1>
        </header>
        <h1>東京理科大学サークル情報</h1>
        <p>ここでは東京理科大学のサークル情報を掲載しています。</p>
        <h2>サークル一覧</h2>
      </body>

      <footer>
        <p>created by 東京理科大学IS科3年</p>
        <a href="https://www.tus.ac.jp/" target="_blank">
          東京理科大学ホームページ
        </a>
      </footer>
    </div>
  );
}

export default App;
