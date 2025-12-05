import React from 'react'

export default function CircleMen({value,onChange}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        htmlFor="Cmen"
        style={{ display: "block" }}     
      >サークル人数（男性）</label>
      <input type="number" onChange={onChange} value={value} id="Cmen"/>
    </div>
  )
}
