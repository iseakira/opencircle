import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import headImage from '../images/head_image.png';

function Input_email() {
  //入力されたメールアドレスを保持するステート
  const [emailaddress, setEmailaddress] = useState('');
  
  const navigate = useNavigate();
  const retain_email = (e) => {
    setEmailaddress(e.target.value);
  };

  const email_processing =(e) =>{
    e.preventDefault();
    const mailTosend ={
      mailaddress: emailaddress
    }
    localStorage.setItem('emailaddress', emailaddress);
    const json_stringemail = JSON.stringify(mailTosend);
    console.log("入力されたメールアドレス:", json_stringemail);
    sendData(json_stringemail);
    
    return;
  }
  
  const sendData = async (json_stringemail) => {
    try {
      const response = await fetch("http://localhost:5001/add_account",{
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: json_stringemail,
      });
    
      //if(!response.ok){
        //throw new Error(`HTTP error! status: ${response.status}`);
      //}

      const result = await response.json();
      console.log("サーバーからの応答:", result);
      alert("データを送信しました")
      //navigate('/Make_Account');
    }catch (error) {
      console.error("通信エラー", error);
      alert("通信に失敗しました");
    }
  };

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
        <h3>登録したいメールアドレスを入力してください</h3>
        <form onSubmit={email_processing}>
          <label>メールアドレス：</label>
          <input type="text" name="text" placeholder="メールアドレス" value={emailaddress} onChange={retain_email} required />
          <br />
          <button type="submit">認証コードを送信する</button>
        </form>
        <br />
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

export default Input_email;
