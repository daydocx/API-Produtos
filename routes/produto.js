const { Router } = require("express");
const { Produto, produtoJoiSchema } = require("../models/produto");
const router = Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs');



//configuração multer -- upload de fotos
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../uploads'),
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extname = path.extname(file.originalname)
        const filename = file.fieldname + '-' + uniqueSuffix + extname
        callback(null, filename)
    }
});

const upload = multer({ storage: storage });

//ADICIONANDO UM PRODUTO 

router.post("/produtos", upload.single('imagem'), async (req, res) => {
    try {
        const { error } = produtoJoiSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria } = req.body;
        let imagem = null;
        if (req.file) { // verifica se um arquivo de imagem foi enviado
            imagem = req.file.filename;
        }
        const produto = new Produto({ nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagem });

        await produto.save();
        res.status(201).json(produto);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});


//LISTANDO UM PRODUTO 

router.get("/produtos", async (req, res) => {
    try {
        const { nome, preco, categoria, id } = req.query;

        const filtrar = {};

        if (id) {
            filtrar._id = id;
        }
        if (nome) {
            filtrar.nome = { $regex: new RegExp(nome, "i") };
        }
        if (categoria) {
            filtrar.categoria = { $regex: new RegExp(categoria, "i") };
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

        // Verifica se nenhum parâmetro de busca foi fornecido

        const produtos = await Produto.find(filtrar).sort({ nome: 1, categoria: 1 });

        // Verifica se a lista de produtos está vazia
        if (produtos.length === 0) {
            return res.status(404).json({ message: "Nenhum produto encontrado." });
        }

        res.status(200).json(produtos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

//LISTANDO TODOS PRODUTOS

router.get("/produtos", async (req, res) => {
    try {
        const produtos = await Produto.find();

        res.status(200).json(produtos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

//ATUALIZANDO UM PRODUTO

router.put("/produtos/:id", upload.single('imagem'), async (req, res) => {
    try {
        const { id } = req.params;
        let imagem = null;
        if (req.file) { // verifica se um arquivo de imagem foi enviado
            imagem = req.file.filename;
        }
        const { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria } = req.body;

        const produtoExistente = await Produto.findByIdAndUpdate(id, { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria,imagem });

        if (produtoExistente) {
            if(produtoExistente.imagem){
                const imagemAnterior = path.join(__dirname, '../uploads', produtoExistente.imagem);
                fs.unlink(imagemAnterior, (err) => {
                    if (err) console.log(err);
                })
            };
            res.status(201).json({ produtoExistente ,message: "Produto editado." });
        } else {
            res.status(404).json({ message: "Produto não encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});


//DELETANDO UM PRODUTO

router.delete("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const produtoExistente = await Produto.findByIdAndDelete(id);

        if (produtoExistente) {
            if(produtoExistente.imagem){
                const imagemAnterior = path.join(__dirname, '../uploads', produtoExistente.imagem);
                fs.unlink(imagemAnterior, (err) => {
                    if (err) console.log(err);
                })
            };
            res.status(201).json({ message: "Produto deletado." });
        } else {
            res.status(404).json({ message: "Produto não encontrado." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

module.exports = router;