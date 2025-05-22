import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  Input,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChevronDown } from "lucide-react";

const Inventory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State for storing products from backend
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(!isMobile);

  // State for filters
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    stock: "inStock",
    productName: "",
  });

  // Configuration for API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/api/menu/categories`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Categories API Response:", categoriesResponse.data);

        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          // Debug each category to see its structure - DONT CHANGE
          categoriesResponse.data.forEach((category) => {
            console.log("Raw category data:", category);
            console.log("Category name:", category.name);
            console.log("Category _id:", category._id);
            if (category._id && category._id.$oid) {
              console.log("Category _id.$oid:", category._id.$oid);
            }
          });

          setCategories(categoriesResponse.data);

          // Create a mapping of category ID to category name - DONT CHANGE
          const categoryMapObj = categoriesResponse.data.reduce(
            (acc, category) => {
              // Handle both _id and id for maximum compatibility
              const categoryId =
                category._id && category._id.$oid
                  ? category._id.$oid
                  : category._id
                  ? category._id
                  : category.id
                  ? category.id
                  : null;

              if (categoryId) {
                acc[categoryId] = category.name;
                console.log(
                  `Mapped category ID ${categoryId} to name ${category.name}`
                );
              }

              return acc;
            },
            {}
          );

          // Fetch products (finishedgoods)
          const productsResponse = await axios.get(
            `${API_BASE_URL}/api/menu/finishedgoods`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Products API Response:", productsResponse.data);

          if (productsResponse.data && Array.isArray(productsResponse.data)) {
            // If the backend already provides categoryName, use it directly
            // Otherwise, map category IDs to names
            const processedProducts = productsResponse.data.map((product) => {
              // Debug each product's category
              console.log(`Processing product: ${product.name}`);
              console.log("Product raw category:", product.category);

              // Extract category ID accounting for MongoDB format
              let categoryId = null;
              if (product.category) {
                if (product.category.$oid) {
                  categoryId = product.category.$oid;
                } else if (typeof product.category === "string") {
                  categoryId = product.category;
                } else if (typeof product.category === "object") {
                  categoryId = product.category._id
                    ? product.category._id
                    : null;
                }
              }

              console.log(`Extracted categoryId: ${categoryId}`);
              console.log(
                `Category name from mapping: ${
                  categoryMapObj[categoryId] || "Unknown"
                }`
              );

              return {
                ...product,
                categoryId: categoryId, // Store the normalized categoryId for filtering
                categoryName:
                  product.categoryName || categoryMapObj[categoryId] || "Unknown",
              };
            });

            setProducts(processedProducts);
            setTotalProducts(processedProducts.length);
          } else {
            console.warn(
              "Products API did not return an array:",
              productsResponse.data
            );
            setProducts([]);
            setTotalProducts(0);
          }
        } else {
          console.warn(
            "Categories API did not return an array:",
            categoriesResponse.data
          );
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load inventory data. Please try again later.");
        // Clear products and categories on error
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  // Update showFilters based on screen size changes
  useEffect(() => {
    setShowFilters(!isMobile);
  }, [isMobile]);

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    // Create status based on stock for filtering
    const status = product.stock > 0 ? "In Stock" : "Out of Stock";

    // Filter by status
    if (filters.status !== "all" && status !== filters.status) {
      return false;
    }

    // Filter by category
    if (filters.category !== "all") {
      const productCategoryId = product.categoryId;
      const filterCategory = filters.category;

      // Debugging log to see the filtering process
      console.log(`Filtering: Product=${product.name}`);
      console.log(`- Product CategoryId=${productCategoryId}`);
      console.log(`- Selected Filter=${filterCategory}`);

      // Check if category IDs match or if category names match
      // (handles case where filter might be name or ID)
      if (
        productCategoryId !== filterCategory &&
        product.categoryName &&
        product.categoryName.toLowerCase() !== filterCategory.toLowerCase()
      ) {
        // No match by ID or name
        console.log(`- No match`);
        return false;
      }

      console.log(`- Match found`);
    }

    // Filter by stock
    if (filters.stock === "inStock" && product.stock <= 0) {
      return false;
    }
    if (filters.stock === "outOfStock" && product.stock > 0) {
      return false;
    }

    // Filter by product name (changed from ID)
    if (
      filters.productName &&
      !String(product.name)
        .toLowerCase()
        .includes(filters.productName.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (field, value) => {
    console.log(`Changing filter: ${field} to ${value}`);

    if (field === "category") {
      console.log("Category selection:", value);
      // Log the category object from categories array for debugging
      const selectedCategory = categories.find((cat) => {
        const catId =
          cat._id && cat._id.$oid ? cat._id.$oid : cat._id || cat.id;
        return catId === value || cat.name === value;
      });
      console.log("Selected category object:", selectedCategory);
    }

    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: "all",
      category: "all",
      stock: "inStock",
      productName: "",
    });
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  // Function to get status color
  const getStatusColor = (stock) => {
    return stock > 0 ? "green" : "orange";
  };

  // Function to determine status text
  const getStatusText = (stock) => {
    return stock > 0 ? "In Stock" : "Out of Stock";
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Calculate max height for the product list 
  // This will ensure scrolling is activated when needed
  const getMaxProductListHeight = () => {
    if (isMobile) return "calc(100vh - 150px)";
    if (isTablet) return "calc(100vh - 180px)";
    return "calc(100vh - 200px)";
  };

  // Responsive padding based on screen size
  const getResponsivePadding = () => {
    if (isMobile) return { xs: 1 };
    if (isTablet) return { xs: 1, sm: 2 };
    return { xs: 1, sm: 2, md: 3 };
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "#1a1a1a",
        minHeight: "100vh",
        height: "100%",
        p: getResponsivePadding(),
        overflow: "hidden", // Prevent double scrollbars
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Mobile toggle for filters */}
      {isMobile && (
        <Button
          fullWidth
          onClick={toggleFilters}
          sx={{
            mb: { xs: 1, sm: 2 },
            bgcolor: "#e65100",
            color: "white",
            padding: { xs: "8px", sm: "10px" },
            borderRadius: "8px",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            "&:hover": {
              bgcolor: "#ff6d00",
            },
          }}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      )}

      <Grid
        container
        spacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ 
          flexGrow: 1, 
          width: "100%", 
          m: 0,
          height: "100%" // Ensure grid takes full height
        }}
      >
        {/* Left Sidebar - Filters */}
        {showFilters && (
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              mb: isMobile ? { xs: 1, sm: 2 } : 0,
              height: isMobile ? "auto" : "100%",
            }}
          >
            <Paper
              sx={{
                p: { xs: 1.5, sm: 2, md: 3 },
                bgcolor: "#1E1E1E",
                color: "white",
                borderRadius: "16px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: isMobile ? "visible" : "auto", // Allow scrolling on desktop
                maxHeight: isMobile ? "none" : "calc(100vh - 50px)", // Set max height for desktop
              }}
            >
              {/* Product Status */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
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
                    padding: { xs: "6px 10px", sm: "8px 12px", md: "12px 16px" },
                    textTransform: "none",
                    border:
                      filters.status === "all"
                        ? "1px solid #e65100"
                        : "1px solid transparent",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
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
                      console.log("Direct event value:", e.target.value);
                      handleFilterChange("category", e.target.value);
                    }}
                    // Use default Material-UI icon positioning (right side)
                    sx={{
                      bgcolor: "#2a2a2a",
                      color: "white",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiSelect-select": {
                        py: { xs: 1, sm: 1.5, md: 2 },
                        px: { xs: 1.5, sm: 2, md: 3 },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      },
                      "&:focus": {
                        borderColor: "#e65100",
                      },
                      "& .MuiSelect-icon": {
                        color: "white", // Match icon color to text
                        right: { xs: 8, sm: 12 }, // Ensure icon stays on the right
                      },
                    }}
                  >
                    <MenuItem
                      value="all"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      All
                    </MenuItem>
                    {categories.map((category) => {
                      const categoryName = category.name;

                      console.log(`Rendering category option: ${categoryName}`);

                      if (!categoryName) {
                        console.warn(`Category has no name, skipping`);
                        return null;
                      }

                      return (
                        <MenuItem
                          key={category._id ? category._id : categoryName}
                          value={categoryName}
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          {categoryName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
              </Box>

              {/* Stock */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
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
                    // Use default Material-UI icon positioning (right side)
                    sx={{
                      bgcolor: "#2a2a2a",
                      color: "white",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiSelect-select": {
                        py: { xs: 1, sm: 1.5, md: 2 },
                        px: { xs: 1.5, sm: 2, md: 3 },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      },
                      "&:focus": {
                        borderColor: "#e65100",
                      },
                      "& .MuiSelect-icon": {
                        color: "white", // Match icon color to text
                        right: { xs: 8, sm: 12 }, // Ensure icon stays on the right
                      },
                    }}
                  >
                    <MenuItem
                      value="inStock"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      In Stock
                    </MenuItem>
                    <MenuItem
                      value="outOfStock"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Out of Stock
                    </MenuItem>
                  </Select>
                </Box>
              </Box>

              {/* Product Name */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                    fontWeight: 500,
                  }}
                >
                  Product Name
                </Typography>
                <Input
                  type="text"
                  placeholder="Enter Product Name"
                  value={filters.productName || ""}
                  onChange={(e) =>
                    handleFilterChange("productName", e.target.value)
                  }
                  fullWidth
                  sx={{
                    bgcolor: "#2a2a2a",
                    color: "white",
                    borderRadius: "8px",
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: 1, sm: 1.5, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "&:focus": {
                      outline: "none",
                    },
                    "&::placeholder": {
                      color: "gray", // Match placeholder color to screenshot
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
                  padding: { xs: "8px 0", sm: "12px 0", md: "16px 0" },
                  borderRadius: "8px",
                  mt: "auto", // Push to bottom
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  "&:hover": {
                    bgcolor: "#ff6d00",
                  },
                }}
              >
                Reset Filters
              </Button>
            </Paper>
          </Grid>
        )}

        {/* Right Side - Product Table */}
        <Grid
          item
          xs={12}
          md={showFilters ? 9 : 12}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: isMobile ? "auto" : "100%", // Ensure the grid takes appropriate height
          }}
        >
          <Paper
            sx={{
              borderRadius: "16px",
              bgcolor: "#1E1E1E",
              height: "100%", // Paper takes full height of the grid item
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // Hide overflow to prevent double scrollbars
              maxHeight: isMobile ? getMaxProductListHeight() : "calc(100vh - 50px)", // Set max height with margins
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  minHeight: "200px", // Ensure loading spinner has space
                }}
              >
                <CircularProgress sx={{ color: "#e65100" }} />
              </Box>
            ) : (
              <Box
                sx={{
                  borderRadius: "8px",
                  overflowY: "auto", // Enable vertical scrolling for product list
                  flexGrow: 1, // Allow this box to grow and fill available space
                  p: { xs: 0.5, sm: 1, md: 1.5 },
                  maxHeight: "100%", // Allow it to expand within its parent container
                  scrollbarWidth: "thin", // Firefox
                  scrollbarColor: "#e65100 #2a2a2a", // Firefox
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#2a2a2a",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#e65100",
                    borderRadius: "4px",
                  },
                }}
              >
                {filteredProducts.length === 0 ? (
                  <Box
                    sx={{
                      bgcolor: "#2a2a2a",
                      p: { xs: 1.5, sm: 2, md: 3 },
                      textAlign: "center",
                      color: "white",
                      borderRadius: "8px",
                      minHeight: "100px", // Ensure "no products" message has space
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      No products match your filter criteria
                    </Typography>
                  </Box>
                ) : (
                  // Product list container with max-height for scrolling when product count exceeds limit
                  <Box
                    sx={{
                      maxHeight: "100%", // Uses the parent's height constraint
                      overflow: "auto", // Enable scrolling when needed
                    }}
                  >
                    {filteredProducts.map((product) => (
                      <Box
                        key={product._id}
                        sx={{
                          bgcolor: "#2a2a2a",
                          mb: { xs: 0.5, sm: 1 },
                          p: { xs: 1.5, sm: 2, md: 3 },
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          justifyContent: "space-between",
                          gap: { xs: 1.5, sm: 2 },
                          borderRadius: "8px",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "white",
                              fontSize: {
                                xs: "0.875rem",
                                sm: "1rem",
                                md: "1.25rem",
                              },
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography
                            sx={{
                              color: "gray",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            Stocked Product:{" "}
                            <span style={{ color: "#e65100" }}>
                              {product.stock} In Stock
                            </span>
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: { xs: "wrap", md: "nowrap" },
                            gap: { xs: 1, sm: 1.5, md: 2 },
                            alignItems: "flex-start",
                            width: { xs: "100%", sm: "auto" },
                            justifyContent: { xs: "space-between", sm: "flex-end" },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              minWidth: { xs: "30%", sm: "auto" },
                            }}
                          >
                            <Typography
                              sx={{
                                color: "gray",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              Status
                            </Typography>
                            <Typography
                              sx={{
                                color: getStatusColor(product.stock),
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              {getStatusText(product.stock)}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              minWidth: { xs: "30%", sm: "auto" },
                            }}
                          >
                            <Typography
                              sx={{
                                color: "gray",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              Category
                            </Typography>
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              {product.categoryName || "N/A"}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              borderLeft: { xs: "none", sm: "1px solid #333" },
                              pl: { xs: 0, sm: 1, md: 2 },
                              minWidth: { xs: "30%", sm: "auto" },
                            }}
                          >
                            <Typography
                              sx={{
                                color: "gray",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              Retail Price
                            </Typography>
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              ${product.price ? product.price.toFixed(2) : "0.00"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: { xs: "90%", sm: "auto" } }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventory;