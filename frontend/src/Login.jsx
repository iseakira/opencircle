// frontend/src/App.jsx
import { Link } from 'react-router-dom';
//import { useState, useEffect } from 'react';
import './css/App.css';
import headImage from './images/head_image.png';

function Login() {
  return (
    <div>
      
      <header className="page-header">
        <h1>
          <Link to='/'>
            <img className="logo" src={headImage} alt="アイコン" />
          </Link>
        </h1>
      </header>
      <h1>東京理科大学サークル情報サイト</h1>
      <h3>ログインフォーム</h3>


      <footer>
        <p>created by 東京理科大学IS科3年</p>
        <a href="https://www.tus.ac.jp/" target="_blank">
          東京理科大学ホームページ
        </a>
      </footer>
    </div>
  );
}

export default Login;
