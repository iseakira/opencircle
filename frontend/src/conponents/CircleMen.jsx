import React from 'react'

export default function CircleMen({value,onChange}) {
  return (
    <div>
      <p>サークル人数（男性）</p>
      <input type="number" onChange={onChange} id="Cmen"/>
    </div>
  )
}
