import React, { useState, useEffect } from "react";
import NavBar from '../../components/NavBar/NavBar'
import ProductCard from "../../components/ProductCard/ProductCard";
function Home ()  {


    return (<>
    {/* content */}
    <div style={{display: "flex", flexDirection:"row", flexFlow:"wrap"}}>
        <ProductCard 
            id="1" 
        />
        <ProductCard 
            id="2" 
        />
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
