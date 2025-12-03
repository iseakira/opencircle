import React from 'react'
// import React,{ useState } from 'react'

export default function Button({onClick}) {  
  return (
    <div>  
      <button type="submit" className="allbutton" onClick={onClick}
      style={{
        marginBottom:"20px",
      }}
      >追加</button>
    </div>
  )
}

