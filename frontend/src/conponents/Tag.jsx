import React, { useState } from 'react';
//import Select from 'react-select';
import './tag.css';
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
      <div className="tag-list">
        <div className='tag-row'>
<label htmlFor="">分野</label>
{/* <Select */}
{/* options={OPTIONS.BUNYA} */}
{/* value={selectedBunya} */}
{/* onChange={handleChangeBunya} */}
{/* classNamePrefix="react-select" */}
{/* /> */}
<select value={selectedBunya || OPTIONS.BUNYA[0].value} onChange={handleChangeBunya}>
    {OPTIONS.BUNYA.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</div> 
<div className='tag-row'>
<label htmlFor="">費用</label>
{/* <Select */}
{/* options={OPTIONS.FEE} */}
{/* value={selectedFee} */}
{/* onChange={handleChangeFee} */}
{/* classNamePrefix="react-select" */}
{/* /> */}
<select value={selectedFee|| OPTIONS.FEE[0].value} onChange={handleChangeFee}>
    {OPTIONS.FEE.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</div> 
<div className='tag-row'>
<label htmlFor="">男女比</label>
{/* <Select */}
{/* options={OPTIONS.RATIO} */}
{/* value={selectedRatio} */}
{/* onChange={handleChangeRatio} */}
{/* classNamePrefix="react-select" */}
{/* /> */}
<select value={selectedRatio|| OPTIONS.RATIO[0].value} onChange={handleChangeRatio}>
    {OPTIONS.RATIO.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</div>
<div className='tag-row'>
<label htmlFor="">活動場所</label>
{/* <Select */}
{/* options={OPTIONS.PLACE} */}
{/* value={selectedPlace} */}
{/* onChange={handleChangePlace} */}
{/* classNamePrefix="react-select" */}
{/* /> */}
<select value={selectedPlace|| OPTIONS.PLACE[0].value} onChange={handleChangePlace}>
    {OPTIONS.PLACE.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</div>
<div className='tag-row'>
<label htmlFor="">雰囲気</label>
{/* <Select */}
{/* options={OPTIONS.MOOD} */}
{/* value={selectedMood} */}
{/* onChange={handleChangeMood} */}
{/* classNamePrefix="react-select" */}
{/* /> */}
<select value={selectedMood|| OPTIONS.MOOD[0].value} onChange={handleChangeMood}>
    {OPTIONS.MOOD.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</div>
<div className='tag-row'>
<label htmlFor="">活動頻度</label>
{/* <Select */}
{/* options={OPTIONS.ACTIVE} */}
{/* value={selectedActive} */}
{/* onChange={handleChangeActive} */}
{/* classNamePrefix="react-select" */}
{/* /> */}
<select value={selectedActive || OPTIONS.ACTIVE[0].value} onChange={handleChangeActive}>
    {OPTIONS.ACTIVE.map((option)=>(
    <option key={option.value} value={option.value}>
{option.label}
    </option>)
    )}
</select>
</div>
</div>

</div>
  )
}
