import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/App.css';
import headImage from '../images/head_image.png';
import Toggle from './Toggle.jsx';
import { useContext } from 'react';
import { ToastContext } from '../AppContext.jsx';
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
      } else {
        console.log('全サークルデータの取得に失敗:', initial_response.status);
        setToast('データの取得に失敗したんご');
        setError(
          `データの取得に失敗しました。ステータス:  ${initial_response.status}`
        );
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
      <Header />
      <LoginOutButton />

      <main>
        <p>ここでは東京理科大学のサークル情報を掲載しています。</p>
        <h2>サークル一覧</h2>
        <Toggle receivedData_fb={handleResponse} />
        <div>
          <br />
          {isLoading ? (
            <p>サークル情報を読み込み中です...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>エラー: {error}</p>
          ) : response_data &&
            response_data.items &&
            response_data.items.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {response_data.items.map((circle) => (
                <li key={circle.circle_id}>
                  <Link to={`/Circle_Page/${circle.circle_id}`}>
                    <div className="circle-info" style={{ cursor: 'pointer' }}>
                      <img
                        src={circle.circle_icon_path}
                        className="circle_icon"
                        alt={`${circle.circle_name}のアイコン`}
                      />
                      <p>サークル名: {circle.circle_name}</p>
                      <p>分野：{circle.field}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>サークル情報の取得に失敗しました</p>
          )}
        </div>
        <br />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
