import { Grid, TextField, Box, Card, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { endpoint } from "../App";
import "./Product.css";
import ProductCard from "./ProductCard";
import FilterCard from "./FilterCard";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Drawer, IconButton } from "@mui/material";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [items, setItims] = useState([]);
  const Deboucetime = 500;
  const defaultQuntiy = 1;
  const [selectedFilter, setSelectedFilter] = useState({
    color: [
      { id: "4bnm424242", value: "Red", checked: false },
      { id: "3bk235232n3", value: "Blue", checked: false },
      { id: "sdsgd4t33s", value: "Green", checked: false }
    ],
    gender: [
      { id: "352hjbh214", value: "Men", checked: false },
      { id: "3bk235232n3", value: "Women", checked: false }
    ],
    price: [
      { id: "78ndfjk24", value: "0-250", label: "0-Rs250", checked: false },
      {
        id: "mms4224991",
        value: "251-450",
        label: "Rs251-450",
        checked: false
      },
      { id: "xnjn2445ks", value: "450", label: "Rs 450-above", checked: false }
    ],
    type: [
      { id: "12487jkfn3fn", value: "Polo", checked: false },
      { id: "2434nkj352ff", value: "Hoodie", checked: false },
      { id: "i42i3bnnnfnf", value: "Basic", checked: false }
    ]
  });

  const getProducts = async () => {
    try {
      const response = await axios.get(`${endpoint}/catalogue.json`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Couldn't fetch products. Check that the backend is running,reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item.id === productId) !== -1;
  };

  const checkQuantity = (item, quantity) => {
    return item.quantity >= quantity ? true : false;
  };

  const handleAddToCart = (productId, products) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) ?? [];

    if (cartItems.length && isItemInCart(cartItems, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart to update quantity or remove item.",
        { variant: "warning" }
      );
      return false;
    }

    const addItem = products.find((product) => product.id === productId);

    if (checkQuantity(addItem, defaultQuntiy)) {
      addItem["quantity"] = defaultQuntiy;
      cartItems.push(addItem);
      setItims(cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      enqueueSnackbar("Item added successfully.", { variant: "success" });
    } else {
      enqueueSnackbar("Quantity of selected item is not available", {
        variant: "error"
      });
      return false;
    }
  };

  const handleCheckboxChange = (category, index) => {
    const updatedFilter = { ...selectedFilter };
    updatedFilter[category][index].checked = !updatedFilter[category][index]
      .checked;
    setSelectedFilter(updatedFilter);
    setIsFiltered(true);
  };

  const getFilteredProductsByCategory = (
    products,
    filteredProducts,
    type,
    categories
  ) => {
    if (filteredProducts.length === 0) {
      filteredProducts = products;
    }

    if (type === "price") {
      let ranges = [];
      categories.forEach((range) => {
        let priceRange = range.split("-");
        if (priceRange[0]) {
          ranges.push(parseInt(priceRange[0]));
        }
        if (priceRange[1]) {
          ranges.push(parseInt(priceRange[1]));
        } else {
          ranges.push(Number.MAX_VALUE);
        }
      });

      let minPrice = Math.min(...ranges);
      let maxPrice = Math.max(...ranges);

      return filteredProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    } else
      return filteredProducts.filter((product) =>
        categories.includes(product[type])
      );
  };

  const getFilteredProducts = (products, selectedFilter) => {
    if (isFiltered) {
      const checkedColors = selectedFilter.color
        .filter((filterValue) => filterValue.checked)
        .map((filterValue) => filterValue.value);
      const checkedGender = selectedFilter.gender
        .filter((filterValue) => filterValue.checked)
        .map((filterValue) => filterValue.value);
      const checkedPrice = selectedFilter.price
        .filter((filterValue) => filterValue.checked)
        .map((filterValue) => filterValue.value);
      const checkedType = selectedFilter.type
        .filter((filterValue) => filterValue.checked)
        .map((filterValue) => filterValue.value);

      let filteredProducts = [];
      if (
        checkedColors.length === 0 &&
        checkedGender.length === 0 &&
        checkedPrice.length === 0 &&
        checkedType.length === 0
      ) {
        filteredProducts = products;
      } else {
        if (checkedColors.length > 0) {
          filteredProducts = getFilteredProductsByCategory(
            products,
            filteredProducts,
            "color",
            checkedColors
          );
        }

        if (checkedGender.length > 0) {
          filteredProducts = getFilteredProductsByCategory(
            products,
            filteredProducts,
            "gender",
            checkedGender
          );
        }

        if (checkedPrice.length > 0) {
          filteredProducts = getFilteredProductsByCategory(
            products,
            filteredProducts,
            "price",
            checkedPrice
          );
        }

        if (checkedType.length > 0) {
          filteredProducts = getFilteredProductsByCategory(
            products,
            filteredProducts,
            "type",
            checkedType
          );
        }
      }

      setFilteredProducts(filteredProducts);
    }
  };

  const performSearch = (query, products) => {
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.color.toLowerCase().includes(query.toLowerCase()) ||
        product.type.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(async () => {
      await performSearch(value, products);
    }, Deboucetime);
    setDebounceTimeout(timeout);
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    if (isFiltered && products.length > 0) {
      getFilteredProducts(products, selectedFilter);
    } else if (products.length === 0) {
      getProducts();
    }
  }, [selectedFilter]);

  return (
    <>
      <Header />
      <Box className="search-filter-section">
        <Box className="search-section">
          <TextField
            className="search-textfield"
            size="medium"
            fullWidth
            placeholder="Search for Products..."
            name="search"
            variant="standard"
            onChange={(e) => debounceSearch(e, debounceTimeout)}
          />
          <Box className="search-icon">{<SearchOutlinedIcon />}</Box>
          <div className="mobile-filter" onClick={toggleDrawer}>
            <FilterAltOutlinedIcon />
          </div>
          <Drawer
            className="mobile-drawer"
            anchor="left"
            open={openDrawer}
            onClose={toggleDrawer}
          >
            <div className="close">
              <IconButton onClick={toggleDrawer}>
                <CloseOutlinedIcon className="close" />
              </IconButton>
            </div>
            <FilterCard
              Allfilter={selectedFilter}
              handleCheckboxChange={handleCheckboxChange}
            ></FilterCard>
          </Drawer>
        </Box>
      </Box>
      <Grid container>
        <Grid item md={3} className="filter-grid desktop-filter">
          <Card className="filter-card">
            <FilterCard
              Allfilter={selectedFilter}
              handleCheckboxChange={handleCheckboxChange}
            ></FilterCard>
          </Card>
        </Grid>
        <Grid item className="product-grid" md={9}>
          <Grid container className="product-section" spacing={5}>
            {filteredProducts.length ? (
              filteredProducts.map((product) => (
                <Grid item xs={12} sm={12} md={4} key={product.id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={handleAddToCart}
                    products={products}
                  />
                </Grid>
              ))
            ) : (
              <div className="loading">
                <CircularProgress /> Loading...
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Products;
