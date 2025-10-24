import React from 'react'

export default function CircleName( {value,onChange}) {
    return (
    <div>
      <p>サークル名</p>
      <input value={value} onChange={onChange} type="text" id="Cname"/>
    </div>
  )
}
