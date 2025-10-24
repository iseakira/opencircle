import { Link } from 'react-router-dom';
import headImage from '../images/head_image.png';
import Mypage from '../Mypage.jsx'

function Login() {
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
        <form>
          <label>メールアドレス：</label>
          <input type="email" name="email" required />
          
          <br />
          <label>パスワード：</label>
          <input type="password" name="password" required />
        </form>
        <br />
        <Link to="/Mypage">
          <button type="submit">ログイン</button>
        </Link>
        <h3>
          <Link to="/Input_email" >
            アカウント作成はこちら
          </Link>
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
