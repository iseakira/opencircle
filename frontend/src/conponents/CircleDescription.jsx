import React from 'react'

export default function CircleDescription({value,onChange,isError}) {
  return (
    <div>
       {/* <p style={{color:isError ? "red" : "black"}}>
        説明*<span style={{color:"red"}}></span>
        </p> */}
      <textarea  onChange={onChange} value={value} id="Cdes"/>
    </div>
  )
}