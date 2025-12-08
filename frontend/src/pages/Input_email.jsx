import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import headImage from '../images/head_image.png';
import Footer from '../conponents/footer.jsx';
import Header from '../conponents/Header.jsx';
import { ToastContext } from '../AppContext.jsx';

function Input_email() {

  const { setToast } = useContext(ToastContext);
  //入力されたメールアドレスを保持するステート
  const [emailaddress, setEmailaddress] = useState('');
  const navigate = useNavigate();
  const retain_email = (e) => {
    setEmailaddress(e.target.value);
  };

  //入力されたメールアドレスをどうするかの処理
  const email_processing = (e) => {
    e.preventDefault();
    //バックエンドへ送る用
    const emailTosend = {
      emailaddress: emailaddress,
    };
    //Make_Account.jsxへ送るjson（メールアドレスとid）

    const json_stringemail = JSON.stringify(emailTosend);
    console.log('入力されたメールアドレス:', json_stringemail);
    //メールアドレス送信とその結果（successとtmp_idのjson）受信
    sendData(json_stringemail);
    return;
  };

  const sendData = async (json_stringemail) => {
    try {
      //メールアドレスをバックエンドに送る処理
      const response = await fetch('http://localhost:5001/add_account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: json_stringemail,
      });

      if(response.ok){
        const response_obj = await response.json();
        const to_Make_Account_data = JSON.stringify({
          emailaddress: emailaddress,
          tmp_id: response_obj.tmp_id,
        });
        localStorage.setItem('to_Make_Account', to_Make_Account_data);
        navigate('/Make_Account');
      }else{
        const error_response_obj = await response.json();
        setToast(error_response_obj.error)
      }

      //応答の処理
      /*
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      //バックエンドからの返り値として受け取ったjsonをresultに格納
      const result = await response.json();
      console.log('サーバーからの応答:', result);
      if (result.message == 'success') {
        alert('データを送信しました');
        const to_Make_Account_data = JSON.stringify({
          emailaddress: emailaddress,
          tmp_id: result.tmp_id,
        });
        localStorage.setItem('to_Make_Account', to_Make_Account_data);
        navigate('/Make_Account');
      } else {
        alert('もう一度入力してください');
      }*/
    } catch (error) {
      console.error('通信エラー', error);
      alert('通信に失敗しました');
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h1>アカウント作成</h1>
        <p>登録したいメールアドレスを入力してください</p>
        <form onSubmit={email_processing}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="emailaddress">メールアドレス：</label>
            <input
              type="email"
              name="emailaddress"
              id="emailaddress"
              placeholder="メールアドレス"
              value={emailaddress}
              onChange={retain_email}
              required
            />
          </div>
          <button type="submit" className="exbutton">
            認証コードを送信する
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default Input_email;
