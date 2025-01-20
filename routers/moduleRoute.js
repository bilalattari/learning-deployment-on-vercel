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

// Create a new topic
router.post("/:courseId/modules/:moduleId/topics", async (req, res) => {
    try {
        const { title, order } = req.body
        const moduleId = req.params.moduleId

        const newTopic = new Topic({
            moduleId,
            title,
            order,
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

// Create a new chapter
router.post("/:courseId/modules/:moduleId/topics/:topicId/chapters", async (req, res) => {
    try {
        const { title, content, order } = req.body
        const topicId = req.params.topicId

        const newChapter = new Chapter({
            topicId,
            title,
            content,
            order,
        })

        const savedChapter = await newChapter.save()
        res.status(201).json({
            msg: "Chapter added successfully",
            data: savedChapter,
            error: false,
        })
    } catch (error) {
        res.status(500).json({
            msg: "Failed to add chapter",
            error: error.message,
        })
    }
})

// Get full course structure
router.get("/:courseId/full", async (req, res) => {
    try {
        const courseId = req.params.courseId
        const course = await Course.findById(courseId)
        const modules = await Module.find({ courseId })

        const fullCourse = {
            ...course.toObject(),
            modules: await Promise.all(
                modules.map(async (module) => {
                    const topics = await Topic.find({ moduleId: module._id })
                    return {
                        ...module.toObject(),
                        topics: await Promise.all(
                            topics.map(async (topic) => {
                                const chapters = await Chapter.find({ topicId: topic._id })
                                return {
                                    ...topic.toObject(),
                                    chapters,
                                }
                            }),
                        ),
                    }
                }),
            ),
        }

        res.status(200).json({
            msg: "Full course structure fetched successfully",
            data: fullCourse,
            error: false,
        })
    } catch (error) {
        res.status(500).json({
            msg: "Failed to fetch full course structure",
            error: error.message,
        })
    }
})

export default router

