import {
    Button,
    Card,
    CardMedia,
    Typography,
    Grid
  } from "@mui/material";

const ProductCard = ({product,handleAddToCart,products})=>{
    return (
        <Card className="card">
          <Typography className="product-name" fontWeight="900">{product.name}</Typography>
          <CardMedia component="img" alt={product.name} src={product.imageURL} height="223px"/>
          <Grid container className="card-footer">
            <Grid item xs={6}>
              <Typography padding="0.5rem" fontWeight="700">
                {product.currency} {product.price}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                className="card-button"
                fullWidth
                variant="contained"
                onClick={()=>handleAddToCart(product.id,products)}
              >
                Add to Cart
              </Button>
            </Grid>
          </Grid>
        </Card>
      );
}

export default ProductCard;