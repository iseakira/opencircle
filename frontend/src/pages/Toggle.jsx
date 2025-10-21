import { useState } from 'react';

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
  //タグ選択時の処理
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
      field: field,
      circle_fee: circle_fee,
      gender_ratio: gender_ratio,
      place: place,
      mood: mood,
      frequency: frequency
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
      alert("通信に失敗しました");
    }
  };
  return (
    <div>
      <button onClick={make_visible} aria-expanded={visible}>
        {visible ? '▶絞り込みを閉じる' : '▽絞り込みを開く'}
      </button>
      {visible && (
        <div className="tag-select">
          <h4>キーワードを入力するかタグを選択してください</h4>

          
          <div className="tags">
            キーワード検索:<input type="text" placeholder="キーワードを入力" value={search_term} onChange={change_search_term} />
            <br/>
            <label>分野</label>
            <select value={field} onChange={change_field}>
              <option value="">未選択</option>
              <option value="運動">運動</option>
              <option value="文化">文化</option>
              <option value="音楽">音楽</option>
              <option value="学生自治">学生自治</option>
            </select>
            <br/>
            <label>費用</label>
            <select value={circle_fee} onChange={change_circle_fee}>
              <option value="">未選択</option>
              <option value="0">無料</option>
              <option value="2000円未満">2000円未満</option>
              <option value="2000円以上">2000円以上</option>
            </select>
            <br/>
            <label>男女比</label>
            <select value={gender_ratio} onChange={change_gender_ratio}>
              <option value="">未選択</option>
              <option value="男性多め">男性多め</option>
              <option value="女性多め">女性多め</option>
              <option value="男女半々">男女半々</option>
            </select>
            <br/>
            <label>活動場所</label>
            <select value={place} onChange={change_place}>
              <option value="">未選択</option>
              <option value="学内">学内</option>
              <option value="学外">学外</option>
            </select>
            <br/>
            <label>雰囲気</label>
            <select value={mood} onChange={change_mood}>
              <option value="">未選択</option>
              <option value="賑やか">賑やか</option>
              <option value="落ち着いている">落ち着いている</option>
            </select>
            <br/>
            <label>活動頻度</label>
            <select value={frequency} onChange={change_frequency}>
              <option value="">未選択</option>
              <option value="週3未満">週3未満</option>
              <option value="週3以上">週3以上</option>
              <option value="不定期">不定期</option>
            </select>
            
          </div>
          <br/>
          <button onClick={get_jsontags}>絞り込む</button>
        </div>
      )}
    </div>
  );
}
export default Toggle;
