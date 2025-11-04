import React from 'react'

export default function CircleFemen({value,onChange}) {
  return (
    <div>
      <p>サークル人数（女性）</p>
      <input type="number" onChange={onChange} value={value} id="Cfemen"/>
    </div>
  )
}
