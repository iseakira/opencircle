import React from 'react'

export default function CircleFee({value,onChange}) {
  return (
    <div>
      <p>サークル費</p>
      <input type="text" onChange={onChange} id="Cfee"/>
    </div>
  )
}
