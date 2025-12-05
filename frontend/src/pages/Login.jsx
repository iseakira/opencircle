import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import headImage from '../images/head_image.png';
import { AuthContext } from '../AuthStatus';
import { useContext } from 'react';
import Footer from '../conponents/footer.jsx';
import Header from '../conponents/Header.jsx';

function Login() {
  const navigate = useNavigate();
  const [emailaddress, setEmailaddress] = useState('');
  const handleChange_email = (e) => {
    setEmailaddress(e.target.value);
  };
  const [password, setPassword] = useState('');
  const handleChange_password = (e) => {
    setPassword(e.target.value);
  };
  const { setLogin } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailpassToSend = {
      emailaddress: emailaddress,
      password: password,
    };
    const json_toSend = JSON.stringify(emailpassToSend);
    console.log('送信するメールアドレスとパスワード:', json_toSend);
    send_Data(json_toSend);
    return;
  };

  const send_Data = async (json_email_pass) => {
    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: json_email_pass,
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('サーバーからの応答：', result);
      if (result.message === 'success') {
        console.log('ログイン成功');
        setLogin(); //大西さんが編集してるよ
        navigate('/mypage');
      } else {
        alert('もう一度入力してください');
      }
    } catch (error) {
      console.error('メールアドレスの送信に失敗:', error);
      alert('通信に失敗しました');
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    navigate('/input_email');
  };
  return (
    <div>
      <Header />

      <main>
        <h3>メールアドレスとパスワードを入力してください</h3>
        <form onSubmit={handleSubmit}>
          <label>メールアドレス：</label>
          <input
            type="email"
            name="email"
            required
            value={emailaddress}
            onChange={handleChange_email}
          />
          <br />
          <label>パスワード：</label>
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={handleChange_password}
          />
          <br />
          <button type="submit" className="allbutton">
            ログイン
          </button>
        </form>
        <br />
        <h3>
          <button
            type="submit"
            onClick={handleCreateAccount}
            className="exbutton"
          >
            アカウント作成はこちら
          </button>
        </h3>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
