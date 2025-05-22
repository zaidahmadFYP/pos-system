import axios from "axios";

// Standardize the base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Fetch Menu Categories and build menu structure from FinishedGoods
export const fetchMenuCategories = async () => {
  try {
    // Get categories and finished goods in parallel
    const [categoriesResponse, finishedGoodsResponse] = await Promise.all([
      axios.get(`/api/menu/categories`), // Use existing endpoint
      axios.get(`/api/menu/finishedgoods`)
    ]);
    
    // Extract just the category information from the response
    const categoriesWithItems = categoriesResponse.data;
    const finishedGoods = finishedGoodsResponse.data;
    
    console.log("Raw categories:", categoriesWithItems);
    console.log("Raw finished goods:", finishedGoods);
    
    // Create a mapping from MongoDB ObjectId to category ID
    const categoryIdMap = {};
    
    // First, build a mapping of MongoDB ObjectIds to category IDs
    categoriesWithItems.forEach(category => {
      if (category._id) {
        categoryIdMap[category._id] = category.id;
      }
    });
    
    console.log("Category ID mapping:", categoryIdMap);
    
    // Create a mapping of category names to category IDs as fallback
    const categoryNameMap = {};
    categoriesWithItems.forEach(category => {
      categoryNameMap[category.name.toLowerCase()] = category.id;
    });
    
    console.log("Category name mapping:", categoryNameMap);
    
    // Map categories and include items from finishedGoods instead of the original items
    const updatedCategories = categoriesWithItems.map(category => {
      // Get the original items from the category (from MenuItem collection)
      const originalItems = category.items || [];
      
      // Filter finished goods that belong to this category
      const categoryItems = finishedGoods.filter(item => {
        if (!item.category && !item.categoryName) {
          return false;
        }
        
        // Try to match by category ID
        if (item.category) {
          // If the category is stored as MongoDB ObjectId, look it up in our mapping
          if (categoryIdMap[item.category]) {
            return categoryIdMap[item.category] === category.id;
          }
        }
        
        // Try to match by category name as fallback
        if (item.categoryName) {
          const normalizedCategoryName = item.categoryName.toLowerCase();
          return normalizedCategoryName === category.name.toLowerCase();
        }
        
        return false;
      });
      
      console.log(`Category ${category.name} has ${originalItems.length} original items and ${categoryItems.length} finished goods items`);
      
      // Map finished goods to the format expected by MenuGrid
      const formattedItems = categoryItems.map(item => ({
        id: item._id ? item._id.toString() : (item.id ? item.id.toString() : ''),
        name: item.name,
        price: item.price || 0,
        isPizza: item.isPizza || false
      }));
      
      // Return category with items from finished goods
      return {
        id: category.id,
        name: category.name,
        items: formattedItems, // Replace original items with finished goods
        columns: category.columns || 2,
        smallText: category.smallText || false
      };
    });
    
    console.log("Categories with finished goods items:", updatedCategories);
    return updatedCategories;
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    throw error;
  }
};

// Fetch Finished Goods (Products)
export const fetchFinishedGoods = async () => {
  try {
    const response = await axios.get(`/api/menu/finishedgoods`);
    return response.data;
  } catch (error) {
    console.error("Error fetching finished goods:", error);
    throw error;
  }
};

// Add Finished Good
export const addFinishedGood = async (productData) => {
  try {
    const response = await axios.post(`/api/menu/finishedgoods`, productData);
    return response.data;
  } catch (error) {
    console.error("Error adding finished good:", error);
    throw error;
  }
};

// Update Finished Good
export const updateFinishedGood = async (id, productData) => {
  try {
    const response = await axios.put(`/api/menu/finishedgoods/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating finished good:", error);
    throw error;
  }
};

// Delete Finished Good
export const deleteFinishedGood = async (id) => {
  try {
    const response = await axios.delete(`/api/menu/finishedgoods/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting finished good:", error);
    throw error;
  }
};

export default {
  fetchMenuCategories,
  fetchFinishedGoods,
  addFinishedGood,
  updateFinishedGood,
  deleteFinishedGood
};