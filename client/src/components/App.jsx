import React, {useEffect} from "react";
import ApplicationForm from "./ApplicationForm";
import Register from "./Register";
import { ProtectedRoute } from "./protected-route";
import { AdminRoute } from "./admin-route";
import Login from "./Login";
import Admin from "./Adminastrative/Admin";
import RegisterRecord from "./RegisterRecord";
import axios from 'axios';

import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import AuthorizedList from "./Adminastrative/AuthorizedList";


export default function App(props) {

    

    useEffect(() => {
        axios.get("/isAuthenticated",  
        { headers:
            { 
                "Content-Type" : "Application/json",
                'Accept': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        .then(res => {
            localStorage.setItem("isAuthorized", true);
        }).catch(function (error) {
            localStorage.removeItem("isAuthorized");
        });
    })

    
    return(
    <Router>
        <Switch>
            <Route component={Login} exact path="/login" />
            <ProtectedRoute component={ApplicationForm} exact path="/" />
            <AdminRoute component={Admin} exact path="/admin" />
            <Route component={Register} exact path="/register"/>
            <Route component={RegisterRecord} exact path="/register-record"/>
        </Switch>
    </Router> 
    );
}
