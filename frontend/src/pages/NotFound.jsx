import { Link } from 'react-router-dom';
import LoginOutButton from './LogInOutButton';
import Header from '../conponents/Header.jsx';

export function NotFound() {
  return (
    <>
      <Header />
      <LoginOutButton />
      <h1>404エラーが出現したぞ</h1>
      <div>
        非常に残念ながら、このページは存在していない、若しくは供養されました。
        <br />
        <Link to="/">このリンク</Link>からホームに戻ることができます。
        <br />
        ご不便おかけします。
        <br />
      </div>
    </>
  );
}
