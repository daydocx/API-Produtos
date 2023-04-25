require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const swaggerUi = require("swagger-ui-express")
const swaggerDocs = require("./swagger.json")
const { Produto, produtoJoiSchema } = require("./models/produto")
const path = require("path");

//Configuração do App
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL);

const multer = require("multer");

//Upload de imagem
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, 'uploads'),
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extname = path.extname(file.originalname)
        const filename = file.fieldname + '-' + uniqueSuffix + extname
        callback(null, filename)
    }
});

const upload = multer({ storage: storage });


//Inserção do produto;
app.post("/produtos", upload.single('imagem'), async (req, res) => {
    try {
        const { error } = produtoJoiSchema.validate(req.body);
        if (!error) {
            const { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria } = req.body;
            let imagem = null;
            if (req.file) { // verifica se um arquivo de imagem foi enviado
                imagem = req.file.filename;
            }
            const produto = new Produto({ nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagem });

            await produto.save();
            res.status(201).json(produto);
        } else {
            res.status(400).json({ message: error.message });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// Listagem de todas os produtos (GET);
app.get("/produtos", async (req, res) => {
    try {
        const { nome, preco } = req.query;

        const filtrar = {};

        if (nome) {
            filtrar.nome = { $regex: new RegExp(nome, "i") };
        }
        if (preco) {
            filtrar.preco = {};
            if (preco) {
                filtrar.preco.$gte = parseFloat(preco);
            }
            if (preco) {
                filtrar.preco.$lte = parseFloat(preco);
            }
        }

        const produtos = await Produto.find(filtrar).sort({ nome: 1, categoria: 1 });;
        res.json(produtos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

// Listagem de produtos por id (GET)
app.get("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params; // captura o id passado na rota
        produtoExistente = await Produto.findById(id); // realiza a busca do documento em cima do id passado na rota

        if (produtoExistente) { // se existir a tarefa responde ela
            res.status(200).json(produtoExistente);
        } else { //se não exister retorna o erro
            res.status(404).json({ message: "Produto não encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

// Atualização de uma Produto (PUT)
app.put("/produtos/:id", upload.single('imagem'), async (req, res) => {
    try {
        const { id } = req.params // -> busca o id digitado na rota
        const { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagem } = req.body; // -> busca as informações no corpo da requisição
        const produtoExistente = await Produto.findByIdAndUpdate(id, { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagem }); // findByIdAndUpdate -> primeiro passa o id, se encontrar passa os dados que vai atualizar;
        if (produtoExistente) {
            res.json({ message: "Produto editado." })
        } else {
            res.status(404).json({ message: "Produto não encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

// Remoção de um produto;
app.delete("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const produtoExistente = await Produto.findByIdAndRemove(id);
        if (produtoExistente) {
            res.json({ message: "Produto excluido." });
        } else {
            res.status(404).json({ message: "Produto não encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});


app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs))





//Escuta de eventos
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/");
});