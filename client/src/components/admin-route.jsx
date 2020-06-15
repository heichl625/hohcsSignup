import React from "react";
import { Route, Redirect } from "react-router-dom";

export const AdminRoute = ({component: Component, ...rest}) => {

    return (
        <Route {...rest} render={
            (props) => {
                if(localStorage.getItem('isAdmin')){
                    console.log("isAdmin? " + localStorage.getItem('isAdmin'))
                    return <Component {...props}/>;
                }else{
                    return <Redirect to="/" />;
                }
            }
        }>

        </Route>
    );
}