import { Grid, Button, Stack, IconButton } from "@mui/material";
import axios from "axios";
import { endpoint } from "../App";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Header from "./Header";
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";

export const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center" className="quntity-box">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box>Qty:</Box>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

export const getTotalCartValue = (items = []) => {
  if (!items.length) {
    return 0;
  }
  return items
    .map((item) => item.price * item.quantity)
    .reduce((total, n) => total + n);
};

const Cart = () => {
  const itemsExist = JSON.parse(localStorage.getItem("cartItems")) ?? [];
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(itemsExist);

  const getProducts = async () => {
    try {
      const response = await axios.get(`${endpoint}/catalogue.json`);
      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.message, { variant: "error" });
        return [];
      } else {
        enqueueSnackbar(
          "Couldn't fetch products. Check that the backend is running,reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const deleteItem = (cartItems, itemId) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const checkQuantity = (products, quantity, itemId) => {
    const addProduct = products.find((product) => product.id === itemId);
    return addProduct.quantity >= quantity ? true : false;
  };

  const updateQuantity = (items, products, itemId, quantity) => {
    if (quantity === 0) {
      deleteItem(items, itemId);
    } else {
      if (checkQuantity(products, quantity, itemId)) {
        const updatedItems = items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(updatedItems);
      } else {
        enqueueSnackbar("Quantity of selected item is not available", {
          variant: "error"
        });
        return false;
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (products.length === 0) {
      getProducts()
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [products]);

  return (
    <>
      <Header />
      <p className="shipping-cart-label">Shopping Cart</p>
      <div className="cart-section">
        {cartItems.length ? (
          cartItems.map((item) => (
            <Grid container key={item.id} className="cart-grid">
              <Grid item sm={3}>
                <img
                  component="img"
                  alt={item.name}
                  src={item.imageURL}
                  height="50px"
                />
              </Grid>
              <Grid item sm={3} className="cart-item-price">
                <span>{item.name}</span>
                <span>
                  {item.currency} {item.price}
                </span>{" "}
              </Grid>
              <Grid item sm={3}>
                <ItemQuantity
                  value={item.quantity}
                  handleDelete={() => {
                    updateQuantity(
                      cartItems,
                      products,
                      item.id,
                      item.quantity - 1
                    );
                  }}
                  handleAdd={() => {
                    updateQuantity(
                      cartItems,
                      products,
                      item.id,
                      item.quantity + 1
                    );
                  }}
                />
              </Grid>
              <Grid item sm={3}>
                <Button
                  variant="outlined"
                  className="btn"
                  onClick={() => deleteItem(cartItems, item.id)}
                >
                  Delete
                </Button>{" "}
              </Grid>
            </Grid>
          ))
        ) : (
          <p>No items. Please add item in cart.</p>
        )}
        {cartItems.length ? (
          <>
            <hr />
            <Box className="cart-total">
              <Box className="amount-label"> Total amount </Box>
              <Box className="amount">Rs {getTotalCartValue(cartItems)}</Box>
            </Box>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Cart;
