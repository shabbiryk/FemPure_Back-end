import React, { useState, useEffect } from "react";
import "./Cart.css"
function Cart ()  {

    const cartFromCookie = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const [cartItems, setCartItems] = useState(cartFromCookie);

    return (<>
    {/* content */}
    <div style={{display: "flex", flexDirection:"column", flexFlow:"wrap"}}>
        {cartItems.map(item=>{
            return (
                <>
                   <div className="card__horizontal">
  <img src="https://picsum.photos/200" alt="Denim Jeans" />
  <div>
  <h1>Tailored Jeans</h1>
  <p class="price">$19.99</p>
  <p>Quantity</p>
  </div>
  
</div>
                </>
            )
        })}
    </div>
    </>)
}
export default Cart;
