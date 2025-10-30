import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import headImage from '../images/head_image.png';
import '../css/App.css';

function Mypage() {
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/mypage", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setCircles(data.items);
      })
      .catch((err) => console.error("データの取得失敗:", err));
  }, []);

  return (
    <div>
      <header className="page-header">
        <h1>
          <Link to="/">
            <img className="logo" src={headImage} alt="アイコン" />
          </Link>
        </h1>
      </header>

      <main>
        <h1>マイページ</h1>

        <button onClick={() => navigate('/add_circle')} className="main-button">
          サークルを追加
        </button>

        <p>（サークル追加用の画面へ）</p>

        <h2>編集できるサークル一覧</h2>

        <button
          onClick={() => navigate("/edit-circle/1")} // ID:1 に飛ぶテスト
          className="sub-button"
        >
          編集ページ(ID:1)へのテストボタン
        </button>

        <div className="circle-list">
          {circles.length > 0 ? (
            circles.map((c) => (
               
              /*テストテスト岸変更ここ
               <div
                key={c.circle_id}
                className="p-3 border rounded-lg bg-white shadow-sm"
              >
                {c.circle_name}
              </div>   */
              
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
