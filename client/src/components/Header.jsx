import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Redirect } from "react-router-dom";

function Header(){

    const [isLoggedOut, setLoggedOut] = useState("false");

    console.log("render");


    function handleLogout(){

        const url = '/logout';
        const options = {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
        };

        fetch(url, options)
        .then(res => {
            if(res.status === 200){
                console.log("Logout now");
                alert("登出成功");
                localStorage.clear();
                setLoggedOut("true");
            }else{
                return "error";
            }
            
        }).catch(err => {
            console.log("Login: " + err);
        });

    }

    return (

    <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="/">靈實員工培訓課程報名系統</Navbar.Brand>
        <Nav className="mr-auto">
            <Nav.Link href="/register-record">報名記錄</Nav.Link>
        </Nav>
        <Button variant="outline-light" onClick={handleLogout}>登出</Button>

        { isLoggedOut === "true" && <Redirect to="/login" /> }
    </Navbar>
    
    );

}

export default Header;

