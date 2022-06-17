const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const anime = require("./routers/anime");
const cors = require("cors");
const helmet = require("helmet");

app.use(cors());
app.use(helmet());
app.use("/api", anime);
app.use("/api", (req, res) => {
  res.send({
    status: true,
    message: "running"
  });
});
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "api path not found",
  });
});

app.listen(PORT, () => {
  console.log("Listening on PORT:" + PORT);
});
