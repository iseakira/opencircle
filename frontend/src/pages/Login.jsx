import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import React, { useState, useContext } from 'react';
import headImage from '../images/head_image.png';
import { AuthContext } from '../AppContext';
import { ToastContext } from '../AppContext';
import Header from '../conponents/Header';
import Footer from '../conponents/footer';

function Login() {
  const {setToast} = useContext(ToastContext);
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
