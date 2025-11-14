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
    fetch("http://localhost:5001/api/mypage", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.items) setCircles(data.items);
      })
      .catch(err => console.error("データ取得失敗:", err));
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
      .catch((err) => setError(err.message));
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      
      {/* ▼ 右上の権限付与フォーム -------------------------------- */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        right: "20px", 
        background: "white", 
        padding: "15px", 
        borderRadius: "8px",
        boxShadow: "0 0 6px rgba(0,0,0,0.15)"
      }}>
        <h3>権限付与</h3>
        <p>選択中サークル：{selectedCircleId || "未選択"}</p>

        <input
          type="text"
          placeholder="ユーザーID"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
          style={{ padding: "6px", marginRight: "10px" }}
        />

        <button
          onClick={handleAddAuthorization}
          style={{ padding: "6px 14px", backgroundColor: "#007BFF", color: "white" }}
        >
          付与
        </button>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      {/* ---------------------------------------------------------- */}

      <header className="page-header">
        <CircleLogo />
      </header>

      <main style={{ paddingTop: "100px" }}>
        <h1>マイページ</h1>

        <button onClick={() => navigate('/add_circle')} className="main-button">
          サークルを追加
        </button>

        <h2 style={{ marginTop: "40px" }}>編集できるサークル一覧</h2>

        <div className="circle-list">
          {circles.length > 0 ? (
            circles.map((c) => (
              <div
                key={c.circle_id}
                className="circle-item"
                onClick={() => navigate(`/edit_circle/${c.circle_id}`)}
                style={{
                  backgroundColor: "white",
                  cursor: "pointer",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
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