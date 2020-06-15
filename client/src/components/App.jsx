import React, {useEffect} from "react";
import ApplicationForm from "./ApplicationForm";
import Register from "./Register";
import { ProtectedRoute } from "./protected-route";
import { AdminRoute } from "./admin-route";
import Login from "./Login";
import Admin from "./Adminastrative/Admin";
import CreateCourse from "./Adminastrative/CreateCourse";
import History from "./Adminastrative/History";
import Future from "./Adminastrative/Future";
import RegisterRecord from "./RegisterRecord";
import axios from 'axios';

import { BrowserRouter as Router, Route, Switch} from "react-router-dom";


export default function App(props) {

    

    useEffect(() => {
        console.log("App");
        axios.get("/isAuthenticated",  
        { headers:
            { 
                "Content-Type" : "Application/json",
                'Accept': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        .then(res => {
            console.log("Authorizing");
            localStorage.setItem("isAuthorized", true);
        }).catch(function (error) {
            console.log(error);
            localStorage.removeItem("isAuthorized");
        });
    })

    
    return(
    <Router>
        <Switch>
            <Route component={Login} exact path="/login" />
            <ProtectedRoute component={ApplicationForm} exact path="/" />
            <AdminRoute component={Admin} exact path="/admin" />
            <AdminRoute component={CreateCourse} exact path="/createcourse" />
            <AdminRoute component={History} exact path="/history" />
            <AdminRoute component={Future} exact path="/future" />
            <Route component={Register} exact path="/register"/>
            <Route component={RegisterRecord} exact path="/register-record"/>
        </Switch>
    </Router> 
    );
}
