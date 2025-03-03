const express = require("express");
const router = express.Router();
const MenuItem = require("../models/menuItem");
const MenuCategory = require("../models/menuCategory");
const mongoose = require('mongoose');

// Get all menu categories with their items
router.get("/categories", async (req, res) => {
    try {
      const categories = await MenuCategory.find().sort('order');
      const items = await MenuItem.find({ isAvailable: true }).populate('category');
  
      const menuData = categories.map(category => ({
        id: category.id,
        name: category.name,
        columns: category.columns,
        smallText: category.smallText,
        items: items
          .filter(item => item.category && item.category._id.toString() === category._id.toString())
          .map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            isPizza: item.isPizza
          }))
      }));
  
      res.json(menuData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
