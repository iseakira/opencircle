import { useContext, useState } from 'react';
import { AuthContext } from '../AuthStatus';
import { Link } from 'react-router-dom';

function LoginOutButton(){
    const { getLogin, setLogin, setLogout } = useContext(AuthContext);

    console.log("Button");
    console.log(getLogin());
    if(!getLogin()){
        return (
            <Link to="Login" className="login">
                ログイン
            </Link>
        );
    }else{
        return (
            <div>
                ログアウト
            </div>
        )
    }
}

export default LoginOutButton;