import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import React, { useState, useContext } from 'react';
import headImage from '../images/head_image.png';
import { AuthContext } from '../AppContext';
import { ToastContext } from '../AppContext';
import Header from '../conponents/Header';
import Footer from '../conponents/Footer';

function Login() {
  React.useEffect(() => {
    document.title = 'ログイン - 東京理科大学サークル情報サイト';
  }, []);

  const { setToast } = useContext(ToastContext);
  const { setLogin, getUserName, setUserName } = useContext(AuthContext);

  const navigate = useNavigate();
  const [emailaddress, setEmailaddress] = useState('');
  const handleChange_email = (e) => {
    setEmailaddress(e.target.value);
  };
  const [password, setPassword] = useState('');
  const handleChange_password = (e) => {
    setPassword(e.target.value);
  };

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

      if(response.ok){
        const response_obj = await response.json();
        setLogin();
        setUserName(response_obj.user_name);
        setToast(response_obj.user_name + "さん、ようこそ。")
        navigate('/mypage');  
      }else{
        const error_response_obj = await response.json();
        setToast(error_response_obj.error);
      }
/*
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.message === 'success') {
        console.log('ログイン成功');
        setLogin();
        navigate('/mypage');
      } else {
        alert('もう一度入力してください');
      }*/
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

      <main id="main">
        <h1>ログイン</h1>
        <p>メールアドレスとパスワードを入力してください</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email">メールアドレス：</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={emailaddress}
              onChange={handleChange_email}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password">パスワード：</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={password}
              onChange={handleChange_password}
            />
          </div>
          <button type="submit" className="allbutton">
            ログイン
          </button>
        </form>
        <div style={{ marginTop: '2rem' }}>
          <p>アカウントをお持ちでない方</p>
          <button
            type="button"
            onClick={handleCreateAccount}
            className="exbutton"
          >
            アカウント作成はこちら
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
