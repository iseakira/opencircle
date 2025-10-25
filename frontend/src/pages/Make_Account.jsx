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
    const emailadress = localStorage.getItem('emailadress');
    const [formData, setFormData] = useState({ 
        email: emailadress,
        password: '',
        user_name: '',
    });
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [sendAuthcode, setSendAuthcode] = useState(null);
    const handleCreateAccount = async (e) => {
        e.preventDefault();

        const password = e.target.password.value;
        const user_name = e.target.user_name.value;
        const inputAuthCode =e.target.inputAuthCode.value;

        const dataToSend = {
            email: emailadress,
            password: password,
            user_name: user_name,
        };
        try {
            if(password == passwordConfirm && sendAuthcode == inputAuthCode){
                const response = await fetch("http://localhost:5001/create_account",{
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(dataToSend),})
                if(response.ok){
                    navigate('/');
                }else{
                    alert("アカウント作成に失敗しました：${response.status}");
                }
            }else{
                alert("パスワードまたは認証コードが間違っています");
                return;
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
                    <input type="text" name="inputAuthCode" required />
                    <br />
                <label>ユーザー名：</label>
                    <input type="text" name="user_name" value={formData.user_name} required onChange={handleChange}/>
                    <br />
                <button type="submit" >アカウントを作成する</button>
            </form>
            <br />
        </main>
        <footer>
            <p>created by 東京理科大学IS科3年</p>
            <a href="https://www.tus.ac.jp/" target="_blank">
                東京理科大学ホームページ
            </a>
        </footer>
    </div>
    )
    ;
};

export default Make_Account;