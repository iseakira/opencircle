import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import '../css/App.css';
import headImage from '../images/head_image.png';
import Header from '../conponents/Header.jsx';

function Mypage() {
  const navigate = useNavigate();

  const [circles, setCircles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const authFormRef = useRef(null);

<<<<<<< HEAD
  const [selectedCircleId, setSelectedCircleId] = useState('');
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
=======
  // 権限付与フォーム
  const [selectedCircleId, setSelectedCircleId] = useState("");
  const [targetUserEmail, setTargetUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14

  // マイページデータ取得
  useEffect(() => {
<<<<<<< HEAD
    fetch('http://localhost:5001/api/mypage', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        console.log('API circles:', data.items); // デバッグ用
        if (data.items) setCircles(data.items);
        if (data.user_id) setUserId(data.user_id);
=======
    fetch("http://localhost:5001/api/mypage", { credentials: "include" })
      .then(async res => {
        if (!res.ok) throw new Error("データの取得に失敗しました");
        return res.json();
      })
      .then(data => {
        setCircles(data.items || []);
        setUserId(data.user_id || null);
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
      })
      .catch((err) => console.error('データ取得失敗:', err));
  }, []);

<<<<<<< HEAD
  const isOwner = circles.some(
    (c) => c.role && c.role.toLowerCase() === 'owner'
  );
=======
  // owner 判定（role が undefined の場合落ちないようにする）
  const isOwner = circles.some(c => (c.role || "").toLowerCase() === "owner");
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14

  // クリック外で権限フォームを閉じる
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (authFormRef.current && !authFormRef.current.contains(e.target)) {
        setShowAuthForm(false);
      }
    };
<<<<<<< HEAD
    if (showAuthForm)
      document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAuthForm]);

  const handleAddAuthorization = (roleType) => {
    setMessage('');
    setError('');
=======
    if (showAuthForm) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAuthForm]);

  // editor / owner 付与
  const handleAddAuthorization = async (roleType) => {
    setMessage(""); 
    setError("");

>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
    if (!selectedCircleId || !targetUserEmail) {
      setError('サークルとメールアドレスを入力してください。');
      return;
    }

    const url =
      roleType === 'editor'
        ? 'http://localhost:5001/api/edit-authorization'
        : 'http://localhost:5001/api/transfer-ownership';

    const body =
      roleType === 'editor'
        ? { circle_id: selectedCircleId, target_email: targetUserEmail }
        : { circle_id: selectedCircleId, new_owner_email: targetUserEmail };

<<<<<<< HEAD
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'エラーが発生しました');
        setMessage(
          roleType === 'editor'
            ? 'editor権限を付与しました'
            : 'owner権限を譲渡しました'
        );
        setTargetUserEmail('');
        setShowAuthForm(false);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Header />

      <main>
        <h1>マイページ</h1>
        <p>あなたのユーザーID：{userId ?? '取得中...'}</p>
=======
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");

      setMessage(
        roleType === "editor" 
          ? "editor 権限を付与しました" 
          : "owner 権限を譲渡しました"
      );

      setTargetUserEmail("");
      setShowAuthForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <header className="page-header">
        <CircleLogo />
      </header>

      <main>
        <h1>マイページ</h1>
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14

        <button
          onClick={() => navigate('/add_circle')}
          className="allbutton"
        >
          サークルを追加
        </button>

　　     {/* owner のみ権限付与ボタン */}
        {isOwner && (
          <div style={{ position: 'absolute', top: '40px', right: '20px' }}>
            <button
              onClick={() => setShowAuthForm(!showAuthForm)}
              style={{
<<<<<<< HEAD
                padding: '8px 16px',
                backgroundColor: '#007BFF',
                color: 'white',
                borderRadius: '6px',
=======
                padding: "8px 16px",
                backgroundColor: "#007BFF",
                color: "white",
                borderRadius: "6px"
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
              }}
            >
              権限付与（ownerのみ）
            </button>

            {showAuthForm && (
              <div
                ref={authFormRef}
                style={{
<<<<<<< HEAD
                  marginTop: '10px',
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 0 6px rgba(0,0,0,0.15)',
                  width: '250px',
=======
                  marginTop: "10px",
                  background: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 0 6px rgba(0,0,0,0.15)",
                  width: "260px"
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
                }}
              >
                <h4>権限付与</h4>

                <select
                  value={selectedCircleId}
                  onChange={(e) => setSelectedCircleId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    marginBottom: '10px',
                  }}
                >
                  <option value="">サークルを選択</option>
                  {circles
<<<<<<< HEAD
                    .filter((c) => c.role && c.role.toLowerCase() === 'owner')
                    .map((c) => (
=======
                    .filter(c => (c.role || "").toLowerCase() === "owner")
                    .map(c => (
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
                      <option key={c.circle_id} value={c.circle_id}>
                        {c.circle_name}
                      </option>
                    ))}
                </select>

                <input
                  type="email"
                  placeholder="ユーザーのメールアドレス"
                  value={targetUserEmail}
                  onChange={(e) => setTargetUserEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    marginBottom: '10px',
                  }}
                />

                <button
<<<<<<< HEAD
                  onClick={() => handleAddAuthorization('editor')}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    width: '100%',
                    marginBottom: '8px',
=======
                  onClick={() => handleAddAuthorization("editor")}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#28a745",
                    color: "white",
                    width: "100%",
                    marginBottom: "8px"
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
                  }}
                >
                  editor 権限付与
                </button>

                <button
<<<<<<< HEAD
                  onClick={() => handleAddAuthorization('owner')}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: '#ff5722',
                    color: 'white',
                    width: '100%',
=======
                  onClick={() => handleAddAuthorization("owner")}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#ff5722",
                    color: "white",
                    width: "100%"
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
                  }}
                >
                  owner 権限付与（譲渡）
                </button>

                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>
            )}
          </div>
        )}

<<<<<<< HEAD
        <h2 style={{ marginTop: '40px' }}>編集できるサークル一覧</h2>
        <div className="circle-list">
          {circles.length > 0 ? (
            circles.map((c) => (
=======
        <h2 style={{ marginTop: "40px" }}>編集できるサークル一覧</h2>

        <div className="circle-list">
          {circles.length > 0 ? (
            circles.map(c => (
>>>>>>> 5e78b606abf79bb5f95d10b6c68b926c7e6fcf14
              <div
                key={c.circle_id}
                className="circle-info"
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
