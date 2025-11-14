import React,{useCallback} from 'react';
import PageTitle from './PageTitle.png';
import headImage from '../images/head_image.png';
import { Link } from 'react-router-dom';
import '../css/App.css';

export default function CircleLogo() {
        const reloadPage = useCallback(()=>{
            window.location.reload();
        },[]);
  return (
    <div>
      {/* <header> */}
      <h1>
       <Link to="/">
            {/* <img src={headImage} alt="アイコン" /> */}
            <img className="logo" src={headImage} alt="アイコン" />
          </Link>
      {/* <h1 onClick={reloadPage}>サークルついた</h1> */}
     <img src={PageTitle} alt="あれ？" onClick={reloadPage}
     style={{
      maxWidth:"500px",
      width:"100%",
     }}
     />
     {/* <h1>東京理科大学サークル情報サイト</h1> */}
   </h1>
   {/* </header> */}
    </div>
  )
}
