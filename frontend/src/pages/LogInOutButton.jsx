import { useContext, useState } from 'react';
import { AuthContext } from '../AppContext';
import { Link } from 'react-router-dom';

function LoginOutButton(){
    const { getLogin, setLogin, setLogout } = useContext(AuthContext);

    async function logout(){
        try{
            const response = await fetch(
                "http://localhost:5001/api/logout",
                {method: "POST", headers: {'Content-Type': 'application/json'}, credentials: "include"}
            )
            const result = await response.json()
            console.log(result.message)
            if(response.ok){
                console.log("success")
                setLogout()
            }else{
                console.log("failure")
            }
        }catch (error){
            console.log(error)
        }
    }

    console.log("Button");
    console.log(getLogin());
    if(!getLogin()){
        return (
            <Link to="/login" className="login">
                ログイン
            </Link>
        );
    }else{
        return (
            <>
                <Link to="/Mypage" className="mypage_button">
                    マイページ
                </Link>
                <button
                  className="login"
                  onClick={() => logout()}
                >
                  ログアウト
                </button>
            </>
        )
    }
}

export default LoginOutButton;