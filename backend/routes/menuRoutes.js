const express = require("express");
const router = express.Router();
const MenuItem = require("../models/menuItem");
const MenuCategory = require("../models/menuCategory");
const FinishedGoods = require("../models/finishedGoods");
const BOM = require("../models/bom");
const mongoose = require('mongoose');

// Get all menu categories with their items
// router.get("/categories", async (req, res) => {
//     try {
//       const categories = await MenuCategory.find().sort('order');
//       const items = await MenuItem.find({ isAvailable: true }).populate('category');
  
//       const menuData = categories.map(category => ({
//         id: category.id,
//         name: category.name,
//         columns: category.columns,
//         smallText: category.smallText,
//         items: items
//           .filter(item => item.category && item.category._id.toString() === category._id.toString())
//           .map(item => ({
//             id: item.id,
//             name: item.name,
//             price: item.price,
//             isPizza: item.isPizza
//           }))
//       }));
  
//       res.json(menuData);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

// router.get("/categories", async (req, res) => {
//   try {
//     const categories = await MenuCategory.find().sort('order');
    
//     // Map categories to include both id and _id for frontend compatibility
//     const simplifiedCategories = categories.map(category => ({
//       _id: category._id,  // Include MongoDB _id
//       id: category.id,    // Include your custom id
//       name: category.name,
//       columns: category.columns,
//       smallText: category.smallText,
//       order: category.order
//     }));
    
//     res.json(simplifiedCategories);
//   } catch (error) {
//     console.error("Error fetching menu categories:", error);
//     res.status(500).json({ message: error.message });
//   }
// });



// // Route to get FinishedGoods collection
// router.get("/finishedgoods", async (req, res) => {
//   try {
//     const finishedGoods = await FinishedGoods.find();
//     res.json(finishedGoods);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching FinishedGoods" });
//   }
// });

// / Get all menu categories with their items
router.get("/categories", async (req, res) => {
  try {
    const categories = await MenuCategory.find().sort('order');
    
    // Get items from both collections
    const menuItems = await MenuItem.find({ isAvailable: true }).populate('category');
    const finishedGoods = await FinishedGoods.find().populate('category', 'name id _id');
    
    console.log(`Found ${menuItems.length} menu items and ${finishedGoods.length} finished goods`);
    
    const menuData = categories.map(category => {
      // Get regular menu items for this category
      const categoryMenuItems = menuItems
        .filter(item => item.category && item.category._id.toString() === category._id.toString())
        .map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          isPizza: item.isPizza,
          source: 'menuItem' // Add source for debugging
        }));
      
      // Get finished goods for this category
      const categoryFinishedGoods = finishedGoods
        .filter(item => {
          // Check if category exists and matches
          if (!item.category) return false;
          
          // Compare category IDs
          const itemCategoryId = item.category._id.toString();
          const categoryId = category._id.toString();
          
          return itemCategoryId === categoryId;
        })
        .map(item => ({
          id: item.id || item._id.toString(),
          name: item.name,
          price: item.price || 0,
          isPizza: item.isPizza || false,
          source: 'finishedGood' // Add source for debugging
        }));
      
      // Combine both types of items
      const combinedItems = [...categoryMenuItems, ...categoryFinishedGoods];
      
      console.log(`Category ${category.name} has ${categoryMenuItems.length} menu items and ${categoryFinishedGoods.length} finished goods`);
      
      return {
        id: category.id,
        name: category.name,
        columns: category.columns,
        smallText: category.smallText,
        items: combinedItems
      };
    });
    
    res.json(menuData);
  } catch (error) {
    console.error("Error fetching menu categories with items:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/finishedgoods", async (req, res) => {
  try {
    // Populate the category field to get category information
    const finishedGoods = await FinishedGoods.find().populate('category', 'name id _id');
    
    // Map the data to ensure consistent format for frontend
    const mappedGoods = finishedGoods.map(item => ({
      _id: item._id,
      id: item.id,
      name: item.name,
      price: item.price || 0,
      stock: item.stock || 0,
      category: item.category ? item.category._id : null,  // Use category._id for consistency
      categoryName: item.category ? item.category.name : 'Uncategorized',
      rawIngredients: item.rawIngredients
    }));
    
    res.json(mappedGoods);
  } catch (error) {
    console.error("Error fetching FinishedGoods:", error);
    res.status(500).json({ message: "Error fetching FinishedGoods" });
  }
});


// Route to fetch BOM data
router.get("/bom", async (req, res) => {
  try {
    const bomData = await BOM.find();  // Fetch data from BOM collection
    console.log("Fetched BOM Data:", bomData);  // Log BOM data for debugging
    res.json(bomData);  // Return BOM data as response
  } catch (error) {
    console.error("Error fetching BOM data:", error);
    res.status(500).json({ message: "Error fetching BOM data" });
  }
});


router.put("/bom", async (req, res) => {
  try {
    const updatedBomData = req.body;
    
    // Create a bulk operation array
    const bulkOps = updatedBomData.map(item => {
      return {
        updateOne: {
          filter: { RawID: item.RawID },
          update: { $set: { Quantity: item.Quantity } },
          upsert: false
        }
      };
    });
    
    // Execute bulk operation
    const result = await BOM.bulkWrite(bulkOps);
    
    console.log("Updated BOM Data:", result);
    res.json({ 
      message: "BOM data updated successfully", 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error("Error updating BOM data:", error);
    res.status(500).json({ message: "Error updating BOM data" });
  }
});


// Route to post BOM data
router.post("/bom", async (req, res) => {
  try {
    const bomData = req.body;  // The raw BOM data sent in the request
    await BOM.insertMany(bomData);  // Insert data into BOM collection
    res.status(201).json({ message: "BOM data inserted successfully" });
  } catch (error) {
    console.error("Error inserting BOM data:", error);
    res.status(500).json({ message: "Error inserting BOM data" });
  }
});

module.exports = router;



