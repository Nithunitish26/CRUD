// server/routes/students.js
const express = require("express");
const router = express.Router();
const studentscontroller = require("../controllers/studentscontroller");

// First verify the controller has these methods
console.log("Available controller methods:", Object.keys(studentscontroller));

// Basic routes
router.get("/", studentscontroller.view);
router.get("/adduser", studentscontroller.adduser);
router.post("/adduser", studentscontroller.save);
router.get("/edituser/:id", studentscontroller.edituser);
router.post("/edituser/:id", studentscontroller.edit);
router.get("/deleteuser/:id", studentscontroller.delete);

// Marks routes
router.get("/student/:id/marks", studentscontroller.viewMarks);
router.get("/student/:id/marks/add", studentscontroller.addMarksForm);
router.post("/student/:id/marks/add", studentscontroller.saveMarks);
router.get("/student/:id/marks/edit/:markId", studentscontroller.editMarksForm);
router.post("/student/:id/marks/edit/:markId", studentscontroller.updateMarks);
router.get("/student/:id/marks/delete/:markId", studentscontroller.deleteMarks);

module.exports = router;