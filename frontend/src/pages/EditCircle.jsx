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

useEffect(() => {
  fetch(`http://localhost:5001/api/circles/${circleId}`, {
    credentials: "include",
  })
    .then(res => {
      if (!res.ok) {
        if (res.status === 404) {
          console.warn("サークル情報が見つかりませんでした（新規作成扱い）");
          return null;
        }
        throw new Error("サークル情報の取得に失敗しました");
      }
      return res.json();
    })
    .then(data => {
      if (!data) return;

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
    })
    .catch(err => {
      console.error(err);
      alert("サークル情報の取得に失敗しました（通信エラー）");
    });
}, [circleId]);


  const NameChange = (e) => setCircleData({ ...circleData, circle_name: e.target.value });
  const DesChange = (e) => setCircleData({ ...circleData, circle_description: e.target.value });
  const MemChange = (e) => setCircleData({ ...circleData, number_of_male: e.target.value });
  const FememChange = (e) => setCircleData({ ...circleData, number_of_female: e.target.value });
  const FeeChange = (e) => setCircleData({ ...circleData, circle_fee: e.target.value });
  const hadleImageChange = (e) => { /* (画像更新は省略) */ };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!circleData.circle_name || !circleData.circle_description) {
    alert("サークル名とサークル説明は必須です");
    return;
  }

  const tagList = [
    selectedBunya,
    selectedFee,
    selectedRatio,
    selectedPlace,
    selectedMood,
    selectedActive,
  ].filter(tagId => tagId != null);

  const dataToSend = {
    circle_name: circleData.circle_name,
    circle_description: circleData.circle_description,
    circle_fee: circleData.circle_fee || null,
    number_of_male: parseInt(circleData.number_of_male) || 0,
    number_of_female: parseInt(circleData.number_of_female) || 0,
    tags: tagList,
  };

  try {
    let response = await fetch(`http://localhost:5001/api/circles/${circleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dataToSend),
    });


    if (response.status === 404) {
      response = await fetch("http://localhost:5001/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      });
    }

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "保存に失敗しました");
    }

    const responseData = await response.json();
    alert(responseData.message || "保存しました！");
    navigate("/mypage");

  } catch (error) {
    console.error("通信エラー", error);
    alert(`通信に失敗しました: ${error.message}`);
  }
};


  return (
    <>
      <form onSubmit={handleSubmit}> {/*onSubmit を設定*/}
        <CircleName value={circleData.circle_name} onChange={NameChange}></CircleName>
        <CircleDescription value={circleData.circle_description} onChange={DesChange}></CircleDescription>
        <CircleMen value={circleData.number_of_male} onChange={MemChange}></CircleMen>
        <CircleFemen value={circleData.number_of_female} onChange={FememChange}></CircleFemen>
        <CircleFee value={circleData.circle_fee} onChange={FeeChange}></CircleFee>
        
        {/* 画像 */}
        <Image onChange={hadleImageChange} preview={preview} image={image} />
        
        {/* タグ (注意: このままでは古い値が表示されません) */}
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

        {/* onClick を削除し、テキストを変更 */}
        <Button type="submit">サークルを更新する</Button>
      </form>
    </>
  );
}

export default CircleEdit;