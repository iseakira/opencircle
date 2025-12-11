import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import headImage from '../images/head_image.png';
import '../css/App.css';
import LoginOutButton from './LogInOutButton';
import Circleitems from '../conponents/Circleitems';
import Header from '../conponents/Header.jsx';
import circleDefImage from '../images/circleDefaultImage.png';

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
    document.title = 'サークル詳細 - 東京理科大学サークル情報サイト';
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
        <main id="main">
          <h1>サークルページ</h1>
          <div>
            {responseData === null ? (
              <p>サークル情報を読み込み中です...</p>
            ) : responseData && typeof responseData === 'object' ? (
              <div>
                {responseData.circle_icon?(
                <img
                  src={responseData.circle_icon}
                  alt={`${responseData.circle_name}のアイコン`}
                  className="circle_icon_page"
                />):(
                  <img
                  src={circleDefImage}
                  alt="No image"
                  className="circle_icon_page"
                  /> 
                )}

                <dl className="descon">
                  <div className="row">
                    <dt className="kou">サークル名</dt>
                    <dd className="data">{responseData.circle_name}</dd>
                  </div>

                  <div className="row">
                    <dt className="kou">サークル説明</dt>
                    <dd className="data">
                      {responseData.circle_description}
                    </dd>
                  </div>

                  <div className="row">
                    <dt className="kou">費用</dt>
                    <dd className="data">{responseData.circle_fee}円</dd>
                  </div>

                  <div className="row">
                    <dt className="kou">男性</dt>
                    <dd className="data">{responseData.number_of_male}</dd>
                  </div>

                  <div className="row">
                    <dt className="kou">女性</dt>
                    <dd className="data">{responseData.number_of_female}</dd>
                  </div>
                </dl>

                <div>
                  <Circleitems items={responseData.tags}></Circleitems>
                </div>
              </div>
            ) : (
              <p>サークル情報が読み込めませんでした</p>
            )}
          </div>
          <h2>
            <Link to="/" className="link">
              ホーム画面に戻る
            </Link>
          </h2>
        </main>
      </div>
    );
  }
}
export default Circle_Page;
