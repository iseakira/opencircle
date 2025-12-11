import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/App.css';
import headImage from '../images/head_image.png';
import Toggle from './Toggle.jsx';
import { useContext } from 'react';
import { ToastContext } from '../AppContext.jsx';
import LoginOutButton from './LogInOutButton.jsx';
import Footer from '../conponents/Footer.jsx';
import Header from '../conponents/Header.jsx';
import circleDefImage from '../images/circleDefaultImage.png';
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
      const fetchbody = {};
      const initial_response = await fetch('http://localhost:5001/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fetchbody),
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
    document.title = 'サークル一覧 - 東京理科大学サークル情報サイト';
  }, []);
const wrapText = (text, length = 20) => {
  return text.match(new RegExp(`.{1,${length}}`, "g")).join("\n");
};


  return (
    <div>
      <Header />
      <LoginOutButton />

      <main id="main">
        <p>ここでは東京理科大学のサークル情報を掲載しています。</p>
        <h2>サークル一覧</h2>
        <Toggle receivedData_fb={handleResponse} />
        <div>
          {isLoading ? (
            <p>サークル情報を読み込み中です...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>エラー: {error}</p>
          ) : response_data &&
            response_data.items &&
            response_data.items.length > 0 ? (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                textAlign: 'left',
                width: 'auto',
              }}
            >
              {response_data.items.map((circle) => (
                <li key={circle.circle_id}>
                  <Link
                    className="circle-link"
                    to={`/Circle_Page/${circle.circle_id}`}
                  >
                    <div className="circle-info" style={{ cursor: 'pointer' }}>
                      {circle.circle_icon_path
                      ?(<img
                        src={circle.circle_icon_path}
                        className="circle_icon"
                        alt={`no image`}
                        // alt={`${circle.circle_name}のアイコン`}
                      />):(<img
                      className='circle_icon'
                      src={circleDefImage}
                      alt={'no image'}
                      />)
                      }
                      {/* <p>サークル名: {circle}</p> */}
                      {/* <div className='circlename-wrapper'> */}
                      <p>サークル名: </p>
                        {circle.circle_name.length<=10
                        ?(circle.circle_name)
                      :(
                        <p>{circle.circle_name.slice(0,10)+"..."}</p>
                      )}
                      {circle.circle_name.length>10&&(
                        <div className = "circlename-text">
                        {wrapText(circle.circle_name)}
                        </div>
                      )}
                      {/* </div> */}
                      <p>分野：{circle.field || '未設定'}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>サークルが見つかりませんでした</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
