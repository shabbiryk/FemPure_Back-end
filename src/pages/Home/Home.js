import React, { useState, useEffect } from "react";
import NavBar from '../../components/NavBar/NavBar'
import ProductCard from "../../components/ProductCard/ProductCard";
function Home ()  {

    const [cartItems, setCartItems] = useState([]);

    useEffect(()=>{
    if (localStorage.getItem('cartItems')){
        let jsonCart = JSON.parse(localStorage.getItem('cartItems'))
        setCartItems(jsonCart)
    }
    else
    setCartItems([])

    },[])

    function addToCart(id){

        console.log("hi")

        // if(cartItems.length===0){
        //      setCartItems([...cartItems, JSON.stringify({
        //     "id":id,
        //     "qty":1
        // })])
        // }

        let t_arr = cartItems
        t_arr = t_arr.map((item) => {
          return item.id === id
            ? { ...item, qty: item.qty + 1 }
            : item;
        });
        
        setCartItems(t_arr)
        
        
       
        localStorage.setItem('cartItems',cartItems)
    }
    return (<>
    {/* content */}
    <div style={{display: "flex", flexDirection:"row", flexFlow:"wrap"}}>
        <ProductCard id="1" addToCart={addToCart} inCart={true}/>
        <ProductCard id="2" addToCart={addToCart} inCart={false}/>
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
    </div>
    </>)
}
export default Home;
