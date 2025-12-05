import React from 'react'

export default function CircleFee({value,onChange}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        htmlFor="Cmen"
        style={{ display: "block" }}
      >サークル費</label>
      {/* <p>サークル費</p> */}
      <input type="number" onChange={onChange} value={value} id="Cfee"/>
    </div>
  )
}
