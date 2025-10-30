import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../css/App.css';
import headImage from '../images/head_image.png';
import Toggle from './Toggle.jsx';


function Home() {
  const navigate = useNavigate();
  //初期値となる全サークルデータと絞り込み結果の表示
  const [all_circles, setAll_circles] = useState(null);
    //バックエンドからの応答ステート（絞り込み結果を受け取る）
  const [response_data, setResponse_data] = useState(null);
  const handleResponse = (data) => {
    console.log("絞り込み結果:", data);
    setResponse_data(data);
  };

  const catch_all_circles = async () => {
    try {
      const initial_response = await fetch("http://localhost:5001/homestart___", {
        method: "POST",
        headers: {'Content-Type': 'application/json',
      },
    });
    if(initial_response.ok){
      const data = await initial_response.json();
      console.log("初期値として受け取った全サークル情報:", data);
      setAll_circles(data);
      setResponse_data(data);
    };


    }catch(error){
      console.error("エラーが発生しました", error);

    }
  }
  useEffect(() => {
    catch_all_circles();
  }, []);

  //サークルの項目をクリックしたときに行う処理
  const to_circle_page = (circle_id) => {
    const json_circle_id = JSON.stringify({circle_id: circle_id})
    console.log("取得したいサークルのid:", json_circle_id)
    send_Id(json_circle_id);
    return;
  };

  const send_Id = async (json_circle_id) => {
    try{
      const response = await fetch("http://localhost:5001/Circle_Page",{
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: json_circle_id,
      });
      console
      navigate('/Circle_Page');
    }catch{
      console.error("サークルページへの遷移に失敗しました")
      alert("サークルページへの遷移に失敗しました");
    }
  }

  return (
    <div>
      <header className="page-header">
        <h1>
          <Link to="/">
            <img className="logo" src={headImage} alt="アイコン" />
          </Link>
        </h1>
        <h3>
          <Link to="Login" className="login">
            ログイン
          </Link>
        </h3>
      </header>

      <main>
        <h1>東京理科大学サークル情報サイト</h1>
        <p>ここでは東京理科大学のサークル情報を掲載しています。</p>
        <h2>サークル一覧</h2>
        <Toggle receivedData_fb={handleResponse} />
        <div>
          {response_data ? (
            <>
              {response_data.map((circle, index) => (
                <div key={index} className="circle-info" onClick={() => to_circle_page(circle.circle_id)} style={{cursor: 'pointer'}}>
                  <img src={circle.circle_icon_path} className="circle_icon"/>
                  <p>サークル名: {circle.circle_name}</p>
                  <p>分野：{circle.tag_name}</p>
                </div>
              ))}
              <br />
            </>
          ) : (<p>サークル情報の取得に失敗しました</p>)}
        </div>
      </main>
      <footer>
        <p>created by 東京理科大学IS科3年</p>
        <a href="https://www.tus.ac.jp/" target="_blank">
          東京理科大学ホームページ
        </a>
      </footer>
    </div>
  );
}

export default Home;
