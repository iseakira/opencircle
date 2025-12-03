import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import Button from '../conponents/Button';
import CircleDescription from '../conponents/CircleDescription';
import CircleFee from '../conponents/CircleFee';
import CircleName from '../conponents/CircleName';
import Tag from '../conponents/Tag';
import Image from '../conponents/Image';
import CircleMen from '../conponents/CircleMen';
import CircleFemen from '../conponents/CircleFemen';
import CircleLogo from '../conponents/CircleLogo';

function CircleEdit() {
  const { circleId } = useParams();
  const navigate = useNavigate();

  const [circleData, setCircleData] = useState({
    circle_name: "",
    circle_description: "",
    circle_fee: "",
    number_of_male: "",
    number_of_female: "",
  });

  const [selectedBunya, setSelectedBunya] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedRatio, setSelectedRatio] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedActive, setSelectedActive] = useState(null);
  
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null); // (File オブジェクトがここに入る)
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 既存データを読み込む useEffect
  useEffect(() => {
    setLoading(true); 
    setError(null);
    
    fetch(`http://localhost:5001/api/circles/${circleId}`, {
      credentials: "include",
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
            throw new Error("このサークルを編集する権限がありません。");
        }
        if (res.status === 404) {
          throw new Error(`ID: ${circleId} のサークルは見つかりませんでした`);
        }
        if (!res.ok) {
          throw new Error("サーバーエラーにより情報の取得に失敗しました");
        }
        return res.json();
      })
      .then(data => {
        setCircleData({
          circle_name: data.circle_name,
          circle_description: data.circle_description,
          circle_fee: data.circle_fee || "",
          number_of_male: data.number_of_male || 0,
          number_of_female: data.number_of_female || 0,
        });
        
        setPreview(data.circle_icon_path); 

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
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message); 
        setLoading(false); 
      });
  }, [circleId]);

  // --- onChange ハンドラ ---
  const NameChange = (e) => setCircleData({ ...circleData, circle_name: e.target.value });
  const DesChange = (e) => setCircleData({ ...circleData, circle_description: e.target.value });
  const MemChange = (e) => setCircleData({ ...circleData, number_of_male: e.target.value });
  const FememChange = (e) => setCircleData({ ...circleData, number_of_female: e.target.value });
  const FeeChange = (e) => setCircleData({ ...circleData, circle_fee: e.target.value });
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
    if (!circleData.circle_name || !circleData.circle_description) {
      alert("サークル名とサークル説明は必須です");
      return;
    }

    const result = window.confirm("サークルを更新しますか？");
    if (!result) return;

    // 2. FormData オブジェクトを作成
    const formData = new FormData();

    // 3. テキストデータを FormData に追加
    formData.append("circle_name", circleData.circle_name);
    formData.append("circle_description", circleData.circle_description);
    formData.append("circle_fee", circleData.circle_fee || "0"); 
    formData.append("number_of_male", circleData.number_of_male || "0");
    formData.append("number_of_female", circleData.number_of_female || "0");

    // 4. タグリストを「JSON文字列」として FormData に追加
    const tagList = [
      selectedBunya,
      selectedFee,
      selectedRatio,
      selectedPlace,
      selectedMood,
      selectedActive,
    ];
    formData.append("tags", JSON.stringify(tagList)); 

    // 5. 画像ファイルを追加 (image state に File があれば)
    if (image) { 
      formData.append("circle_icon_file", image);
    }

    // 6. サーバーへ送信 (try...catch が抜けていたのを修正)
    try {
      const response = await fetch(`http://localhost:5001/api/circles/${circleId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "更新に失敗しました");
      }

      const responseData = await response.json();
      alert(responseData.message || "サークル情報をしました！");
      navigate("/mypage");

    } catch (error) {
      console.error("通信エラー", error);
      alert(`通信に失敗しました: ${error.message}`);
    }
  };


  if (loading) {
    return <div className="p-8 text-center">ID: {circleId} のサークル情報を読み込み中...</div>;
  }
  
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1>エラーが発生しました</h1>
        <p>{error}</p>
        <button 
          onClick={() => navigate("/mypage")} 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          マイページに戻る
        </button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}> 
       <header>
        {/* <h1> */}
        <CircleLogo></CircleLogo>
       {/* </h1> */}
       </header>
        <CircleName value={circleData.circle_name} onChange={NameChange}></CircleName>
        <CircleDescription value={circleData.circle_description} onChange={DesChange}></CircleDescription>
        <CircleMen value={circleData.number_of_male} onChange={MemChange}></CircleMen>
        <CircleFemen value={circleData.number_of_female} onChange={FememChange}></CircleFemen>
        <CircleFee value={circleData.circle_fee} onChange={FeeChange}></CircleFee>
        
        <Image onChange={hadleImageChange} preview={preview} image={image} />
        
        <Tag
          onChangeBunya={setSelectedBunya}
          onChangeFee={setSelectedFee}
          onChangeRatio={setSelectedRatio}
          onChangePlace={setSelectedPlace}
          onChangeMood={setSelectedMood}
          onChangeActive={setSelectedActive}
          
          // (Tag コンポーネント側が value プロパティに対応している必要があります)
          selectedBunya={selectedBunya}
          selectedFee={selectedFee}
          selectedRatio={selectedRatio}
          selectedPlace={selectedPlace}
          selectedMood={selectedMood}
          selectedActive={selectedActive}
        ></Tag>

        <button type="submit" className="allbutton">更新</button>
      </form>
      <Link to={"/mypage"} className='link'>マイページへ戻る</Link>
    </>
  );
}

export default CircleEdit
