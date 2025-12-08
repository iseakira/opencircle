import React from 'react'

export default function CircleMen({value,onChange}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <input type="number" onChange={onChange} value={value} id="Cmen" min="0"/>
    </div>
  )
}
