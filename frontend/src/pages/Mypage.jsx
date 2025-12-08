import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';
import '../css/App.css';
import headImage from '../images/head_image.png';
import { AuthContext } from '../AppContext.jsx';
import Header from '../conponents/Header.jsx';
import Footer from '../conponents/footer';

function Mypage() {
  const{ getUserName } = useContext(AuthContext);
  const navigate = useNavigate();

  const [circles, setCircles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const authFormRef = useRef(null);

  // 権限付与フォーム
  const [selectedCircleId, setSelectedCircleId] = useState('');
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // マイページデータ取得
  useEffect(() => {
    fetch('http://localhost:5001/api/mypage', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('データの取得に失敗しました');
        return res.json();
      })
      .then((data) => {
        setCircles(data.items || []);
        setUserId(data.user_id || null);
      })
      .catch((err) => console.error('データ取得失敗:', err));
  }, []);

  // owner 判定（role が undefined の場合落ちないようにする）
  const isOwner = circles.some((c) => (c.role || '').toLowerCase() === 'owner');

  // クリック外で権限フォームを閉じる
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (authFormRef.current && !authFormRef.current.contains(e.target)) {
        setShowAuthForm(false);
      }
    };
    if (showAuthForm)
      document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAuthForm]);

  // editor / owner 付与
  const handleAddAuthorization = async (roleType) => {
    setMessage('');
    setError('');

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

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました');

      setMessage(
        roleType === 'editor'
          ? 'editor 権限を付与しました'
          : 'owner 権限を譲渡しました'
      );

      setTargetUserEmail('');
      setShowAuthForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/*<header className="page-header">
        <CircleLogo />
      </header>*/}
<Header></Header>
      <main>
        <h1>{getUserName()}さんのマイページ</h1>
        <button onClick={() => navigate('/add_circle')} className="allbutton">
          サークルを追加
        </button>
        {/* owner のみ権限付与ボタン */}
        {isOwner && (
          // <div style={{ position: 'absolute', top: '40px', right: '20px' }}>
          <div style={{textAlign:'center',marginTop:'40px'}}>
            <button
              onClick={() => setShowAuthForm(!showAuthForm)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007BFF',
                color: 'white',
                borderRadius: '6px',
              }}
            >
              権限付与（ownerのみ）
            </button>

            {showAuthForm && (
              <fieldset
                ref={authFormRef}
                style={{
                  marginTop: '10px auto',
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 0 6px rgba(0,0,0,0.15)',
                  width: '260px',
                  border: '1px solid #ddd',
                }}
              >
                <legend>権限付与</legend>

                <div style={{ marginBottom: '10px' }}>
                  <label htmlFor="selectCircle">サークルを選択</label>
                  <select
                    id="selectCircle"
                    value={selectedCircleId}
                    onChange={(e) => setSelectedCircleId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      marginTop: '4px',
                    }}
                  >
                    <option value="">サークルを選択</option>
                    {circles
                      .filter((c) => (c.role || '').toLowerCase() === 'owner')
                      .map((c) => (
                        <option key={c.circle_id} value={c.circle_id}>
                          {c.circle_name}
                        </option>
                      ))}
                  </select>
                </div>

                <input
                  type="email"
                  placeholder="ユーザーのメールアドレス"
                  value={targetUserEmail}
                  onChange={(e) => setTargetUserEmail(e.target.value)}
                  style={{
                    width: '90%',
                    padding: '6px',
                    marginBottom: '10px',
                  }}
                />

                <button
                  onClick={() => handleAddAuthorization('editor')}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    width: '100%',
                    marginBottom: '8px',
                    
                  }}
                >
                  editor 権限付与
                </button>

                <button
                  onClick={() => handleAddAuthorization('owner')}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: '#ff5722',
                    color: 'white',
                    width: '100%',
                  }}
                >
                  owner 権限付与（譲渡）
                </button>

                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </fieldset>
            )}
          </div>
        )}
        <h2 style={{ marginTop: '40px' }}>編集できるサークル一覧</h2>
        {circles.length > 0 ? (
          <ul className="circle-list" style={{ listStyle: 'none', padding: 0, width: 'auto' }}>
            {circles.map((c) => (
              <li key={c.circle_id}>
                <button
                  onClick={() => navigate(`/edit-circle/${c.circle_id}`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div
                    className="circle-info"
                    style={{ cursor: 'pointer', margin: 0 }}
                  >
                    {c.circle_name}（{c.role}）
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>編集できるサークルがありません。</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Mypage;
