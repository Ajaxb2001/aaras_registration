const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/childDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Define Child Schema
const childSchema = new mongoose.Schema({
  childName: String,
  childAge: Number,
  childWeight: Number,
  childAllergic: String,
  childLikes: String,
  childDislikes: String,
});

const Child = mongoose.model("Child", childSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/register", (req, res) => {
  const newChild = new Child({
    childName: req.body.childName,
    childAge: req.body.childAge,
    childWeight: req.body.childWeight,
    childAllergic: req.body.childAllergic,
    childLikes: req.body.childLikes,
    childDislikes: req.body.childDislikes,
  });

  newChild
    .save()
    .then(() => {
      res.sendFile(__dirname + "/success.html"); // Render success.html upon successful registration
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error registering child information");
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
