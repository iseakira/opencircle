import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import headImage from '../images/head_image.png';
import Footer from '../conponents/Footer.jsx';
import Header from '../conponents/Header.jsx';
import { AuthContext, ToastContext } from '../AppContext.jsx';

function Make_Account() {
  const { setToast } = useContext(ToastContext);
  const { setLogin, setUserName } = useContext(AuthContext);

  //imput_email.jsxで入力されたメールアドレスとtmp_idを取得
  let initialEmail = '';
  let initialTmpId = '';
  try {
    const storedString = localStorage.getItem('to_Make_Account');

    const email_tmp_id = storedString ? JSON.parse(storedString) : null;
    console.log('取得したメールアドレスとtmp_id:', email_tmp_id);
    if (email_tmp_id) {
      initialEmail = email_tmp_id.emailaddress || '';
      initialTmpId = email_tmp_id.tmp_id || '';
    }
  } catch (e) {
    console.error('ローカルストレージ読み込みエラー:', e);
  }
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate = useNavigate();
  //imput_email.jsxで入力されたメールアドレスとtmp_idを取得

  const [formData, setFormData] = useState({
    emailaddress: initialEmail,
    password: '',
    auth_code: '',
    user_name: '',
    tmp_id: initialTmpId,
  });
  useEffect(() => {
    document.title = 'アカウント作成 - 東京理科大学サークル情報サイト';
    localStorage.removeItem('to_Make_Account');
    console.log('localStorageを削除しました');
  }, []);

  const [result, setResult] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const handleCreateAccount = async (e) => {
    e.preventDefault();

    const emailaddress = formData.emailaddress;
    const password = formData.password;
    const user_name = formData.user_name;
    const auth_code = formData.auth_code;
    const tmp_id = formData.tmp_id;

    console.log(formData);

    if (password !== passwordConfirm) {
      setToast("パスワードが一致していません。")
      return;
    }
    const dataToSend = {
      emailaddress: emailaddress,
      password: password,
      auth_code: auth_code,
      user_name: user_name,
      tmp_id: tmp_id,
    };
    try {
      const response = await fetch('http://localhost:5001/create_account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
        console.log('受信したデータ：', data);
        if (data.message === 'success') {
          localStorage.removeItem('to_Make_Account');
          setToast("アカウントを作成しました。")
          setUserName(data.user_name)
          setLogin()
          navigate('/');
        }
      } else {
        const error_response_obj = await response.json();
        setToast(error_response_obj.error);
      }
    } catch (error) {
      console.error('通信に失敗', error);
      alert('通信に失敗しました');
    }
  };
  return (
    <div>
      <Header />
      <main>
        <h1>アカウント作成</h1>
        <p>
          パスワードとメールアドレスに送信された認証コード、ユーザー名を入力してください
        </p>
        <form onSubmit={handleCreateAccount}>
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>パスワード設定</legend>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password">パスワード：</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                placeholder="パスワード"
                required
                onChange={handleChange}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="passwordConfirm">パスワード確認：</label>
              <input
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                value={passwordConfirm}
                placeholder="パスワード確認用"
                required
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </fieldset>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="auth_code">認証コード：</label>
            <input
              type="text"
              name="auth_code"
              id="auth_code"
              value={formData.auth_code}
              required
              onChange={handleChange}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="user_name">ユーザー名：</label>
            <input
              type="text"
              name="user_name"
              id="user_name"
              value={formData.user_name}
              required
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="exbutton">
            アカウントを作成する
          </button>
        </form>
        <div style={{ marginTop: '1rem' }}>
          {result && result.message && (
            <>
              <p>サーバー応答メッセージ: {result.message}</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Make_Account;
