import React from "react";
function Card(props){
    return(
        <div>
        <h1>{props.name}</h1>
        <h2>price:{props.price}</h2>
        <p>{props.dis}</p>
        </div>
    )
}
export default Card;