const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email });
    if (user) {
        res.status(200).json({
            status: false,
            message: "User exists",
        });
    } else {
        const newUser = User({
            name,
            email,
            password: hash,
        });
        const save = await newUser.save();
        res.status(200).json({
            status: true,
            message: "New user created",
            data: save,
        });
    }
});

router.post("/login", async (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.decode(token);
        res.status(200).json({
            status: true,
            message: "User signed in",
            data: { token, user },
        });
    } else {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                status: false,
                message: "User not found",
            });
        } else {
            const pass = await bcrypt.compare(password, user.password);
            if (!pass) {
                res.status(200).json({
                    status: false,
                    message: "Invalid credentials",
                });
            } else {
                const token = jwt.sign(user.toJSON(), "super duper secret!!!");
                res.status(200).json({
                    status: true,
                    message: "User signed in",
                    data: { token, user: user.toJSON() },
                });
            }
        }
    }
});

module.exports = router;
