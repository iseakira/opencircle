import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CircleLogo from "../conponents/CircleLogo";
import '../css/App.css';
import headImage from '../images/head_image.png';

function Mypage() {
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  const [selectedCircleId, setSelectedCircleId] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("http://localhost:5001/api/mypage", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setCircles(data.items);
      })
      .catch((err) => console.error("データ取得失敗:", err));
  }, []);
  const handleAddAuthorization = () => {
    setMessage("");
    setError("");
    if (!selectedCircleId || !targetUserId) {
      setError("サークルとユーザーIDを入力してください。");
      return;
    }
    fetch("http://localhost:5001/api/edit-authorization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        circle_id: selectedCircleId,
        target_user_id: targetUserId,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "エラーが発生しました");
        setMessage(data.message);
        setTargetUserId("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };
  return (
    <div>
      <header className="page-header">
        <CircleLogo />
      </header>
      <main>
        <h1>マイページ</h1>
        <button onClick={() => navigate('/add_circle')} className="main-button">
          サークルを追加
        </button>
        <p>（サークル追加用の画面へ）</p>
        <h2>編集できるサークル一覧</h2>
        <div className="circle-list">
          {circles.length > 0 ? (
            circles.map((c) => (
              <div
                key={c.circle_id}
                className="circle-item"
                onClick={() => setSelectedCircleId(c.circle_id)}
                style={{
                  backgroundColor:
                    selectedCircleId === c.circle_id ? "#D0F0D0" : "white",
                  cursor: "pointer",
                }}
              >
                {c.circle_name}
              </div>
            ))
          ) : (
            <p>編集できるサークルがありません。</p>
          )}
        </div>
        {selectedCircleId && (
          <div className="auth-form" style={{ marginTop: "20px" }}>
            <h3>選択中のサークルID: {selectedCircleId}</h3>
            <input
              type="text"
              placeholder="付与するユーザーIDを入力"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              style={{ padding: "8px", marginRight: "10px" }}
            />
            <button
              onClick={handleAddAuthorization}
              style={{ padding: "8px 16px", backgroundColor: "#007BFF", color: "white" }}
            >
              権限を付与
            </button>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
export default Mypage;