import React, { useState, useEffect, useRef} from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import '/app/src/css/EditCircle.css';
import '../css/App.css';
import Button from '../conponents/Button';
import CircleDescription from '../conponents/CircleDescription';
import CircleFee from '../conponents/CircleFee';
import CircleName from '../conponents/CircleName';
import Tag from '../conponents/Tag';
import Image from '../conponents/Image';
import CircleMen from '../conponents/CircleMen';
import CircleFemen from '../conponents/CircleFemen';
import Header from '../conponents/Header.jsx';
import DefoImage from '../images/circleDefaultImage.png';
function CircleEdit() {
  const { circleId } = useParams();
  const navigate = useNavigate();

  const [circleData, setCircleData] = useState({
    circle_name: '',
    circle_description: '',
    circle_fee: '',
    number_of_male: '',
    number_of_female: '',
  });
const defaultImage={DefoImage}
  const [selectedBunya, setSelectedBunya] = useState(0);
  const [selectedFee, setSelectedFee] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [selectedMood, setSelectedMood] = useState(0);
  const [selectedActive, setSelectedActive] = useState(0);

  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null); // (File オブジェクトがここに入る)

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorFields, setErrorFields] = useState([]);

  // 既存データを読み込む useEffect
  // 1. データ取得処理を関数にする
  const fetchCircleData = () => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:5001/api/circles/${circleId}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          throw new Error('このサークルを編集する権限がありません。');
        }
        if (!res.ok) throw new Error('情報の取得に失敗しました');
        return res.json();
      })
      .then((data) => {
        // ステートを更新
        setCircleData({
          circle_name: data.circle_name,
          circle_description: data.circle_description,
          circle_fee: data.circle_fee || '',
          number_of_male: data.number_of_male || 0,
          number_of_female: data.number_of_female || 0,
        });

        setPreview(data.circle_icon_path);
        setImage(null); // 画像選択状態をクリア

        if (data.tags && data.tags.length === 6) {
          setSelectedBunya(data.tags[0]);
          setSelectedFee(data.tags[1]);
          setSelectedRatio(data.tags[2]);
          setSelectedPlace(data.tags[3]);
          setSelectedMood(data.tags[4]);
          setSelectedActive(data.tags[5]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  // 2. 最初の読み込みでその関数を使う
  useEffect(() => {
    document.title = 'サークル編集 - 東京理科大学サークル情報サイト';
    fetchCircleData();
  }, [circleId]);

  const fileInputRef = useRef(null);
  
  const resetImage =(e)=>{
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  // 3. リセットボタンが押された時の処理
  const handleReset = () => {
    if (window.confirm('変更を破棄して、元の状態に戻しますか？')) {
      fetchCircleData(); // 再取得して上書き
    }
  };

  // --- onChange ハンドラ ---
  const NameChange = (e) =>
    setCircleData({ ...circleData, circle_name: e.target.value });
  const DesChange = (e) =>
    setCircleData({ ...circleData, circle_description: e.target.value });
  const MemChange = (e) =>
    setCircleData({ ...circleData, number_of_male: e.target.value });
  const FememChange = (e) =>
    setCircleData({ ...circleData, number_of_female: e.target.value });
  const FeeChange = (e) =>
    setCircleData({ ...circleData, circle_fee: e.target.value });
  const hadleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // (File オブジェクトを state に保存)
      setPreview(URL.createObjectURL(file)); // (プレビューを更新)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 必須項目チェック (if が抜けていたのを修正)
    const errors = [];
    if (!circleData.circle_name) {
      errors.push('circle_name');
    }
    if (!circleData.circle_description) {
      errors.push('circle_description');
    }
    
    if (errors.length > 0) {
    // if (errorFields.includes('circle_name')) {
      setErrorFields(errors);
      alert('サークル名と活動内容・説明は必須です');
      return;
    }
    
    setErrorFields([]);
    const result = window.confirm('サークルを更新しますか？');
    if (!result) return;

    // 2. FormData オブジェクトを作成
    const formData = new FormData();

    // 3. テキストデータを FormData に追加
    formData.append('circle_name', circleData.circle_name);
    formData.append('circle_description', circleData.circle_description);
    formData.append('circle_fee', circleData.circle_fee || '0');
    formData.append('number_of_male', circleData.number_of_male || '0');
    formData.append('number_of_female', circleData.number_of_female || '0');

    // 4. タグリストを「JSON文字列」として FormData に追加
    const tagList = [
      selectedBunya,
      selectedFee,
      selectedRatio,
      selectedPlace,
      selectedMood,
      selectedActive,
    ];
    formData.append('tags', JSON.stringify(tagList));

    // 5. 画像ファイルを追加 (image state に File があれば)
    if (image) {
      formData.append('circle_icon_file', image);
    }
    // 6. サーバーへ送信 (try...catch が抜けていたのを修正)
    try {
      const response = await fetch(
        `http://localhost:5001/api/circles/${circleId}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '更新に失敗しました');
      }

      const responseData = await response.json();
      alert(responseData.message || 'サークル情報をしました！');
      navigate('/mypage');
    } catch (error) {
      console.error('通信エラー', error);
      alert(`通信に失敗しました: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    // 1. 確認ダイアログ
    if (!window.confirm('本当に削除しますか？\n削除すると元に戻せません。')) {
      return;
    }

    try {
      // 2. 削除APIを叩く (URLは /api/circle/ID)
      const response = await fetch(
        `http://localhost:5001/api/circle/${circleId}`,
        {
          method: 'DELETE',
          credentials: 'include', // Cookie送信に必須
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '削除に失敗しました');
      }

      alert('サークルを削除しました');

      // 3. マイページへ戻る
      navigate('/mypage');
    } catch (error) {
      console.error('削除エラー', error);
      alert(`削除に失敗しました: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        ID: {circleId} のサークル情報を読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1>エラーが発生しました</h1>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="edit-page-container">
      <Header />
      <main id="main">
      <div className="edit-card">
        <h1>サークル情報の編集</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Cname" className="label-text">サークル名 *</label>
            <CircleName value={circleData.circle_name} onChange={NameChange} />
            {errorFields.includes('circle_name') && (
              <p role="alert" style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                サークル名は必須項目です
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="Cdes" className="label-text">活動内容・説明 *</label>
            <CircleDescription
              value={circleData.circle_description}
              onChange={DesChange} />
            {errorFields.includes('circle_description') && (
              <p role="alert" style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                活動内容・説明は必須項目です
              </p>
            )}
          </div>

          {/* 男女比を横並びに */}
          <div className="grid-row">
            <div className="grid-col form-group">
              <label htmlFor="Cmen" className="label-text">男子人数</label>
              <CircleMen
                value={circleData.number_of_male}
                onChange={MemChange}
              />
            </div>
            <div className="grid-col form-group">
              <label htmlFor="Cfemen" className="label-text">女子人数</label>
              <CircleFemen
                value={circleData.number_of_female}
                onChange={FememChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="Cfee" className="label-text">会費（円）</label>
            <CircleFee value={circleData.circle_fee} onChange={FeeChange} />
          </div>

          <div className="form-group">
            <label className="label-text" htmlFor="Cicon">アイコン画像</label>
            <Image
              onChange={hadleImageChange}
              preview={preview}
              image={image}
              ref={fileInputRef}
            />
          </div>

          <div className="form-group">
            <label className="label-text">タグ設定</label>
            <Tag
              selectedBunya={selectedBunya}
              onChangeBunya={setSelectedBunya}
              selectedFee={selectedFee}
              onChangeFee={setSelectedFee}
              selectedRatio={selectedRatio}
              onChangeRatio={setSelectedRatio}
              selectedPlace={selectedPlace}
              onChangePlace={setSelectedPlace}
              selectedMood={selectedMood}
              onChangeMood={setSelectedMood}
              selectedActive={selectedActive}
              onChangeActive={setSelectedActive}
            />
          </div>

          {/* 更新ボタン */}
          {/* <button type="submit" className="btn-update"> */}
          <button type="submit" className="allbutton">
            情報を更新する
          </button>

          <button
          type='button'
            onClick={handleReset}
            className="clear-link"
          >
            変更を元に戻す
          </button>
<button type='button' onClick={resetImage} className='clear-link'>
画像を削除
</button>
          {/* 削除エリア */}
          <div className="delete-section">
            <button type="button" onClick={handleDelete} className="btn-delete">
              このサークルを削除する
            </button>
          </div>
        </form>

        <div className="back-link-container">
          <Link to={'/mypage'} className="back-link">
            ← マイページへ戻る
          </Link>
        </div>
      </div>
      </main>
    </div>
  );
}

export default CircleEdit;
