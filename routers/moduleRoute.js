import express from "express"
import cloudinary from "cloudinary"
import Module from "../model/Module.js"
import Topic from "../model/Topic.js"
import Chapter from "../model/Chapter.js"
import Course from "../model/Course.js"

const router = express.Router()

// Create a new module
router.post("/modules", async (req, res) => {
    try {
      const { title, description, duration, course } = req.body
  
      const newModule = new Module({
        courseId: course, // Change this line
        title,
        description,
        duration,
      })
  
      const savedModule = await newModule.save()
      res.status(201).json({
        msg: "Module added successfully",
        data: savedModule,
        error: false,
      })
    } catch (error) {
      console.log("Error Module Adding", error)
  
      res.status(500).json({
        msg: "Failed to add module",
        error: error.message,
      })
    }
  })

  // Get all modules with populated course details
router.get("/modules", async (req, res) => {
    try {
      // Fetch all modules and populate the courseId field
      const modules = await Module.find().populate("courseId");
  
      res.status(200).json({
        msg: "Modules fetched successfully",
        data: modules,
        error: false,
      });
    } catch (error) {
      console.log("Error fetching modules:", error);
  
      res.status(500).json({
        msg: "Failed to fetch modules",
        error: error.message,
      });
    }
  });
  
  // Create a new topic under a specific module
router.post("/:courseId/modules/:moduleId/topics", async (req, res) => {
    try {
        const { title, order } = req.body
        const moduleId = req.params.moduleId // Get the module ID from the URL parameters

        const newTopic = new Topic({
            moduleId,
            title,
            order, // Optional: order can help define the sequence of topics
        })

        const savedTopic = await newTopic.save()
        res.status(201).json({
            msg: "Topic added successfully",
            data: savedTopic,
            error: false,
        })
    } catch (error) {
        res.status(500).json({
            msg: "Failed to add topic",
            error: error.message,
        })
    }
})

export default router

