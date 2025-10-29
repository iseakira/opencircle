import React from 'react'

export default function Button({onClick}) {  
    return (
    <div>  
      <button type="submit" id = "button" onClick={onClick}>追加</button>
    </div>
  )
}

