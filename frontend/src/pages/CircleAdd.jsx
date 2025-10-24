
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
    alert(`${preview}サークルを追加しました`);
  }else{
   // alert("キャンセルしました");
  }
  }
  };

  const [selectedBunya,setSelectedBunya]=useState(null);
  const [selectedFee,setSelectedFee]=useState(null);
  const [selectedRatio,setSelectedRatio]=useState(null);
  const [selectedPlace,setSelectedPlace]=useState(null);
  const [selectedMood,setSelectedMood]=useState(null);
  const [selectedActive,setSelectedActive]=useState(null);
 

  const [preview,setPreview]=useState(null);
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
      circle_description:circleData.circle_discription,
      circle_fee:circleData.circle_fee,
      number_of_male:circleData.number_of_male,
      number_of_female:circleData.number_of_female,
      circle_icon_path:preview,
      tags:circleData.selectedValues,
    }
    const json_stringdata = JSON.stringify(dataTosend);
    console.log('タグのjsonデータ:', json_stringdata);
    sendData(json_stringdata);
    return json_stringdata;

  };
  const sendData = async (json_stringdata) => {
    try {
      const response = await fetch("http://localhost:5001/hometest",{
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: json_stringdata,
      });

      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("サーバーからの応答:", result);
      if (receivedData_fb) {
        receivedData_fb(result);
      }
      alert("データを送信しました")

    }catch (error) {
      console.error("通信エラー", error);
    //  alert("通信に失敗しました");
    }
  };

  return (
    <>
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

    </form> 
 
    </>
  )
}
export default CircleAdd
