import React,{useCallback} from 'react';

export default function CircleLogo() {
        const reloadPage = useCallback(()=>{
            window.location.reload();
        },[]);
  return (
    <div>
      {/* <h1 onClick={reloadPage}>サークルついた</h1> */}
     <img src="../Addlogo.png" alt="" onClick={reloadPage}/>
    </div>
  )
}

