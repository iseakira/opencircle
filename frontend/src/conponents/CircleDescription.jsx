import React from 'react'

export default function CircleDescription({value,onChange,isError}) {
  return (
    <div style={{ marginBottom: "20px" }}>
       <label
       htmlFor="Cdes" 
       style={{color:isError ? "red" : "black", display: "block"}}>
        説明*<span style={{color:"red"}}></span>
        </label>
      <textarea  onChange={onChange} value={value} id="Cdes"/>
    </div>
  )
}