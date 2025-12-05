import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/App.css';
import headImage from '../images/head_image.png';
import Toggle from './Toggle.jsx';
<<<<<<< HEAD
import { useContext } from 'react';
import { AuthContext } from '../AuthStatus.jsx';
=======
import { useContext} from 'react'
import { ToastContext } from '../AppContext.jsx';
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
import LoginOutButton from './LogInOutButton.jsx';
import Footer from '../conponents/footer.jsx';
import Header from '../conponents/Header.jsx';

function Home() {
  //バックエンドからの応答ステート（絞り込み結果を受け取る）
  const [response_data, setResponse_data] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleResponse = (data) => {
    console.log('絞り込み結果:', data);
    setResponse_data(data);
  };

  const { setToast } = useContext(ToastContext);

  const catch_all_circles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const initial_response = await fetch('http://localhost:5001/homestart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (initial_response.ok) {
        const data = await initial_response.json();
        console.log('初期値として受け取った全サークル情報:', data);
        setResponse_data(data);
<<<<<<< HEAD
      } else {
        console.log('全サークルデータの取得に失敗:', initial_response.status);
        setError(
          `データの取得に失敗しました。ステータス:  ${initial_response.status}`
        );
=======
      }else{
        console.log("全サークルデータの取得に失敗:", initial_response.status);
        setToast("データの取得に失敗したんご");
        setError(`データの取得に失敗しました。ステータス:  ${initial_response.status}`);
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
        setResponse_data(null);
      }
    } catch (error) {
      console.error('エラーが発生しました', error);
      setError('ネットワークエラーが発生しました。');
      setResponse_data(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    catch_all_circles();
  }, []);

  return (
    <div>
<<<<<<< HEAD
      <Header />
      <LoginOutButton />

      <main>
        <p>ここでは東京理科大学のサークル情報を掲載しています。</p>
        <h2>サークル一覧</h2>
        <Toggle receivedData_fb={handleResponse} />
        <div>
          <br />
=======
      <header className="page-header">
        <CircleLogo />
        <LoginOutButton />
      </header>

      <main>
        <h2>サークル一覧</h2>
        <Toggle receivedData_fb={handleResponse} />
        <div>
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
          {isLoading ? (
            <p>サークル情報を読み込み中です...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>エラー: {error}</p>
<<<<<<< HEAD
          ) : response_data &&
            response_data.items &&
            response_data.items.length > 0 ? (
            <>
              {response_data.items.map((circle, index) => (
                <div key={circle.circle_id}>
=======
          ) : response_data && response_data.items && response_data.items.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {response_data.items.map((circle) => (
                <li key={circle.circle_id}>
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
                  <Link to={`/Circle_Page/${circle.circle_id}`}>
                    <div className="circle-info" style={{ cursor: 'pointer' }}>
                      <img
                        src={circle.circle_icon_path}
                        className="circle_icon"
<<<<<<< HEAD
                        alt="サークルのアイコン"
=======
                        alt={`${circle.circle_name}のアイコン`}
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
                      />
                      <p>サークル名: {circle.circle_name}</p>
                      <p>分野：{circle.field}</p>
                    </div>
                  </Link>
<<<<<<< HEAD
                </div>
              ))}
              <br />
            </>
=======
                </li>
              ))}
            </ul>
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
          ) : (
            <p>サークル情報の取得に失敗しました</p>
          )}
        </div>
      </main>
<<<<<<< HEAD
      <Footer />
=======

      <footer>
        <p>created by 東京理科大学IS科3年</p>
        <a
          href="https://www.tus.ac.jp/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="東京理科大学ホームページ（新しいタブで開きます）"
        >
          東京理科大学ホームページ
        </a>
      </footer>
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
    </div>
  );
}

export default Home;
