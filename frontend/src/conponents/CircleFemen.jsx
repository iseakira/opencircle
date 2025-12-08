import React from 'react'

export default function CircleFemen({value,onChange}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <input type="number" onChange={onChange} value={value} id="Cfemen" min="0"/>
    </div>
  )
}
