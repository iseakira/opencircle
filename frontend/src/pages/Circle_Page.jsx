import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import headImage from '../images/head_image.png';


function Circle_Page(){

    const [response_data, setResponse_data] = useState('');
    const handleResponse = (data) => {
        console.log("受信したデータ:", data);
        setResponse_data(data);
    };
    return 
    <div>
        <header className="page-header">
            <Link to="/">
                <img className="logo" src={headImage} alt="アイコン" />
            </Link>
        </header>
        <main>
            <h1>サークルページ</h1>
            <div>
                {response_data ? (
                    <>
                    {response_data.map((circle, index) => (
                        <div key={index} className="circle-info">
                            <img src={circle.circle_icon_path} className="circle_icon"/>
                            <p>サークル名: {circle.circle_name}</p>
                            <p>分野：{circle.tag_name}</p>
                        </div>
                    ))}
                    <br />
                    </>
                ) : (<br/>)}
            </div>
        </main>
    </div>

}