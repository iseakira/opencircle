import { Link } from 'react-router-dom';
import headImage from '../images/head_image.png';

function Input_email() {
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
        <form>
          <label>メールアドレス：</label>
          <input type="email" name="email" required />
          
          <br />
        </form>
        <br />
        <button type="submit">認証コードを送信する</button>

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
