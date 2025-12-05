import React, { useState } from 'react';
//import Select from 'react-select';
import './add.css';
import { OPTIONS } from './option';
export default function Tag({
    onChangeBunya,
    onChangeFee,
    onChangeRatio,
    onChangePlace,
    onChangeMood,
    onChangeActive,
    selectedBunya,
    selectedFee,
    selectedRatio,
    selectedPlace,
    selectedMood,
    selectedActive,}) {


//const [selectedBunya, setSelectedBunya] = useState(OPTIONS.BUNYA[0].value);
// const [selectedBunya, setSelectedBunya] = useState(0);
//const [selectedFee, setSelectedFee] = useState(OPTIONS.FEE[0]);
//const [selectedRatio, setSelectedRatio] = useState(OPTIONS.RATIO[0]);
//const [selectedPlace, setSelectedPlace] = useState(OPTIONS.PLACE[0]);
//const [selectedMood, setSelectedMood] = useState(OPTIONS.MOOD[0]);
//const [selectedActive, setSelectedActive] = useState(OPTIONS.ACTIVE[0]);


const handleChangeBunya=(e)=>{
    const value=Number(e.target.value);
//setSelectedBunya(value);
onChangeBunya(value);
}
const handleChangeFee=(e)=>{
    const value=Number(e.target.value);
//setSelectedFee(value);
onChangeFee(value);
}
const handleChangeRatio=(e)=>{
    const value=Number(e.target.value);
//setSelectedRatio(value);
onChangeRatio(value);
}
const handleChangePlace=(e)=>{
    const value=Number(e.target.value);
//setSelectedPlace(value);
onChangePlace(value);
}
const handleChangeMood=(e)=>{
const value=Number(e.target.value);
//setSelectedMood(value);
onChangeMood(value);
}
const handleChangeActive=(e)=>{
    const value=Number(e.target.value);
//setSelectedActive(value);
onChangeActive(value);
}
    return (
    <div>
      <p>タグを選択してください</p>
      <ul className="tag-list">
        <li className='tag-row'>
<label htmlFor="tag_bunya">分野</label>
<select 
id="tag_bunya"
value={selectedBunya || OPTIONS.BUNYA[0].value} onChange={handleChangeBunya}>
    {OPTIONS.BUNYA.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</li> 
<li className='tag-row'>
<label htmlFor="tag_fee">費用</label>
<select
id="tag_fee"
value={selectedFee|| OPTIONS.FEE[0].value} onChange={handleChangeFee}>
    {OPTIONS.FEE.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</li> 
<li className='tag-row'>
<label htmlFor="tag_ratio">男女比</label>
<select 
id="tag_ratio"
value={selectedRatio|| OPTIONS.RATIO[0].value} onChange={handleChangeRatio}>
    {OPTIONS.RATIO.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</li>
<li className='tag-row'>
<label htmlFor="tag_place">活動場所</label>
<select 
id="tag_place"
value={selectedPlace|| OPTIONS.PLACE[0].value} onChange={handleChangePlace}>
    {OPTIONS.PLACE.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</li>
<li className='tag-row'>
<label htmlFor="tag_mood">雰囲気</label>
<select 
id="tag_mood"
value={selectedMood|| OPTIONS.MOOD[0].value} onChange={handleChangeMood}>
    {OPTIONS.MOOD.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</li>
<li className='tag-row'>
<label htmlFor="tag_active">活動頻度</label>
<select 
id="tag_active"
value={selectedActive || OPTIONS.ACTIVE[0].value} onChange={handleChangeActive}>
    {OPTIONS.ACTIVE.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</li>
</ul>
</div>
  )
}
