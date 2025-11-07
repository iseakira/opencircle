import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import headImage from '../images/head_image.png';
import '../css/App.css';

function Circle_Page(){

    const [response_data, setResponse_data] = useState(null);
    const handleResponse = () => {
        const raw_circle_detail = localStorage.getItem('circle_detail');
        if (!raw_circle_detail) {
            console.log("LocalStorageにデータがありません。");
            setResponse_data(null);
            return;
        }
        const json_circle_detail = JSON.parse(raw_circle_detail);
        const circle_detail = json_circle_detail.data;
        //localStorage.removeItem('circle_detail');
        console.log("受信したデータ:", circle_detail);
        setResponse_data(circle_detail);
    };
    useEffect(() => {
        handleResponse();
    },[]);

    return (
    <div>
        <header className="page-header">
            <h1>
                <Link to="/">
                    <img className="logo" src={headImage} alt="アイコン" />
                </Link>
            </h1>
        </header>

        <main>
            <h1>サークルページ</h1>
            <div>
                {response_data === null ? (
                    <p>サークル情報を読み込み中です...</p>
                ) : response_data && typeof response_data === "object" ? (
                <div>
                    <img src={response_data.circle_icon_path} alt="サークルアイコン" className="circle_icon_page" />
                    <p>サークル名：{response_data.circle_name}</p>
                    <p>サークル説明：{response_data.circle_description}</p>
                    <p>費用：{response_data.circle_fee}円</p>
                    <p>男性：{response_data.number_of_male},女性：{response_data.number_of_female}</p>
                    
                    <div>
                        {response_data.tags && response_data.tags.map((tag,index) =>(
                            <div key={index} >
                                <p>キーワード：{tag}</p>
                            </div>))
                        }
                    </div>
                </div>
                ) : (
                <p>サークル情報が読み込めませんでした</p>
                )}
            </div>
            <h3>
                <Link to="/">
                    ホーム画面に戻る
                </Link>
            </h3>
        </main>
    </div>
    )
}
export default Circle_Page;