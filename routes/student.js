const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");

const Student = require("../models/Student");

const upload = multer({ dest: "./public/images" });

router.get("", async (req, res) => {
    //console.log(req.query);
    const students = await Student.find(req.query);
    if (students) {
        console.log(students);
        res.status(200).json({
            status: true,
            message: "Students Data Found",
            data: students,
        });
    } else {
        res.status(404).json({
            status: false,
            message: "Some error happened",
        });
    }
});

router.get("/:id", async (req, res) => {
    // console.log(req.params.id);
    const student = await Student.findById(req.params.id);
    // console.log(student);
    if (student) {
        res.status(200).json({
            status: true,
            message: "Student Found",
            data: student,
        });
    } else {
        res.status(404).json({
            status: false,
            message: "Student Not found",
        });
    }
});

router.post("/search", async (req, res) => {
    const { query } = req.body;
    console.log(req.body)
    const students = await Student.find();
    const results = [];
    students.forEach((student) => {
        if (student.name.includes(query)) {
            results.push(student)
        }
    });
    if (results) {
        console.log(results)
        res.status(200).json({
            status: true,
            message: "Data found",
            data: results
        })
    }
    else {
        res.status(200).json({
            status: false,
            message: "Data not found",
            data: ""
        })
    }
});

router.put("/:id", upload.single("student-image"), async (req, res) => {
    // console.log("File here")
    // console.log(req.file);
    if (!req.file) {
        // console.log(req.params.id);
        const resp = await Student.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, req.body);
        if (resp.n > 0) {
            res.status(200).json({
                status: true,
                message: "Student data updated",
            });
        } else {
            res.status(404).json({
                status: false,
                message: "No data updated",
            });
        }
    } else {
        const student = {};
        Object.keys(req.body).forEach((key) => (student[key] = req.body[key]));
        student.image = req.file.filename;
        console.log("File Updation");
        console.log(student);
        const resp = await Student.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, student);
        if (resp.n > 0) {
            res.status(200).json({
                status: true,
                message: "Student data updated",
            });
        } else {
            res.status(404).json({
                status: false,
                message: "No data updated",
            });
        }
    }
});

router.delete("/:id", async (req, res) => {
    const resp = await Student.deleteOne({ _id: req.params.id });
    if (resp.deletedCount > 0) {
        res.status(200).json({
            status: true,
            message: "Data deleted",
        });
    } else {
        res.status(404).json({
            status: false,
            message: "No data deleted",
        });
    }
});

router.post("/create", upload.single("student-image"), async (req, res) => {
    //console.log(req.body);
    //console.log(req.file);
    const { name, department, address, joining_year, year, passing_year, email, phone, socials } = req.body;
    const student = Student({
        name,
        department,
        address,
        joining_year,
        year,
        passing_year,
        email,
        phone,
        image: req.file.filename ? req.file.filename : "",
        socials: socials == null ? [] : socials,
    });
    const find = await Student.findOne({ email });
    if (!find) {
        try {
            const save = await student.save();
            //console.log(save);
            res.status(201).json({
                status: true,
                message: "Student created",
                data: save,
            });
        } catch (err) {
            res.status(400).json({
                status: false,
                message: "Unable to create student",
                error: err,
            });
        }
    } else {
        res.status(400).json({
            status: false,
            message: "Student exists",
        });
    }
});

module.exports = router;
