import { useState } from 'react';
import '../css/App.css';
function Toggle({receivedData_fb}) {
  //トグル操作
  const [visible, setVisible] = useState(false);
  const make_visible = () => {
    setVisible(!visible);
  };
  //検索エンジン
  const [search_term, setSearch_term] = useState('');
  const change_search_term = (e) => {
    setSearch_term(e.target.value);
  };

  //タグのステート
  const [field, setField] = useState('');
  const [circle_fee, setCircle_fee] = useState('');
  const [gender_ratio, setGender_ratio] = useState('');
  const [place, setPlace] = useState('');
  const [mood, setMood] = useState('');
  const [frequency, setFrequency] = useState('');
  //タグ 選択時の処理
  const change_field =(e) =>{
    setField(e.target.value);
  };
  const change_circle_fee =(e) =>{
    setCircle_fee(e.target.value);
  };
  const change_gender_ratio =(e) =>{
    setGender_ratio(e.target.value);
  };
  const change_place =(e) =>{
    setPlace(e.target.value);
  };
  const change_mood =(e) =>{
    setMood(e.target.value);
  };
  const change_frequency =(e) =>{
    setFrequency(e.target.value);
  };  
  //jsonデータ取得
  const get_jsontags = () => {
    const dataTosend = {
      search_term: search_term,
      tags: [field, circle_fee, gender_ratio, place, mood, frequency]
    }
    dataTosend.tags = dataTosend.tags.filter(tag => tag !== "");
    const json_stringdata = JSON.stringify(dataTosend);
    console.log('タグのjsonデータ:', json_stringdata);
    sendData(json_stringdata);
  };
  const sendData = async (json_stringdata) => {
    try {
      const response = await fetch("http://localhost:5001/home",{
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
    }catch (error) {
      console.error("通信エラー", error);
      alert("通信に失敗しました");
      if(receivedData_fb){
        receivedData_fb([]);
      }
    }
  };

  // const [selectRelord,setselectReload] =useState(null);
 const reloadSelect =()=> {
  setSearch_term('');
  setField('');
  setCircle_fee('');
  setGender_ratio('');
  setPlace('');
  setMood('');
  setFrequency('');
  setSearch_term('');
// alert("選択肢をクリアしました");
};

  return (
    <div>
      <button onClick={make_visible} aria-expanded={visible}>
        {visible ? '▶絞り込みを閉じる' : '▽絞り込みを開く'}
      </button>
      {visible && (
        <div className="tag-select">
          <h4>キーワードを入力するかタグを選択してください</h4>       

<div className='search'>
           <p> キーワード検索</p>
           <div className='input-group'>
           <input type="text" placeholder="キーワードを入力" value={search_term} onChange={change_search_term} />
             <button onClick={reloadSelect} className='btn-clear'>クリア</button>
</div>
</div>
            {/* <br/> */}
            <div className="tags">
            
            <label>分野</label>
            <select value={field} onChange={change_field}>
              <option value="">未選択</option>
              <option value="1">運動</option>
              <option value="2">文化</option>
              <option value="3">音楽</option>
              <option value="4">学生自治</option>
            </select>
            <br/>
            <label>費用</label>
            <select value={circle_fee} onChange={change_circle_fee}>
              <option value="">未選択</option>
              <option value="5">無料</option>
              <option value="6">2000円未満</option>
              <option value="7">2000円以上</option>
            </select>
            <br/>
            <label>男女比</label>
            <select value={gender_ratio} onChange={change_gender_ratio}>
              <option value="">未選択</option>
              <option value="8">男性多め</option>
              <option value="9">女性多め</option>
              <option value="10">男女半々</option>
            </select>
            <br/>
            <label>活動場所</label>
            <select value={place} onChange={change_place}>
              <option value="">未選択</option>
              <option value="11">学内</option>
              <option value="12">学外</option>
            </select>
            <br/>
            <label>雰囲気</label>
            <select value={mood} onChange={change_mood}>
              <option value="">未選択</option>
              <option value="13">賑やか</option>
              <option value="14">落ち着いている</option>
            </select>
            <br/>
            <label>活動頻度</label>
            <select value={frequency} onChange={change_frequency}>
              <option value="">未選択</option>
              <option value="15">週3未満</option>
              <option value="16">週3以上</option>
              <option value="17">不定期</option>
            </select>
            <br />
          </div>
          {/* <br/> */}
          <div className='toggle-btn'>
         
          {/* <br /> */}
          <button onClick={get_jsontags} className='allbutton'>絞り込む</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Toggle;
