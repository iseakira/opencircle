import React from 'react'

export default function CircleName( {value,onChange,isError}) {
  // const isEmpty = !value || value.trim() === "";
    return (
    <div>
      <p style={{color:isError ? "red" : "black"}}>
        サークル名*<span style={{color:"red"}}></span>
        </p>
      <input value={value} onChange={onChange} type="text" id="Cname"/>
    </div>
  )
}
