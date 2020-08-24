const express = require("express");
const c = require("config");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");

//Connect Database
connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  return res.send("API running ~");
});

//Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
