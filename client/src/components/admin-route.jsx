import React from "react";
import { Route, Redirect } from "react-router-dom";

export const AdminRoute = ({component: Component, ...rest}) => {

    return (
        <Route {...rest} render={
            (props) => {
                if(localStorage.getItem('role') === 'admin'){
                    return <Component {...props}/>;
                }else{
                    return <Redirect to="/" />;
                }
            }
        }>

        </Route>
    );
}