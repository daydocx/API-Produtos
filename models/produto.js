const { model, Schema } = require("mongoose");
const Joi = require("joi");

//nome, descrição, quantidade, preço, desconto, dataDesconto, categoria, imagem do produto
const Produto = model("produto", new Schema({
    nome: String,
    descricao: String,
    quantidade: Number,
    preco: Number,
    desconto: Number,
    dataDesconto: Date,
    categoria: String,
    imagem: String
}));

const produtoJoiSchema = Joi.object({
    nome: Joi.string().required(),
    descricao: Joi.string(),
    quantidade: Joi.number().integer().min(0).required(),
    preco: Joi.number().min(0).required(),
    desconto: Joi.number().integer().min(0).max(100),
    dataDesconto: Joi.date(),
    categoria: Joi.string(),
    imagem: Joi.string()
});

module.exports = {
    Produto,
    produtoJoiSchema
};