"use strict";
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');

mongoose.connect(
    "mongodb+srv://test001:dVxfNP2n6WQev7sw@cluster0.780me.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    // 'mongodb://localhost/studentsdb',
    { useNewUrlParser: true, useUnifiedTopology: true, dbName: "students" },
    (err) => {
        if (!err) {
            console.log("Database connected");
        } else {
            console.log(err);
        }
    }
);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/students", require("./routes/student"));
app.use("/auth", require("./routes/auth"));
app.use("/notif",require("./routes/notif"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
