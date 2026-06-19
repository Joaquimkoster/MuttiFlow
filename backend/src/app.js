const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log("Servidor rodando");
});
