import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = () => {
    const history =  new useHistory();
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    //console.log(cartItems);
    const cartItemsCount = cartItems ? cartItems.length : 0;
    return (
      <Box className="header">
        <Box className="header-title">
            <h2>TeeRex Store</h2>
        </Box>
        <Box className="header-section">   
            <h4 className='product-heading' onClick={()=>history.push('/')}>Products</h4>
            <Box className="header-icon" onClick={()=>history.push('/cart')}>
                {<ShoppingCartTwoToneIcon variant="outlined" 
                sx={{ fontSize: '3rem'}} 
                />}
                {cartItemsCount > 0 && (
                    <span className="cart-count">{cartItemsCount}</span>
                )}
            </Box>
        </Box>
      </Box>
    );
};

export default Header;