"use client"
import { Box, Typography, Button, Select, MenuItem, Input, Paper } from "@mui/material"
import { ChevronDown } from "lucide-react"

const Filters = ({ filters, handleFilterChange, handleResetFilters, categories, totalProducts }) => {
  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: "#1E1E1E",
        color: "white",
        borderRadius: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Product Status */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1.5,
            fontSize: { xs: "1rem", md: "1.25rem" },
            fontWeight: 500,
          }}
        >
          Product Status
        </Typography>
        <Button
          fullWidth
          sx={{
            bgcolor: "#2a2a2a",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            borderRadius: "8px",
            padding: { xs: "8px 12px", md: "12px 16px" },
            textTransform: "none",
            border: filters.status === "all" ? "1px solid #e65100" : "1px solid transparent",
            "&:hover": {
              bgcolor: "#2a2a2a",
            },
          }}
          onClick={() => handleFilterChange("status", "all")}
        >
          <span>All</span>
          <span style={{ color: "#e65100" }}>{totalProducts}</span>
        </Button>
      </Box>

      {/* Category */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1.5,
            fontSize: { xs: "1rem", md: "1.25rem" },
            fontWeight: 500,
          }}
        >
          Category
        </Typography>
        <Box sx={{ position: "relative", width: "100%" }}>
          <Select
            fullWidth
            value={filters.category}
            onChange={(e) => {
              console.log("Direct event value:", e.target.value)
              handleFilterChange("category", e.target.value)
            }}
            IconComponent={() => (
              <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />
            )}
            sx={{
              bgcolor: "#2a2a2a",
              color: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                py: { xs: 1.5, md: 2 },
                px: { xs: 2, md: 3 },
              },
              "&:focus": {
                borderColor: "#e65100",
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((category) => {
              // Get category ID - careful not to modify the original data structure
              // Use the simplest approach first - just use the name as the value
              const categoryName = category.name

              console.log(`Rendering category option: ${categoryName}`)

              // Skip if no valid name
              if (!categoryName) {
                console.warn(`Category has no name, skipping`)
                return null
              }

              return (
                <MenuItem key={category._id ? category._id : categoryName} value={categoryName}>
                  {categoryName}
                </MenuItem>
              )
            })}
          </Select>
        </Box>
      </Box>

      {/* Stock */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1.5,
            fontSize: { xs: "1rem", md: "1.25rem" },
            fontWeight: 500,
          }}
        >
          Stock
        </Typography>
        <Box sx={{ position: "relative", width: "100%" }}>
          <Select
            fullWidth
            value={filters.stock}
            onChange={(e) => handleFilterChange("stock", e.target.value)}
            IconComponent={() => (
              <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />
            )}
            sx={{
              bgcolor: "#2a2a2a",
              color: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": {
                py: { xs: 1.5, md: 2 },
                px: { xs: 2, md: 3 },
              },
              "&:focus": {
                borderColor: "#e65100",
              },
            }}
          >
            <MenuItem value="inStock">In Stock</MenuItem>
            <MenuItem value="outOfStock">Out of Stock</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Product Name  */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1.5,
            fontSize: { xs: "1rem", md: "1.25rem" },
            fontWeight: 500,
          }}
        >
          Product Name
        </Typography>
        <Input
          type="text"
          placeholder="Enter Product Name"
          value={filters.productName || ""}
          onChange={(e) => handleFilterChange("productName", e.target.value)}
          fullWidth
          sx={{
            bgcolor: "#2a2a2a",
            color: "white",
            borderRadius: "8px",
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 2 },
            "&:focus": {
              outline: "none",
            },
          }}
        />
      </Box>

      {/* Reset Button */}
      <Button
        onClick={handleResetFilters}
        fullWidth
        sx={{
          bgcolor: "#e65100",
          color: "white",
          padding: { xs: "12px 0", md: "16px 0" },
          borderRadius: "8px",
          mt: "auto", // Push to bottom
          "&:hover": {
            bgcolor: "#ff6d00",
          },
        }}
      >
        Reset Filters
      </Button>
    </Paper>
  )
}

export default Filters

