import React, { useState, useEffect } from "react";
import './ProductCard.css'
import PropsTypes from "prop-types";

function ProductCard(props) {


    
    return (
        <div className="card">
            <img style={{align:"center"}} width={200} height={180}/>
            <h1>ProductName</h1>
            <p className="price">85.32</p>
            
            {!props.inCart?
                <button onClick={()=>props.addToCart(props.id)}>Add To Cart</button> : <div className="card__qty">
                <button>+1</button> 1
                <button>-1</button>
                </div>
            }
            {/* {props.inCart && 
            // +1 -1 
                <button onClick={()=>props.addToCart(props.id)}>Add To Cart</button>
            } */}
        </div>
    )
}


ProductCard.propsTypes = {
    product_id: PropsTypes.string,
    addToCart: PropsTypes.func,
    product_name: PropsTypes.string,
    inCart: PropsTypes.bool,
};

ProductCard.defaultProps = {
    product_id: "",
    addToCart: () => {
        return;
    },
    product_name: "",
    inCart: true
};


export default ProductCard;
