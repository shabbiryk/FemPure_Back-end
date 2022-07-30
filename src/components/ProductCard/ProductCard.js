import React, { useState, useEffect } from "react";
import './ProductCard.css'
import PropsTypes from "prop-types";

function ProductCard(props) {

    const id = props.id

     const [qty, setQty] = useState(0)
     
    const cartFromCookie = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const [cartItems, setCartItems] = useState(cartFromCookie);
    const [inCart, setInCart] = useState(false);

    useEffect(()=>{
        localStorage.setItem('cartItems',JSON.stringify(cartItems))
        checkInCart()
    },[cartItems])
    

    function addToCart(id){
        setCartItems([...cartItems, {
            id:id,
            qty:1
        }])
    }

    function addOne(id){
        let findOne = cartItems.find(x => {
            if (x.id==id)
                return x
        })
        findOne.qty += 1
        setCartItems([...cartItems])
    }
    function removeOne(id){
        let findOne = cartItems.find(x => {
            if (x.id==id)
                return x
        })
        findOne.qty -= 1
        if (findOne.qty==0){
            setInCart(false)
            const newCart = cartItems.filter((item) => item.id !== findOne.id);

            setCartItems( newCart);
        }
        else{
            setCartItems([...cartItems])
        }
    }

    function checkInCart(){
        let findOne = cartItems.find(x => {
            if (x.id==id)
                return x
        })
        if (findOne)
            setInCart(true)
        else
            setInCart(false)

    }


    function getQty(id){
        let findOne = cartItems.find(x => x.id==id)
        if(findOne)
        return findOne.qty
        else
        return 0
    }
    useEffect(()=>{
        console.log("here")
        setQty(getQty(id))
    }, [cartItems])

    return (
        <div className="card">
            <img style={{align:"center"}} width={200} height={180}/>
            <h1>ProductName</h1>
            <p className="price">85.32</p>
            
            {!inCart?
                <button onClick={()=>addToCart(id)}>Add To Cart</button> 
            : 
            <div className="card__qty">
                <button onClick={()=>addOne(id)}>+1</button>{ qty}
                <button onClick={()=>removeOne(id)} disabled={qty==0?true:false}>-1</button>
            </div>
            }
        </div>
    )
}


ProductCard.propsTypes = {
    id: PropsTypes.string
};

ProductCard.defaultProps = {
    id: ""
};


export default ProductCard;
