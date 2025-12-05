import React from 'react'

export default function CircleFemen({value,onChange}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        htmlFor="Cfemen"
        style={{ display: "block" }} 
      >サークル人数（女性）</label>
      {/* <p>サークル人数（女性）</p> */}
      <input type="number" onChange={onChange} value={value} id="Cfemen"/>
    </div>
  )
}
