import { Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import React, { useState } from 'react';
import headImage from '../images/head_image.png';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: '', // 👈 初期値を設定
    password: '',
  });
  const handleChange = (e) => {
    // 入力フィールドの名前をキーとして state を更新
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/mypage');
  }
  return (
    <div>
      <header className="page-header">
        <h1>
          <Link to="/">
            <img className="logo" src={headImage} alt="アイコン" />
          </Link>
        </h1>
      </header>
      <h1>東京理科大学サークル情報サイト</h1>
      <main>
        <h3>メールアドレスとパスワードを入力してください</h3>
        <form onSubmit={handleSubmit}>
          <label>メールアドレス：</label>
<<<<<<< HEAD
          <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          
=======
          <input type="email" name="email" required />

>>>>>>> 50dcb6436e6a85181d7499ecf0ad88f3cf79ffec
          <br />
          <label>パスワード：</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange} />
          <button type="submit">ログイン</button>
        </form>
        <br />
        <h3>
<<<<<<< HEAD
          <Link to="/input_email" >
            アカウント作成はこちら
          </Link>
=======
          <Link to="/Input_email">アカウント作成はこちら</Link>
>>>>>>> 50dcb6436e6a85181d7499ecf0ad88f3cf79ffec
        </h3>
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

export default Login;
