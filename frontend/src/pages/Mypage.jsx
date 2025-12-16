import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import '../css/App.css';
import { AuthContext } from '../AppContext.jsx';
import Header from '../conponents/Header.jsx';
import Footer from '../conponents/Footer.jsx';
import LoginOutButton from './LogInOutButton.jsx';

function Mypage() {
  const { getUserName, getLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [circles, setCircles] = useState([]);
  
  // ★フォームの開閉状態を管理
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);

  // フォーム用ステート
  const [selectedCircleId, setSelectedCircleId] = useState('');
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(()=>{
    if(!getLogin()){
      navigate('/');
    }
  },[getLogin()])

  // データ取得
  useEffect(() => {
    document.title = 'マイページ - 東京理科大学サークル情報サイト';
    fetch('http://localhost:5001/api/mypage', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('データの取得に失敗しました');
        return res.json();
      })
      .then((data) => {
        setCircles(data.items || []);
      })
      .catch((err) => console.error('データ取得失敗:', err));
  }, []);

  const isOwner = circles.some((c) => (c.role || '').toLowerCase() === 'owner');

  // 権限付与処理
  const handleAddAuthorization = async (roleType) => {
    setMessage('');
    setError('');

    if (!selectedCircleId || !targetUserEmail) {
      setError('サークルとメールアドレスを入力してください。');
      return;
    }

    // 最終確認 (owner譲渡の場合のみ)
    if (roleType === 'owner') {
        if (!window.confirm('本当にオーナー権限を譲渡しますか？\nあなたはこのサークルのオーナーではなくなります。')) {
            return;
        }
    }

    const url = roleType === 'editor'
        ? 'http://localhost:5001/api/edit-authorization'
        : 'http://localhost:5001/api/transfer-ownership';

    const body = roleType === 'editor'
        ? { circle_id: Number(selectedCircleId), target_email: targetUserEmail }
        : { circle_id: Number(selectedCircleId), new_owner_email: targetUserEmail };

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
      setTargetUserEmail(''); // メールアドレス欄をクリア
    } catch (err) {
      setError(err.message);
    }
  };

  const wrapText = (text, length = 20) => {
  return text.match(new RegExp(`.{1,${length}}`, "g")).join("\n");
};
  return (
    <div className="mypage-container">
      <Header />
      <LoginOutButton mypage={false} />

      <main id="main" className="main-content">
        <h1>{getUserName()}さんのマイページ</h1>

        {/* サークル追加ボタン */}
        <div className="center-button-area">
            <button onClick={() => navigate('/add_circle')} className="allbutton action-trigger-btn">
            サークルを追加
            </button>
        </div>

        {isOwner && (
          <div className="auth-section">
            {/* ★開閉トグルボタン */}
            <button 
              className={`toggle-button ${isAuthFormOpen ? 'open' : ''}`}
              onClick={() => setIsAuthFormOpen(!isAuthFormOpen)}
            >
              {isAuthFormOpen ? '▲ 権限付与窓を閉じる' : '▼ 権限付与窓を開く'}
            </button>

            {/* ★展開されるフォームエリア */}
            {isAuthFormOpen && (
              <div className="auth-form-card">
                <h3>権限付与設定</h3>
                
                <div className="form-group">
                  <label>サークルを選択</label>
                  <select
                    value={selectedCircleId}
                    onChange={(e) => setSelectedCircleId(e.target.value)}
        
                    className="input-box"
                  >
                    <option value="">サークルを選択</option>
                    {circles
                      .filter((c) => (c.role || '').toLowerCase() === 'owner')
                      .map((c) => (
                        <option key={c.circle_id} value={c.circle_id}>
                          {/* {c.circle_name.length<20&&( */}
                          <div>
                          {c.circle_name}
                          </div>
                          {/* ) */}
                          {/* } */}
                          {/* {c.circle_name.length>30&&(  
                    <div className='circlename-text-input'>
                    {wrapText(c.circle_name)}
                    </div>
                    )  
                  } */}
                        </option>
                      ))}
                  </select>
                 
                 
                  {/* <select
                    value={selectedCircleId}
                    onChange={(e) => setSelectedCircleId(e.target.value)}
                    className="input-box"
                  >
                    <option value="">サークルを選択</option>
                    {circles
                      .filter((c) => (c.role || '').toLowerCase() === 'owner')
                      .map((c) => (
                        <option key={c.circle_id} value={c.circle_id}>
                          {c.circle_name.length<20?(
                          <div>
                          {c.circle_name}
                          </div>
                          ):(
                          <div>
                          {c.circle_name.slice(0,20)+"..."}
                          </div>
                          )}
                          {c.circle_name.length>30&&(  
                    <div className='circlename-text-input'>
                    {wrapText(c.circle_name)}
                    </div>
                    )  
                  }
                        </option>
                      ))}
                  </select> */}
                </div>

                <div className="form-group">
                  <label>相手のメール</label>
                  <input
                    type="email"
                    placeholder="ユーザーのメールアドレス"
                    value={targetUserEmail}
                    onChange={(e) => setTargetUserEmail(e.target.value)}
                    className="input-box"
                  />
                </div>

                {/* ★ボタンエリア（統一デザイン） */}
                <div className="auth-buttons-row">
                  <button
                    onClick={() => handleAddAuthorization('editor')}
                    className="auth-action-btn editor-btn"
                  >
                    editor 権限付与
                  </button>
                  <button
                    onClick={() => handleAddAuthorization('owner')}
                    className="auth-action-btn owner-btn"
                  >
                    owner 権限譲渡
                  </button>
                </div>

                <div className="message-area">
                    {message && <p className="success-text">{message}</p>}
                    {error && <p className="error-text">{error}</p>}
                </div>
              </div>
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
                     {c.circle_name.length<=30
                        ?(c.circle_name)
                      :(
                        <p>{c.circle_name.slice(0,30)+"..."}</p>
                      )}
                    {c.circle_name.length>30&&(  
                    <div className='circlename-text'>
                    {wrapText(c.circle_name)}
                    </div>
                    )  
                  }
                    （{c.role}）
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
