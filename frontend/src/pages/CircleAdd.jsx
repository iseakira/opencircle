import '../css/App.css';
import Button from '../conponents/Button';
import CircleDescription from '../conponents/CircleDescription';
import CircleFee from '../conponents/CircleFee';
import CircleName from '../conponents/CircleName';
import React, { useState, useRef } from 'react';
import Tag from '../conponents/Tag';
import Image from '../conponents/Image';
import { OPTIONS } from '../conponents/option';
import CircleMen from '../conponents/CircleMen';
import CircleFemen from '../conponents/CircleFemen';
import headImage from '../images/head_image.png';
import { Link } from 'react-router-dom';
import Header from '../conponents/Header.jsx';
function CircleAdd() {
  const initialCircleData = {
    circle_name: '',
    circle_description: '',
    circle_fee: '',
    number_of_male: '',
    number_of_female: '',
  };
  const [circleData, setCircleData] = useState(initialCircleData);

  const NameChange = (e) => {
    setCircleData({
      ...circleData,
      circle_name: e.target.value,
    });
  };
  const DesChange = (e) => {
    setCircleData({
      ...circleData,
      circle_description: e.target.value,
    });
  };
  const MemChange = (e) => {
    setCircleData({
      ...circleData,
      number_of_male: e.target.value,
    });
  };
  const FememChange = (e) => {
    setCircleData({
      ...circleData,
      number_of_female: e.target.value,
    });
  };
  const FeeChange = (e) => {
    setCircleData({
      ...circleData,
      circle_fee: e.target.value,
    });
  };

  const [tags, setCircleTags] = useState([]);
  const [errorFields, setErrorFields] = useState([]);
  const handleKey = (e) => {
    e.preventDefault();
    const errors = [];
    const {
      circle_name,
      circle_description,
      circle_fee,
      number_of_male,
      number_of_female,
      circle_icon_path,
      tags,
    } = circleData;
    if (!circle_name) {
      errors.push('circle_name');
    }
    if (!circle_description) {
      errors.push('circle_description');
    }
    if (errors.length > 0) {
      setErrorFields(errors);
    }
    if (!circle_name || !circle_description) {
      alert('*は必須項目です');
    } else {
      // alert(`サークルを追加しました`);
      const result = window.confirm('サークルを追加しますか？');

      if (result) {
        const selectedValues = [
          selectedBunya,
          selectedFee,
          selectedRatio,
          selectedPlace,
          selectedMood,
          selectedActive,
        ];

        setCircleTags({
          ...circleData,
          tags: selectedValues,
        });
        alert(`サークルを追加しました`);
        setErrorFields([]);
      } else {
        // alert("キャンセルしました");
      }
    }
  };

  const [selectedBunya, setSelectedBunya] = useState(0);
  const [selectedFee, setSelectedFee] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [selectedMood, setSelectedMood] = useState(0);
  const [selectedActive, setSelectedActive] = useState(0);

  // const [preview,setPreview]=useState("");
  const [preview, setPreview] = useState(null);

  const [image, setImage] = useState(null);

  const hadleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      // const reader = new FileReader();
      // reader.onloadend = () => {
      // const
      // }
    }
  };

  const fileInputRef = useRef(null);
  const reloadData = () => {
    setCircleData(initialCircleData);
    setSelectedBunya('');
    setSelectedFee('');
    setSelectedRatio('');
    setSelectedPlace('');
    setSelectedMood('');
    setSelectedActive('');
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const get_jsontags = async () => {
    // const dataTosend = {
    // circle_name:circleData.circle_name,
    // circle_description:circleData.circle_description,
    // circle_fee:Number(circleData.circle_fee),
    // number_of_male:Number(circleData.number_of_male),
    // number_of_female:Number(circleData.number_of_female),
    // circle_icon_path:preview,
    // tags:circleData.selectedValues,
    const tagList = [
      Number(selectedBunya),
      Number(selectedFee),
      Number(selectedRatio),
      Number(selectedPlace),
      Number(selectedMood),
      Number(selectedActive),
    ];
    const formData = new FormData();
    formData.append('circle_name', circleData.circle_name);
    formData.append('circle_description', circleData.circle_description);
    formData.append('circle_fee', circleData.circle_fee || '0');
    formData.append('number_of_male', circleData.number_of_male || '0');
    formData.append('number_of_female', circleData.number_of_female || '0');
    formData.append('tags', JSON.stringify(tagList));
    // tags:[
    // Number(selectedBunya),
    //  Number(selectedFee),
    //  Number(selectedRatio),
    //  Number(selectedPlace),
    //  Number(selectedMood),
    //  Number(selectedActive),
    // ]
    if (image) {
      //  formData.append("circle_icon",circleData.circle_icon);
      formData.append('circle_icon_file', image);
    }
    console.log('送信データ (FormData):');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    await sendData(formData);
  };

  // const formData = new FormData();
  // formData.append("json_data",JSON.stringify(dataTosend));

  //   const json_stringdata = JSON.stringify(dataTosend);
  //  if(image){
  //  formData.append("circle_icon",circleData.circle_icon);
  //  }
  //  console.log('タグのjsonデータ:', json_stringdata);
  // sendData(json_stringdata);
  // return json_stringdata;
  // console.log("送信データ内容",dataTosend);
  // await sendData(formData);
  //   };
  // const sendData = async (json_stringdata) => {
  const sendData = async (formData) => {
    // const sendData = async (formData) => {
    try {
      const response = await fetch('http://localhost:5001/api/circles', {
        method: 'POST',
        body: formData,
        // headers:{
        // 'Content-Type': 'application/json',
        // },
        // body: json_stringdata,
        credentials: 'include',
      });

      if (!response.ok) {
        // --- ▼ 3. 認証エラー(401)のハンドリングを追加 ▼ ---
        if (response.status === 401) {
          // サーバーから '{"error": "..."}' が返ってくる
          const errorResult = await response.json();
          alert(
            `認証エラー: ${errorResult.error || 'ログインセッションが無効です'}`
          );
        } else {
          // その他のHTTPエラー
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return; // エラー時はここで停止
        // --- ▲ エラーハンドリング完了 ▲ ---
      }

      const result = await response.json();
      console.log('サーバーからの応答:', result);
      // if (receivedData_fb) {
      // receivedData_fb(result);
      //}
      // alert("データを送信しました")
    } catch (error) {
      console.error('通信エラー', error);
      alert('通信に失敗しました');
    }
  };

  const [response_data, setResponse_data] = useState(null);
  const handleResponse = (data) => {
    console.log('受信したデータ:', data);
    setResponse_data(data);
  };

  return (
    <div>
      <Header />
      <h3>追加したいサークルの情報を入力してください</h3>
      <p>※「*」の項目は必須</p>
      {/* <AddCircle></AddCircle> */}
      <form onSubmit={handleKey}>
        <CircleName
          value={circleData.circle_name}
          onChange={NameChange}
          isError={errorFields.includes('circle_name')}
        ></CircleName>
        <CircleDescription
          value={circleData.circle_description}
          onChange={DesChange}
          isError={errorFields.includes('circle_description')}
        ></CircleDescription>
        <CircleMen
          value={circleData.number_of_male}
          onChange={MemChange}
        ></CircleMen>
        <CircleFemen
          value={circleData.number_of_female}
          onChange={FememChange}
        ></CircleFemen>
        <CircleFee
          value={circleData.circle_fee}
          onChange={FeeChange}
        ></CircleFee>
        <Image
          onChange={hadleImageChange}
          preview={preview}
          image={image}
          ref={fileInputRef}
        />
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
        ></Tag>
        <p onClick={reloadData}>クリア</p>
        <Button type="submit" onClick={get_jsontags}></Button>
        <Link to={'/mypage'} className="link">
          マイページへ戻る
        </Link>
      </form>
    </div>
  );
}
export default CircleAdd;
