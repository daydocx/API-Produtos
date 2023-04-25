require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express")
const swaggerDocs = require("./swagger.json")

const app = express();
app.use(express.json());
// app.use(express.)

mongoose.connect(process.env.MONGODB_URL);

const produtosRoutes = require("./routes/produto");
app.use(produtosRoutes);

app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.listen(3000, () =>{
    console.log("Servidor rodando em http://localhost:3000/")
})