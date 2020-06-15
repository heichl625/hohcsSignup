import React from "react";

function Input(props){
    return <div className="inputField">
        <div><label>{props.fieldName}:</label></div>
        <div><input type="text"/></div>  
    </div>;
}

export default Input;