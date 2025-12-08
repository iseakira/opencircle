import React from 'react'

export default function CircleDescription({value,onChange,isError}) {
  return (
    <div>
      <textarea  onChange={onChange} value={value} id="Cdes"/>
    </div>
  )
}