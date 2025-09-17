const FeaturesUpdate = require("../Models/featuresUpdates");

class FeaturesController {
  
  // Get All Features Data
  static getAllFeatures = async (req, res) => {
    try {
      const features = await FeaturesUpdate.find({}).sort({ createdAt: -1 });
      const featuresCount = await FeaturesUpdate.countDocuments();

      // Always return success with empty array if no features found
      res.status(200).json({ 
        success: true, 
        features: features || [], 
        featuresCount,
        message: features.length === 0 ? "No features found" : "Features fetched successfully"
      });
    } catch (error) {
      console.error("Error fetching features:", error.message);
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
  };

  // Add New Feature Update
  static isVideoUrl = (url) => {
    const videoPatterns = [
      /youtube\.com\/watch\?v=/,
      /youtu\.be\//,
      /vimeo\.com\//,
      /\.mp4$/,
      /\.webm$/,
      /\.ogg$/,
      /drive\.google\.com\/file\/d\/.*\/preview/,
    ];

    return videoPatterns.some((pattern) => pattern.test(url));
  };

  // Add Feature
  static addFeature = async (req, res) => {
    try {
      let { featureName, month, videoUrl, imgUrl } = req.body;

      if (!featureName || !month) {
        return res.status(400).json({
          success: false,
          message: "Feature name and month are required"
        });
      }

      // Check if videoUrl is a valid video URL
      if (!imgUrl) {
        if (!FeaturesController.isVideoUrl(videoUrl)) {
          imgUrl = videoUrl;
          videoUrl = "";
        }
      }

      // Create a new feature update document
      const newFeature = new FeaturesUpdate({
        featureName,
        month,
        videoUrl,
        imgUrl,
      });

      // Save to database
      const savedFeature = await newFeature.save();

      // Respond with the saved feature
      res.status(201).json({
        success: true,
        message: "Feature added successfully",
        data: savedFeature
      });
    } catch (error) {
      console.error("Error adding new feature:", error.message);
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
  };

  // Update Feature
  static updateFeature = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Feature ID is required"
        });
      }

      const result = await FeaturesUpdate.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!result) {
        return res.status(404).json({ 
          success: false, 
          message: "Feature not found" 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: "Feature updated successfully", 
        data: result 
      });
    } catch (error) {
      console.error("Error updating feature:", error.message);
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
  };

  // Delete Feature
  static deleteFeature = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Feature ID is required"
        });
      }

      const result = await FeaturesUpdate.findByIdAndDelete(id);

      if (!result) {
        return res.status(404).json({ 
          success: false, 
          message: "Feature not found" 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: "Feature deleted successfully" 
      });
    } catch (error) {
      console.error("Error deleting feature:", error.message);
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
  };
}

module.exports = FeaturesController;