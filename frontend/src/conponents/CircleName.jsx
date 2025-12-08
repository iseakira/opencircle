import React from 'react'

export default function CircleName( {value,onChange,isError}) {
  // const isEmpty = !value || value.trim() === "";
    return (
    <div>
      <input value={value} onChange={onChange} type="text" id="Cname"/>
    </div>
  )
}
