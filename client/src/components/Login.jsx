import React, { useState } from "react";
import auth from "./Auth";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Link, Redirect } from 'react-router-dom';
import qs from 'qs';

function Login() {

    const [userData, setUserData] = useState({

        username: "",
        password: ""

    });

    const [redirect, setRedirect] = useState({
        to: "",
        isDirected: null
    });

    const [reLogin, setRelogin] = useState(false);

    if(localStorage.getItem('isAuthorized')){
        return <Redirect to="/" />;
    }


    function handleChange(event){

        const {name, value} = event.target;

        setUserData(prevValue => {
            return {
                ...prevValue,
                [name]: value
            };
        });

    }

    function handleSubmit(event){

        const user = {
            "username": userData.username,
            "password": userData.password
        }

        event.preventDefault();

        const url = '/login';
        const options = {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: qs.stringify(user)
        };

        fetch(url, options)
        .then(res => {
            if(res.status === 200){
                return res.json();
            }else{
                return "error";
            }
            
        })
        .then(res => {

            if(res !== "error"){
                localStorage.setItem('userToken', res.token);
                localStorage.setItem('isAuthorized', true);
                localStorage.setItem('username', res.user.username);
                setRedirect({
                    to: "/",
                    isDirected: true
                });
            }else{
                setRelogin(true);
                setUserData({
                    username: "",
                    password: ""
                })
            }
            
        }).catch(err => {
            console.log("Login: " + err);
        });
    }

    return(
        <React.Fragment>
        <img src="https://www.hohcs.org.hk/App/Modules/Admin/Tpl/Static/upload/image/20170418/20170418125117_21846.png" className="icon"/>

    { reLogin && <p className="loginError">登入電郵或密碼錯誤，請重新輸入</p> }
    
    {/* onSubmit={handleSubmit} */}
        <Form onSubmit={handleSubmit} className="formInput">
            
                    <InputGroup className="loginInput">
                        <Form.Control placeholder="電郵" className="input" name="username" onChange={handleChange} value={userData.username}></Form.Control>
                        <InputGroup.Append>
                            <InputGroup.Text className="emailText">@hohsc.org.hk</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup> 
       
         
                    <Form.Group className="loginInput">
                        <Form.Control placeholder="密碼" onChange={handleChange} name="password" value={userData.password} type="password"></Form.Control>
                    </Form.Group>
            
            {/* onClick={handleLogin} */}
                <Button variant="primary" size="lg" className="loginBtn" type="submit">登入</Button>
                <p className="remindText">如未曾註冊，請先註冊。</p>

                
                <Link to="/register">
                    <Button variant="secondary" size="lg" className="registerBtn">註冊</Button>
                </Link>
                
                
                
        </Form>
        {redirect.isDirected && <Redirect to={redirect.to} /> }

        </React.Fragment>
    );

}

export default Login;