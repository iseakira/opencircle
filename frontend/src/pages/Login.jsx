import { Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import React, { useState } from 'react';
import headImage from '../images/head_image.png';

function Login() {
  const navigate = useNavigate();
  const [emailaddress, setEmailaddress] = useState('');
  const handleChange_email = (e) => {
    setEmailaddress(e.target.value);
  }
  const [password, setPassword] = useState('');
  const handleChange_password = (e) => {
    setPassword(e.target.value);
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    const emailpassToSend = {
      emailaddress: emailaddress,
      password: password
    }
    const json_toSend = JSON.stringify(emailpassToSend);
    console.log("送信するメールアドレスとパスワード:", json_toSend);
    send_Data(json_toSend);
    return;
  };


  const send_Data = async (json_email_pass) =>{
    try{
      const response = await fetch("http://localhost:5001/login",{
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: json_email_pass,
      });
      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      };
      const result = await response.json();
      console.log("サーバーからの応答：",result);
      if(result.message === "success"){
        console.log("ログイン成功");
        navigate('/mypage')
      }else{
        alert("もう一度入力してください");
      }
    }catch(error){
      console.error("メールアドレスの送信に失敗:", error);
      alert("通信に失敗しました");
    }

  }

  const handleCreateAccount = (e) => {
    e.preventDefault();
    navigate('/input_email');
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
          <input type="email" name="email" required value={emailaddress} onChange={handleChange_email} />
          <br />
          <label>パスワード：</label>
          <input type="password" name="password" required value={password} onChange={handleChange_password} />
          <button type="submit">ログイン</button>
        </form>
        <br />
        <h3>
          <button type="submit" onClick={handleCreateAccount}>アカウント作成はこちら</button>
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
