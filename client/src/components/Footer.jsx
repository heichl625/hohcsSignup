import React from "react";
import {Link} from "react-router-dom";

function Footer(props){

    return <footer>
        {localStorage.getItem('role') === 'admin' && <Link to="/admin" className="adminLink">管理員模式</Link> }
    </footer>;
}

export default Footer; 