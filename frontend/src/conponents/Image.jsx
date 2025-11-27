import React from 'react'
import { useState } from 'react'

export default function Image({onChange ,preview,image,fileInputRef}) {


//   const [preview,setPreview]=useState(null);
//   const [image,setImage]=useState(null);
    return (
    <div>
        <p>サークル画像</p>
 <input type="file" 
 accept="image/*"
 onChange={onChange}
 ref={fileInputRef}
 />     
 {preview&&(
     <div> 
       <p>プレビュー</p>
         <img src={preview} 
         alt="" 
         style={{
          maxWidth:"300px",
          maxHeight:"300px",
         }}
         />
     </div>
 )}
    </div>
  )
}