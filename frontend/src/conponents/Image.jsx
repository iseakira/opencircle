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
    <div>
        {/* <p>サークル画像</p> */}
 <input type="file" 
 accept="image/*"
 onChange={onChange}
 ref={ref}
 id="Cmen" 
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
     </div>
  );
});
export default ImageComponent;

