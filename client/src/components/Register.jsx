import React, {useState} from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import qs from 'qs';

export default function Register(){

    const [userData, setUserData] = useState({

        username: "",
        password: "",
        staffid: "",
        name: "",
        post: "",
        dept: ""

    });

    const [isRegistered, setRegister] = useState(false)

    function handleChange(event){

        const {name, value} = event.target;
        
        setUserData(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }; 
        });

        console.log(userData);
    }

    function handleRegister(event){

        event.preventDefault();

        const user = {
            username: userData.username,
            password: userData.password,
            staffid: userData.staffid,
            name: userData.name,
            post: userData.post,
            dept: userData.dept
        };

        const url = '/register';
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
                setRegister(true);
                console.log("Ready to redirect");
            }else{
                alert("未能成功註冊，請再嘗試");
            }
            
        })
    }

    return (
        <React.Fragment>

            <img src="https://www.hohcs.org.hk/App/Modules/Admin/Tpl/Static/upload/image/20170418/20170418125117_21846.png" className="icon-register"/>

                <Form onSubmit={handleRegister}>

                            <Form.Group className="inputGroup">
                                <Form.Label className="inputLabel">電郵:</Form.Label>
                                <InputGroup>
                                    <Form.Control placeholder="請輸入電郵" className="input" name="username" onChange={handleChange} value={userData.username}></Form.Control>
                                    <InputGroup.Append>
                                        <InputGroup.Text>@hohsc.org.hk</InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup> 
                            </Form.Group>


                            <Form.Group className="inputGroup">
                                <Form.Label className="inputLabel">密碼:</Form.Label>
                                <Form.Control placeholder="請輸入密碼" onChange={handleChange} name="password" value={userData.password} type="password" className="input"></Form.Control>
                            </Form.Group>



                            <Form.Group className="inputGroup">
                                <Form.Label className="inputLabel">姓名:</Form.Label>
                                <Form.Control placeholder="請輸入姓名" onChange={handleChange} name="name" value={userData.name} type="text" className="input"></Form.Control>
                            </Form.Group>


                            <Form.Group className="inputGroup">
                                <Form.Label className="inputLabel"> 單位:</Form.Label>
                                <Form.Control placeholder="請輸入單位" onChange={handleChange} name="dept" value={userData.dept} type="text" className="input"></Form.Control>
                            </Form.Group>

                            <Form.Group className="inputGroup">
                                <Form.Label className="inputLabel"> 職位:</Form.Label>
                                <Form.Control placeholder="請輸入職位" onChange={handleChange} name="post" value={userData.post} type="text" className="input"></Form.Control>
                            </Form.Group>


                            <Form.Group className="inputGroup">
                                <Form.Label className="inputLabel"> 職員編號:</Form.Label>
                                <Form.Control placeholder="請輸入職員編號" onChange={handleChange} name="staffid" value={userData.staffid} type="text" className="input"></Form.Control>
                            </Form.Group>

                        <Button variant="primary" size="lg" className="registerBtn" type="submit">註冊</Button>

                { isRegistered && <Redirect to="/" /> }
                </Form>

        </React.Fragment>
    );
}