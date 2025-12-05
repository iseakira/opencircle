import React,{forwardRef} from 'react'
// import { useState } from 'react'

// export default function Image({onChange ,preview,image},ref) {
const ImageComponent = forwardRef(function Image({onChange,preview,image},ref){

//   const [preview,setPreview]=useState(null);
//   const [image,setImage]=useState(null);
    return (
    <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="Cmen"
          style={{ display: "block" }}
        >サークル画像</label>
 <input type="file" 
 accept="image/*"
 onChange={onChange}
 ref={ref}
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
  );
});
export default ImageComponent;

