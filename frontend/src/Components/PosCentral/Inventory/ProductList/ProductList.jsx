import { Box, Typography, CircularProgress } from "@mui/material"
import ProductItem from "./ProductItem"

const ProductList = ({ loading, filteredProducts }) => {
  return (
    <Box
      sx={{
        borderRadius: "8px",
        overflow: "auto", // Make only this section scrollable
        height: "100%",
        p: { xs: 0.5, md: 1 },
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <CircularProgress sx={{ color: "#e65100" }} />
        </Box>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <Box sx={{ bgcolor: "#2a2a2a", p: { xs: 2, md: 4 }, textAlign: "center", color: "white" }}>
              <Typography variant="h6">No products match your filter criteria</Typography>
            </Box>
          ) : (
            filteredProducts.map((product) => <ProductItem key={product._id} product={product} />)
          )}
        </>
      )}
    </Box>
  )
}

export default ProductList

