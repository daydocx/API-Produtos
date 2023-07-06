API - PRODUTOS
Esta documentação descreve a API de Produtos, que é composta por um CRUD de produtos.

Contato: matheusferrazza@gmail.com

Versão: 1.0

Endpoints
Cadastro de produto
Método: POST
URL: http://localhost:3000/produtos
Descrição: Essa rota será responsável por cadastrar um novo produto.
Parâmetros da URL: Nenhum
Parâmetros da Query String: Nenhum
Parâmetros do Corpo da Requisição:
nome (string, obrigatório): Nome do produto.
descricao (string): Descrição do produto.
quantidade (number): Quantidade do produto.
preco (number): Preço do produto.
desconto (integer): Desconto aplicado ao produto.
dataDesconto (string): Data de término do desconto.
categoria (string): Categoria do produto.
imagem (string): Upload de imagem do produto.
Respostas:
Código 201: Produto adicionado.
Código 404: Produto não encontrado.
Código 500: Um erro aconteceu.
Listagem de produtos
Método: GET
URL: http://localhost:3000/produtos
Descrição: Essa rota será responsável por listar produtos por nome, categoria, ID e preço.
Parâmetros da URL: Nenhum
Parâmetros da Query String:
nome (string): Nome do produto a ser procurado.
categoria (string): Categoria do produto a ser procurado.
id (string): ID do produto a ser procurado.
preco (number): Preço do produto a ser procurado.
Parâmetros do Corpo da Requisição: Nenhum
Respostas:
Código 200: Produto encontrado.
Código 404: Produto não encontrado.
Código 500: Um erro aconteceu.
Atualização de produto
Método: PUT
URL: http://localhost:3000/produtos/{id}
Descrição: Essa rota será responsável por atualizar um produto existente.
Parâmetros da URL:
id (string, obrigatório): ID do produto a ser atualizado.
Parâmetros da Query String: Nenhum
Parâmetros do Corpo da Requisição:
nome (string, obrigatório): Nome do produto.
descricao (string): Descrição do produto.
quantidade (number): Quantidade do produto.
preco (number): Preço do produto.
desconto (integer): Desconto aplicado ao produto.
dataDesconto (string): Data de término do desconto.
categoria (string): Categoria do produto.
imagem (string): Upload de imagem do produto.
Respostas:
Código 200: Produto atualizado.
Código 404: Produto não encontrado.
Código 500: Um erro aconteceu.
Exclusão de produto
Método: DELETE
URL: http://localhost:3000/produtos/{id}
Descrição: Essa rota será responsável por excluir um produto existente.
Parâmetros da URL:
id (string, obrigatório): ID do produto a ser excluído.
Parâmetros da Query String: Nenhum
Parâmetros do Corpo da Requisição: Nenhum
Respostas:
Código 200: Produto excluído.
Código 404: Produto não encontrado.
Código 500: Um erro aconteceu.
