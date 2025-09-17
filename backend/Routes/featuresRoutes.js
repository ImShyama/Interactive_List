const express = require("express");
const router = express.Router();
const FeaturesController = require("../Controllers/FeaturesController");

// Get All Features Data
router.get("/getAllFeatures", FeaturesController.getAllFeatures);

// Add New Feature Update
router.post("/addFeature", FeaturesController.addFeature);

// Update Feature
router.put("/update-feature/:id", FeaturesController.updateFeature);

// Delete Feature
router.delete("/delete-feature/:id", FeaturesController.deleteFeature);

module.exports = router;
