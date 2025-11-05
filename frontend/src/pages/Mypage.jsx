import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import headImage from '../images/head_image.png';
import '../css/App.css';

function Mypage() {
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    fetch("http://localhost:5001/api/mypage", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setCircles(data.items);
          if (data.items.length > 0) {//以下お試し
            const firstCircleId = data.items[0].circle_id;
            fetch(`http://localhost:5001/api/has-edit-auth?circle_id=${firstCircleId}`, {
              credentials: "include",
            })
              .then((res) => res.json())
              .then((authData) => {
                setHasPermission(authData.has_permission);
              });
          }
        }
      })
      .catch((err) => console.error("データ取得失敗:", err));
  }, []);
  return (
    <div>
      <header className="page-header">
        <h1>
          <Link to="/">
            <img className="logo" src={headImage} alt="アイコン" />
          </Link>
        </h1>
        {hasPermission && (
          <button
            className="sub-button"
            onClick={() => navigate("/add-authorization")}
          >
            権限を付与
          </button>
        )}
      </header>
      <main>
        <h1>マイページ</h1>
        <button onClick={() => navigate('/add_circle')} className="main-button">
          サークルを追加
        </button>
        <p>（サークル追加用の画面へ）</p>
        <h2>編集できるサークル一覧</h2>
        
        // ここ岸追加消していいよ
        
        <button
          onClick={() => navigate('/edit-circle/1')}
          style={{ backgroundColor: '#f0ad4e', margin: '10px 0', padding: '8px' }}
        >
          (テスト用) ID:1の編集ページへ
        </button>
        <div className="circle-list">
          {circles.length > 0 ? (
            circles.map((c) => (
              <div
                key={c.circle_id}
                className="circle-item"
                onClick={() => navigate(`/edit-circle/${c.circle_id}`)}
              >
                {c.circle_name}
              </div>
            ))
          ) : (
            <p>編集できるサークルがありません。</p>
          )}
        </div>
      </main>
    </div>
  );
}
export default Mypage;