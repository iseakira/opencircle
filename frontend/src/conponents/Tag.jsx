import React, { useState } from 'react';
//import Select from 'react-select';
import './tag.css';
import { OPTIONS } from './option';
export default function Tag({onChangeBunya,onChangeFee,onChangeRatio,onChangePlace,onChangeMood,onChangeActive}) {


const [selectedBunya, setSelectedBunya] = useState(OPTIONS.BUNYA[0]);
const [selectedFee, setSelectedFee] = useState(OPTIONS.FEE[0]);
const [selectedRatio, setSelectedRatio] = useState(OPTIONS.RATIO[0]);
const [selectedPlace, setSelectedPlace] = useState(OPTIONS.PLACE[0]);
const [selectedMood, setSelectedMood] = useState(OPTIONS.MOOD[0]);
const [selectedActive, setSelectedActive] = useState(OPTIONS.ACTIVE[0]);


const handleChangeBunya=(e)=>{
setSelectedBunya(e.target.value);
onChangeBunya(e.target.value);
}
const handleChangeFee=(e)=>{
setSelectedFee(e.target.value);
onChangeFee(e.target.value);
}
const handleChangeRatio=(e)=>{
setSelectedRatio(e.target.value);
onChangeRatio(e.target.value);
}
const handleChangePlace=(e)=>{
setSelectedPlace(e.target.value);
onChangePlace(e.target.value);
}
const handleChangeMood=(e)=>{
setSelectedMood(e.target.value);
onChangeMood(e.target.value);
}
const handleChangeActive=(e)=>{
setSelectedActive(e.target.value);
onChangeActive(e.target.value);
}
    return (
    <div>
      <p>タグを選択せい</p>
      <div className="tag-list">
        <div className='tag-row'>
<label htmlFor="">分野</label>
{/* <Select */}
{/* options={OPTIONS.BUNYA} */}
{/* value={selectedBunya} */}
{/* onChange={handleChangeBunya} */}
{/* classNamePrefix="react-select" */}
{/* /> */}
<select value={selectedBunya} onChange={handleChangeBunya}>
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
<select value={selectedFee} onChange={handleChangeFee}>
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
<select value={selectedRatio} onChange={handleChangeRatio}>
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
<select value={selectedPlace} onChange={handleChangePlace}>
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
<select value={selectedMood} onChange={handleChangeMood}>
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
<select value={selectedActive} onChange={handleChangeActive}>
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
