import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import headImage from '../images/head_image.png';
import '../css/App.css';
import CircleLogo from '../conponents/CircleLogo';
import LoginOutButton from './LogInOutButton';
import Circleitems from '../conponents/Circleitems';

function Circle_Page(){
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [responseData, setResponseData] = useState(null);
    //const handleResponse = () => {
      //  const raw_circle_detail = location.state?.circleDetail;
        //if (!raw_circle_detail) {
          //  console.log("LocalStorageにデータがありません。");
            //setResponse_data(null);
            //return;
        //}
        //const json_circle_detail = JSON.parse(raw_circle_detail);
        //const circle_detail = json_circle_detail.data;
        //localStorage.removeItem('circle_detail');
        //console.log("受信したデータ:", circle_detail);
        //setResponse_data(circle_detail);
    //};
    //useEffect(() => {
     //   handleResponse();
    //},[]);

    /*いったんコメントアウトしておいた
    useEffect(() => {
        // location.stateから、Home.jsxで渡した { circleDetail: data } の 'circleDetail' を取得
        const circleDetail = location.state?.circleDetail;
        
        if (circleDetail) {
            console.log("受信したデータ (state経由):", circleDetail);
            setResponseData(circleDetail);
        } else {
            console.log("サークル情報がステート経由で渡されませんでした。");
            setResponseData(null);
        }
    }, [location.state]);
    */

    async function get_circle_data(id){
        try{
            const response = await fetch(
                "http://localhost:5001/Circle_Page",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({"circle_id": id})
                }
            )
            if(response.ok){
                const response_obj = await response.json();
                setResponseData(response_obj);
            }else{
                setResponseData(null);
            }
        }catch{
            setResponseData(null);
        }
    }
    console.log(id + " " + typeof(id));
    useEffect(
        () => {
            get_circle_data(id);
            setLoading(false);
        },[]
    )

    if(loading){
        return(
            <div>
                loading
            </div>
        )
    }else{
    return (
    <div>
        <header className="page-header">
            {/* <h1>
                <Link to="/">
                    <img className="logo" src={headImage} alt="アイコン" />
                </Link>
            </h1> */}
            <CircleLogo></CircleLogo>
            <h3>
                <LoginOutButton />
            </h3>
        </header>
        <main>
            <h1>サークルページ</h1>
            <div>
                {responseData === null ? (
                    <p>サークル情報を読み込み中です...</p>
                ) : responseData && typeof responseData === "object" ? (
                <div>
                    <img src={responseData.circle_icon} alt="サークルアイコン" className="circle_icon_page" />
                    {/* <p>サークル名：{response_data.circle_name}</p>
                    <p>サークル説明：{response_data.circle_description}</p>
                    <p>費用：{response_data.circle_fee}円</p>
                    <p>男性：{response_data.number_of_male},女性：{response_data.number_of_female}</p> */}
                    
                    <div className="descon">
  <div className="row">
    <div className="kou">サークル名</div>
    <div className="data">{responseData.circle_name}</div>
  </div>

  <div className="row">
    <div className="kou">サークル説明</div>
    <div className="data">{responseData.circle_description}</div>
  </div>

  <div className="row">
    <div className="kou">費用</div>
    <div className="data">{responseData.circle_fee}円</div>
  </div>

  <div className="row">
    <div className="kou">男性</div>
    <div className="data">{responseData.number_of_male}</div>
  </div>

  <div className="row">
    <div className="kou">女性</div>
    <div className="data">{responseData.number_of_female}</div>
  </div>
</div>
                        {/* <div className='descon'>
                            <ul className='kou'>
                            <li>サークル名</li>
                             <li>サークル説明</li>
                            <li>費用</li>
                             <li>男性</li>
                             <li>女性</li>
                            </ul>
               
                            <ul className='data'>
                           <li>{response_data.circle_name}</li>
                            <li>{response_data.circle_description}</li>
                         <li>{response_data.circle_fee}円</li>
 <li>{response_data.number_of_male}</li>
 <li>{response_data.number_of_female}</li>
                        </ul>
                        </div> */}
                    <div>
                        {/* {Array.isArray(responseData.tags) && responseData.tags.length > 0 ? ( */}
                         {/* {Array.isArray(items) && items.length > 0 ? ( */}
                            {/* <p>キーワード: {responseData.tags.join(', ')}</p> */}
                        {/* ) : (
                        <p>キーワード: なし</p>
                        )} */}
                        <Circleitems items={responseData.tags}></Circleitems>
                    </div>
                </div>
                ) : (
                <p>サークル情報が読み込めませんでした</p>
                )}
            </div>
            <h3>
            
                <Link to="/" className='link'>
                    ホーム画面に戻る
                </Link>
            </h3>
        </main>
    </div>
    )
}
}
export default Circle_Page;