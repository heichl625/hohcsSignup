import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Redirect } from "react-router-dom";

function Header(){

    const [isLoggedOut, setLoggedOut] = useState("false");

    console.log("rendering header");


    function handleLogout(){

      
        console.log("Logout now");
        alert("登出成功");
        localStorage.clear();
        setLoggedOut("true");
           
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

