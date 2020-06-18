import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function Navigatior(){
    return (
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="/admin">課程報名系統</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/createcourse">新增課程</Nav.Link>
            <Nav.Link href="/history">以往課程</Nav.Link>
            <Nav.Link href="/admin">今天課程</Nav.Link>
            <Nav.Link href="/future">未來課程</Nav.Link>
            <Nav.Link href="/authorized-list">授權名單</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/">返回報名表格</Nav.Link>
          </Nav>
        </Navbar>
    );
}
