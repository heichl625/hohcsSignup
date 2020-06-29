import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import qs from 'qs';

function Login() {

    const [email, setEmail] = useState("");

    const [redirect, setRedirect] = useState(false);

    const [reLogin, setRelogin] = useState(false);

    function handleChange(event){

        const {value} = event.target;

        setEmail(value);

    }

    function handleSubmit(event){

        event.preventDefault();

        const url = '/login';
        const options = {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: qs.stringify({
                email: email
            })
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
                console.log("login");
                localStorage.setItem('email', res.email);
                localStorage.setItem('role', res.role);
                setRedirect(true);
            }else{
                setRelogin(true);
            }
        })
        
    }

    if(redirect){
        return <Redirect to="/" />
    }

    if(reLogin){
        
    }

    return(
        <React.Fragment>
        <img src="https://www.hohcs.org.hk/App/Modules/Admin/Tpl/Static/upload/image/20170418/20170418125117_21846.png" className="icon"/>

        <p className="subtitle">靈實培訓課程報名系統</p>

        { reLogin && <p className="loginError">登入電郵錯誤，請重新輸入</p> }
    
    {/* onSubmit={handleSubmit} */}
        <Form onSubmit={handleSubmit} className="formInput">
            
                    <InputGroup className="loginInput">
                        <Form.Control placeholder="電郵" className="input" name="username" onChange={handleChange} value={email}></Form.Control>
                        <InputGroup.Append>
                            <InputGroup.Text className="emailText">@hohsc.org.hk</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup> 
            
            {/* onClick={handleLogin} */}
                <Button variant="primary" size="lg" className="loginBtn" type="submit">登入</Button>
                
                
                
        </Form>

        </React.Fragment>
    );

}

export default Login;