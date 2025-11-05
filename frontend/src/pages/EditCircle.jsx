import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Button from '../conponents/Button';
import CircleDescription from '../conponents/CircleDescription';
import CircleFee from '../conponents/CircleFee';
import CircleName from '../conponents/CircleName';
import Tag from '../conponents/Tag';
import Image from '../conponents/image';
import { OPTIONS } from '../conponents/option';
import CircleMen from '../conponents/CircleMen';
import CircleFemen from '../conponents/CircleFemen';

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
  const [image, setImage] = useState(null);
  
  // 読み込み状態とエラーメッセージを管理する State
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 既存データを読み込む
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`http://localhost:5001/api/circles/${circleId}`, {
      credentials: "include",
    })
      .then(res => {
        // 404 (見つからない) の場合は、エラーメッセージを投げる
        if (res.status === 404) {
          throw new Error(`ID: ${circleId} のサークルは見つかりませんでした`);
        }
        // その他のサーバーエラー
        if (!res.ok) {
          throw new Error("サーバーエラーにより情報の取得に失敗しました");
        }
        return res.json();
      })
      .then(data => {
        // 取得したデータを State にセット
        setCircleData({
          circle_name: data.circle_name,
          circle_description: data.circle_description,
          circle_fee: data.circle_fee || "",
          number_of_male: data.number_of_male || 0,
          number_of_female: data.number_of_female || 0,
        });
        setPreview(data.circle_icon_path); // アイコンパスをセット

        // タグの State をセット (APIが6要素の配列を返す前提)
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
        // ネットワークエラーや、上で投げたエラーをここでキャッチ
        console.error("Fetch error:", err);
        setError(err.message); // State にエラーメッセージを保存
        setLoading(false); // ローディングも完了
        // (alert や navigate は無限ループになるため削除)
      });
  }, [circleId, navigate]); // 依存配列

  // --- onChange ハンドラ (友達のコード) ---
  const NameChange = (e) => setCircleData({ ...circleData, circle_name: e.target.value });
  const DesChange = (e) => setCircleData({ ...circleData, circle_description: e.target.value });
  const MemChange = (e) => setCircleData({ ...circleData, number_of_male: e.target.value });
  const FememChange = (e) => setCircleData({ ...circleData, number_of_female: e.target.value });
  const FeeChange = (e) => setCircleData({ ...circleData, circle_fee: e.target.value });
  const hadleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

     try {
      if (response.status === 404) {   
    let response = await fetch("http://localhost:5001/api/circles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dataToSend),
    });

    // if (response.status === 404) {
      // response = await fetch("http://localhost:5001/api/circles", {
        // method: "POST",
        // headers: { "Content-Type": "application/json" },
        // credentials: "include",
        // body: JSON.stringify(dataToSend),
      // });

      //  if (response.status === 404) {
      // throw new Error("対象のサークルが見つかりません。");
    // }
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "更新に失敗しました");
      }

      const responseData = await response.json();
      alert(responseData.message);
      navigate("/mypage");
    }
    } catch (error) {
      console.error("通信エラー", error);
      alert(`通信に失敗しました: ${error.message}`);
    }
  };


    // const responseData = await response.json();
    // alert(responseData.message || "サークル情報を更新しました！！");
    // navigate("/mypage");

  // } catch (error) {
    // console.error("通信エラー", error);
    // alert(`通信に失敗しました: ${error.message}`);
  // }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CircleName value={circleData.circle_name} onChange={NameChange}></CircleName>
        <CircleDescription value={circleData.circle_description} onChange={DesChange}></CircleDescription>
        <CircleMen value={circleData.number_of_male} onChange={MemChange}></CircleMen>
        <CircleFemen value={circleData.number_of_female} onChange={FememChange}></CircleFemen>
        <CircleFee value={circleData.circle_fee} onChange={FeeChange}></CircleFee>
        
        <Image onChange={hadleImageChange} preview={preview} image={image} />
        
        {/* (注意: このTagコンポーネントは、読み込んだ既存の値を表示する機能(value)を持っていない可能性があります) */}
        <Tag
          onChangeBunya={setSelectedBunya}
          onChangeFee={setSelectedFee}
          onChangeRatio={setSelectedRatio}
          onChangePlace={setSelectedPlace}
          onChangeMood={setSelectedMood}
          onChangeActive={setSelectedActive}
          selectedBunya={selectedBunya}
          selectedFee={selectedFee}
          selectedRatio={selectedRatio}
          selectedPlace={selectedPlace}
          selectedMood={selectedMood}
          selectedActive={selectedActive}
        ></Tag>

        <Button type="submit">サークルを更新する</Button>
      </form>
    </>
  );
}

export default CircleEdit;