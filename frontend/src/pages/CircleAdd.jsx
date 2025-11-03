
// import './App.css'
import Button from '../conponents/Button'
import CircleDescription from '../conponents/CircleDescription'
import CircleFee from '../conponents/CircleFee'
import CircleName from '../conponents/CircleName'
// import AddCircle from '../pages/AddCircle'
import React,{ useState } from 'react'
// import '../index.css'
// import Toggle from './Toggle'
import Tag from '../conponents/Tag'
// import { OPTIONS } from './conponents/option'
import Image from '../conponents/image'
import { OPTIONS } from '../conponents/option'
import CircleMen from '../conponents/CircleMen'
import CircleFemen from '../conponents/CircleFemen'
import headImage from '../images/head_image.png';
import { Link } from 'react-router-dom';

import CircleLogo from '../conponents/CircleLogo'
function CircleAdd() {
  const [circleData,setCircleData]=useState({
    circle_name:"",
    circle_description:"",
    circle_fee:"",
    number_of_male:"",
    number_of_female:"",
    circle_icon_path:"",
    tags:[],
  });
    const NameChange=(e)=>{
    setCircleData({
      ...circleData,
      circle_name:e.target.value,
    });
  }
  const DesChange=(e)=>{
    setCircleData({
      ...circleData,
     circle_description:e.target.value, 
    })
  }
  const MemChange=(e)=>{
    setCircleData({
      ...circleData,
     number_of_male:e.target.value, 
    })
  }
  const FememChange=(e)=>{
    setCircleData({
      ...circleData,
     number_of_female:e.target.value, 
    })
  }
  const FeeChange=(e)=>{
    setCircleData({
      ...circleData,
     circle_fee:e.target.value, 
    })
  }
  // const handleClick=()=>{
    // const {nam,des,member,fee}=circleData;
    // if(!nam||!des||!member||!fee){
      // alert("すべての情報を入力してください");
    // }else{
    // alert("サークルを追加しました");
  // }

  
  // }
 
    
  const [tags,setCircleTags]=useState("");

  const handleKey=(e)=>{
       e.preventDefault(); 
   const {circle_name,circle_description,circle_fee,number_of_male,number_of_female,circle_icon_path,tags}=circleData;
    if(!circle_name){
      alert("サークル名を入力してください");
    }else{
    // alert(`サークルを追加しました`);
     const result = window.confirm("サークルを追加しますか？");

  if(result){
       const selectedValues =[
       selectedBunya,
       selectedFee,
       selectedRatio,
       selectedPlace,
       selectedMood,
       selectedActive,
     ];

     setCircleTags({
      ...circleData,
      tags:selectedValues,
     })
    alert(`${selectedValues}サークルを追加しました`);
  }else{
   // alert("キャンセルしました");
  }
  }
  };

  const [selectedBunya,setSelectedBunya]=useState(0);
  const [selectedFee,setSelectedFee]=useState(0);
  const [selectedRatio,setSelectedRatio]=useState(0);
  const [selectedPlace,setSelectedPlace]=useState(0);
  const [selectedMood,setSelectedMood]=useState(0);
  const [selectedActive,setSelectedActive]=useState(0);
 

  const [preview,setPreview]=useState("");
  const [image,setImage]=useState(null);
  
  const hadleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file){
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }
  }
  
  const get_jsontags = () => {
    const dataTosend = {
      circle_name:circleData.circle_name,
      circle_description:circleData.circle_description,
      circle_fee:Number(circleData.circle_fee),
      number_of_male:Number(circleData.number_of_male),
      number_of_female:Number(circleData.number_of_female),
      circle_icon_path:preview,
      // tags:circleData.selectedValues,
      tags:[
        Number(selectedBunya),
       Number(selectedFee),
       Number(selectedRatio),
       Number(selectedPlace),
       Number(selectedMood),
       Number(selectedActive),
      ]
    }
    const json_stringdata = JSON.stringify(dataTosend);
    console.log('タグのjsonデータ:', json_stringdata);
    sendData(json_stringdata);
    return json_stringdata;

  };
  const sendData = async (json_stringdata) => {

    // // --- ▼ 1. localStorage からセッションIDを取得 ▼ ---
    // // (前提：ログインページが 'session_id' というキーでIDを保存している)
    // const sessionId = localStorage.getItem('session_id');

    //  if (!sessionId) {
    //     // alert() は使わないほうが良いかもしれませんが、既存コードに合わせています
    //     alert("ログインしていません。セッションIDが見つかりません。");
    //     console.error("セッションIDがlocalStorageに見つかりません");
    //     return; // ログインしていないので送信を中止
    // }
    // // --- ▲ 取得完了 ▲ ---


    try {
      const response = await fetch("http://localhost:5001/api/circles",{
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        //   // --- ▼ 2. 認証ヘッダー(X-Session-ID)を追加 ▼ ---
        //   'X-Session-ID': sessionId
        //   // --- ▲ ヘッダー追加完了 ▲ ---
         },
        body: json_stringdata,   
      });

/*
    try {
      const response = await fetch("http://localhost:5001/api/circles",{
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: json_stringdata,
      });


      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }
*/

      if(!response.ok){
        // --- ▼ 3. 認証エラー(401)のハンドリングを追加 ▼ ---
        if (response.status === 401) {
            // サーバーから '{"error": "..."}' が返ってくる
            const errorResult = await response.json();
            alert(`認証エラー: ${errorResult.error || 'ログインセッションが無効です'}`);
        } else {
            // その他のHTTPエラー
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return; // エラー時はここで停止
        // --- ▲ エラーハンドリング完了 ▲ ---
      }


      const result = await response.json();
      console.log("サーバーからの応答:", result);
      // if (receivedData_fb) {
       // receivedData_fb(result);
      //}
      alert("データを送信しました")

    }catch (error) {
      console.error("通信エラー", error);
    //alert("通信に失敗しました");
    }
  };


   const [response_data, setResponse_data] = useState(null);
    const handleResponse = (data) => {
      console.log("受信したデータ:", data);
      setResponse_data(data);
    };
  return (

    <div>
      <header>
        <h1>
          <Link to="/">
            <img className="logo" src={headImage} alt="アイコン" />
          </Link>
        </h1>
      </header>
      <h1>東京理科大学サークル情報サイト</h1>
      <h3>追加したいサークルの情報を入力してください</h3>
      {/* <AddCircle></AddCircle> */}
      <form onSubmit={handleKey}> 
        <CircleName value={circleData.circle_name} onChange={NameChange} ></CircleName>
        <CircleDescription value={circleData.circle_description} onChange={DesChange}></CircleDescription>
        <CircleMen value={circleData.number_of_male} onChange={MemChange}></CircleMen>
        <CircleFemen value={circleData.number_of_female} onChange={FememChange}></CircleFemen>
        <CircleFee value={circleData.circle_fee} onChange={FeeChange}></CircleFee>
        <Image onChange={hadleImageChange} preview={preview} image={image}/>
        <Tag onChangeBunya={setSelectedBunya} onChangeFee={setSelectedFee} onChangeRatio={setSelectedRatio} onChangePlace={setSelectedPlace} onChangeMood={setSelectedMood} onChangeActive={setSelectedActive} 
        ></Tag> 
  
        {/* <Toggle></Toggle> */}
        {/* <Button type="submit" onClick={handleKey} ></Button> */}
        <Button type="submit" onClick={get_jsontags} ></Button>
        <Link to={"/mypage"}>マイページへ戻る</Link>
      </form> 
    </div>
  
  )
}
export default CircleAdd
