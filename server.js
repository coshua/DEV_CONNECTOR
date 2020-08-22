const express = require("express");
const c = require("config");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  return res.send("API running ~");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
