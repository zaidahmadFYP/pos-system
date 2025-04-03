import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

// Fetch Menu Categories
export const fetchMenuCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/menu/categories`)
    console.log("API Response:", response.data) // Add this for debugging
    return response.data
  } catch (error) {
    console.error("Error fetching menu categories:", error)
    throw error //Error handling
  }
}

// Add Menu Item
export const addMenuItem = async (itemData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/menu/items`, itemData)
    return response.data
  } catch (error) {
    console.error("Error adding menu item:", error)
    throw error
  }
}

// Update Menu Item
export const updateMenuItem = async (id, itemData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/menu/items/${id}`, itemData)
    return response.data
  } catch (error) {
    console.error("Error updating menu item:", error)
    throw error
  }
}

// Delete Menu Item
export const deleteMenuItem = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/menu/items/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting menu item:", error)
    throw error
  }
}


