import { Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import { useState } from 'react';
import headImage from '../images/head_image.png';

function Make_Account() {
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const navigate = useNavigate();
    //imput_email.jsxで入力されたメールアドレスを取得
    const email_tmp_id = localStorage.getItem('to_Make_Account');
    const [formData, setFormData] = useState({ 
        emailaddress: email_tmp_id.emailaddress,
        password: '',
        auth_code: '',
        user_name: '',
        tmp_id: tmp_id
    });
    const [result, setResult] = useState(null);
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const handleCreateAccount = async (e) => {
        e.preventDefault();

        const password = formData.password;
        const user_name = formData.user_name;
        const auth_code = formData.auth_code;

        if(password !== passwordConfirm){
            alert("パスワードが一致しません");
            return;
        }
        const dataToSend = {
            emailaddress: emailaddress,
            password: password,
            auth_code: auth_code,
            user_name: user_name,
        };
        try {
            const response = await fetch("http://localhost:5001/create_account",{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend),})
                if(response.ok){
                    const data = await response.json();
                    setResult(data);
                    console.log("受信したデータ：",data);
                    if(data.message == success){
                        localStorage.removeItem('emailaddress');
                        alert("アカウントを作成しました!3秒後にホーム画面に遷移します!");
                        setTimeout(() =>{
                            navigate('/');
                        },3000);
                        
                    }
                }else{
                    alert(`アカウント作成に失敗しました：${response.status}`);
                }

            
        }catch(error){
                console.error("通信に失敗",error);
                alert("通信に失敗しました");
        }
    
    };
    return (
    <div>
        <header className="page-header">
            <h1>
                <Link to="/">
                <img className="logo" src={headImage} alt="アイコン" />
                </Link>
            </h1>
        </header>
        <h1>東京理科大学サークル情報サイト</h1>
        <main>
            <h3>パスワードとメールアドレスに送信された認証コードとユーザー名を入力してください</h3>
            <form onSubmit={handleCreateAccount}>
                <div>
                <label>パスワード：</label>
                    <input type="password" name="password" value={formData.password} placeholder="パスワード" required onChange={handleChange} />
                    <br />
                    <input type="password" name="passwordConfirm" value={passwordConfirm} placeholder="パスワード確認用" required onChange={(e) => setPasswordConfirm(e.target.value)} />
                </div>
                    <br />
                <label>認証コード：</label>
                    <input type="text" name="auth_code" value={formData.auth_code} required onChange={handleChange}/>
                    <br />
                <label>ユーザー名：</label>
                    <input type="text" name="user_name" value={formData.user_name} required onChange={handleChange}/>
                    <br />
                <button type="submit" >アカウントを作成する</button>
            </form>
            <br />
            <div>
                {result ? (
                    <>
                    {result.map((item, index) => (
                        <div key={index}>
                            <p>{item.message}</p>
                        </div>
                    ))}
                    </>
                    ):(<br />
                    )
                }
                </div>
        </main>
        <footer>
            <p>created by 東京理科大学IS科3年</p>
            <a href="https://www.tus.ac.jp/" target="_blank">
                東京理科大学ホームページ
            </a>
        </footer>
    </div>
    )
};

export default Make_Account;