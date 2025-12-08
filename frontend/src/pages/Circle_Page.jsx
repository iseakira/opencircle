import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import headImage from '../images/head_image.png';
import '../css/App.css';
import LoginOutButton from './LogInOutButton';
import Circleitems from '../conponents/Circleitems';
import Header from '../conponents/Header.jsx';

function Circle_Page() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [responseData, setResponseData] = useState(null);

  async function get_circle_data(id) {
    try {
      const response = await fetch('http://localhost:5001/Circle_Page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ circle_id: id }),
      });
      if (response.ok) {
        const response_obj = await response.json();
        setResponseData(response_obj);
      } else {
        setResponseData(null);
      }
    } catch {
      setResponseData(null);
    }
  }
  console.log(id + ' ' + typeof id);
  useEffect(() => {
    get_circle_data(id);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div>
        <Header />
        <LoginOutButton />
        <main>
          <h1>サークルページ</h1>
          <div>
            {responseData === null ? (
              <p>サークル情報を読み込み中です...</p>
            ) : responseData && typeof responseData === 'object' ? (
              <div>
                <img
                  src={responseData.circle_icon}
                  alt="サークルアイコン"
                  className="circle_icon_page"
                />

                <div className="descon">
                  <div className="row">
                    <div className="kou">サークル名</div>
                    <div className="data">{responseData.circle_name}</div>
                  </div>

                  <div className="row">
                    <div className="kou">サークル説明</div>
                    <div className="data">
                      {responseData.circle_description}
                    </div>
                  </div>

                  <div className="row">
                    <div className="kou">費用</div>
                    <div className="data">{responseData.circle_fee}円</div>
                  </div>

                  <div className="row">
                    <div className="kou">男性</div>
                    <div className="data">{responseData.number_of_male}</div>
                  </div>

                  <div className="row">
                    <div className="kou">女性</div>
                    <div className="data">{responseData.number_of_female}</div>
                  </div>
                </div>

                <div>
                  <Circleitems items={responseData.tags}></Circleitems>
                </div>
              </div>
            ) : (
              <p>サークル情報が読み込めませんでした</p>
            )}
          </div>
          <h3>
            <Link to="/" className="link">
              ホーム画面に戻る
            </Link>
          </h3>
        </main>
      </div>
    );
  }
}
export default Circle_Page;
