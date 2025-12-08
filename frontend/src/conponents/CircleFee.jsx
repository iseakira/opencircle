import React from 'react'

export default function CircleFee({value,onChange}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <input type="number" onChange={onChange} value={value} id="Cfee" min="0"/>
    </div>
  )
}
