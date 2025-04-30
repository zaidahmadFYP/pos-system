// Helper functions for category processing

// Helper function to extract ObjectId value
export const getIdFromObjectId = (idObject) => {
    // Debugging log to see what's coming in
    //console.log("getIdFromObjectId input:", idObject)
  
    if (!idObject) return null
  
    // If it's already a string, return it
    if (typeof idObject === "string") return idObject
  
    // If it has $oid property (MongoDB format), return that value
    if (idObject.$oid) return idObject.$oid
  
    // If it's a regular object with _id property
    if (idObject._id) {
      // If _id is an object with $oid
      if (typeof idObject._id === "object" && idObject._id.$oid) {
        return idObject._id.$oid
      }
      // If _id is a string
      return idObject._id
    }
  
    // Last resort, stringify the object and use as is
    return String(idObject)
  }
  
  // Create a mapping of category ID to category name
  export const createCategoryMap = (categories) => {
    return categories.reduce((acc, category) => {
      // Handle both _id and id for maximum compatibility
      const categoryId =
        category._id && category._id.$oid
          ? category._id.$oid
          : category._id
            ? category._id
            : category.id
              ? category.id
              : null
  
      if (categoryId) {
        acc[categoryId] = category.name
        //console.log(`Mapped category ID ${categoryId} to name ${category.name}`)
      }
  
      return acc
    }, {})
  }
  
  // Process products with category mapping
  export const processProducts = (products, categoryMapObj) => {
    return products.map((product) => {
      // Debug each product's category
      //console.log(`Processing product: ${product.name}`)
      //console.log("Product raw category:", product.category)
  
      // Extract category ID accounting for MongoDB format
      let categoryId = null
      if (product.category) {
        if (product.category.$oid) {
          categoryId = product.category.$oid
        } else if (typeof product.category === "string") {
          categoryId = product.category
        } else if (typeof product.category === "object") {
          categoryId = product.category._id ? product.category._id : null
        }
      }
  
      //console.log(`Extracted categoryId: ${categoryId}`)
      //console.log(`Category name from mapping: ${categoryMapObj[categoryId] || "Unknown"}`)
  
      return {
        ...product,
        categoryId: categoryId, // Store the normalized categoryId for filtering
        categoryName: product.categoryName || categoryMapObj[categoryId] || "Unknown",
      }
    })
  }
  
  