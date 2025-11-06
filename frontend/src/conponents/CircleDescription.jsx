import React from 'react'

export default function CircleDescription({value,onChange}) {
  return (
    <div>
      <p>説明*</p>
      <textarea type="text" onChange={onChange} value={value} id="Cdes"/>
    </div>
  )
}