import { Box, Typography } from "@mui/material"

const ProductItem = ({ product }) => {
  // Function to get status color
  const getStatusColor = (stock) => {
    return stock > 0 ? "green" : "orange"
  }

  // Function to determine status text
  const getStatusText = (stock) => {
    return stock > 0 ? "In Stock" : "Out of Stock"
  }

  return (
    <Box
      sx={{
        bgcolor: "#2a2a2a",
        mb: 1,
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          {product.name}
        </Typography>
        <Typography sx={{ color: "gray", fontSize: "0.875rem" }}>
          Stocked Product: <span style={{ color: "#e65100" }}>{product.stock} In Stock</span>
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: { xs: 1, md: 2 },
          alignItems: "flex-start",
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "space-between", sm: "flex-end" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: { xs: "45%", sm: "auto" },
          }}
        >
          <Typography sx={{ color: "gray", fontSize: "0.875rem" }}>Status</Typography>
          <Typography
            sx={{
              color: getStatusColor(product.stock),
              fontSize: "0.875rem",
            }}
          >
            {getStatusText(product.stock)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: { xs: "45%", sm: "auto" },
          }}
        >
          <Typography sx={{ color: "gray", fontSize: "0.875rem" }}>Category</Typography>
          <Typography sx={{ color: "white", fontSize: "0.875rem" }}>{product.categoryName || "N/A"}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderLeft: { xs: "none", sm: "1px solid #333" },
            pl: { xs: 0, sm: 2 },
            minWidth: { xs: "45%", sm: "auto" },
          }}
        >
          <Typography sx={{ color: "gray", fontSize: "0.875rem" }}>Retail Price</Typography>
          <Typography sx={{ color: "white", fontSize: "0.875rem" }}>
            ${product.price ? product.price.toFixed(2) : "0.00"}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ProductItem

