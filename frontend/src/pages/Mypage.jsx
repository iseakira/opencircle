import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import CircleLogo from "../conponents/CircleLogo";
import '../css/App.css';
import headImage from '../images/head_image.png';

function Mypage() {
  const navigate = useNavigate();

  const [circles, setCircles] = useState([]);
  const [selectedCircleId, setSelectedCircleId] = useState("");
  const [targetUserEmail, setTargetUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [userId, setUserId] = useState(null);

  const authFormRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/mypage", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.items) setCircles(data.items);
        if (data.user_id) setUserId(data.user_id);
      })
      .catch(err => console.error("データ取得失敗:", err));
  }, []);

  const isOwner = circles.some(c => c.role === "owner");

  const handleAddAuthorization = () => {
    setMessage("");
    setError("");

    if (!selectedCircleId || !targetUserEmail) {
      setError("サークルとメールアドレスを入力してください。");
      return;
    }

    fetch("http://localhost:5001/api/edit-authorization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        circle_id: selectedCircleId,
        target_email: targetUserEmail,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "エラーが発生しました");
        setMessage(data.message);
        setTargetUserEmail("");
        setShowAuthForm(false);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authFormRef.current && !authFormRef.current.contains(event.target)) {
        setShowAuthForm(false);
      }
    };

    if (showAuthForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAuthForm]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <header className="page-header">
        <CircleLogo />
      </header>

      <main>
        <h1>マイページ</h1>

        <button onClick={() => navigate('/add_circle')} className="allbutton">
          サークルを追加
        </button>

        {isOwner && (
  <div style={{ position: "absolute", top: "40px", right: "20px" }}>
    
    <button
      onClick={() => setShowAuthForm(!showAuthForm)}
      style={{
        padding: "8px 16px",
        backgroundColor: "#007BFF",
        color: "white",
        borderRadius: "6px"
      }}
    >
      権限付与（ownerのみ）
    </button>

    {showAuthForm && (
      <div
        ref={authFormRef}
        style={{
          marginTop: "10px",
          background: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 0 6px rgba(0,0,0,0.15)",
          width: "260px"
        }}
      >
        <h4>権限付与</h4>

        {/* サークルプルダウン：1つだけ */}
        <select
          value={selectedCircleId}
          onChange={(e) => setSelectedCircleId(e.target.value)}
          style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
        >
          <option value="">サークルを選択</option>
          {circles
            .filter(c => c.role === "owner")
            .map(c => (
              <option key={c.circle_id} value={c.circle_id}>
                {c.circle_name}
              </option>
            ))}
        </select>

        {/* メールアドレス */}
        <input
          type="email"
          placeholder="ユーザーのメールアドレス"
          value={targetUserEmail}
          onChange={(e) => setTargetUserEmail(e.target.value)}
          style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
        />

        {/* editor 付与ボタン */}
        <button
          onClick={() => handleAddAuthorization("editor")}
          style={{
            padding: "6px 14px",
            backgroundColor: "#28a745",
            color: "white",
            width: "100%",
            marginBottom: "8px"
          }}
        >
          editor 権限付与
        </button>

        {/* sowner 付与（譲渡）ボタン */}
        <button
          onClick={() => handleAddAuthorization("owner")}
          style={{
            padding: "6px 14px",
            backgroundColor: "#ff5722",
            color: "white",
            width: "100%"
          }}
        >
          owner 権限付与（譲渡）
        </button>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    )}
  </div>
)}


        <h2 style={{ marginTop: "40px" }}>編集できるサークル一覧</h2>
        <div className="circle-list">
          {circles.length > 0 ? (
            circles.map((c) => (
              <div
                key={c.circle_id}
                className="circle-item"
                onClick={() => navigate(`/edit-circle/${c.circle_id}`)}
              >
                {c.circle_name}（{c.role}）
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
