import React from 'react'

export default function CircleName( {value,onChange,isError}) {
  // const isEmpty = !value || value.trim() === "";
    return (
    <div style={{ marginBottom: "20px" }}>
      <label
       htmlFor="Cname"
       style={{color:isError ? "red" : "black" , display: "block"}}>
        サークル名*<span style={{color:"red"}}></span>
        </label>
      <input value={value} onChange={onChange} type="text" id="Cname"/>
    </div>
  )
}
