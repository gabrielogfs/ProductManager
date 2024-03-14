const express = require("express");
const fs = require('fs').promises;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productManager = require("./Atividade_aula4");
const productManagerInst = new productManager();

// *** Página de entrada
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <div style="display: flex; justify-content: center;">
          <ul>
          <li style="display: flex; justify-content: center;"><h3>Olá! Para navegar entre as páginas basta digitar a seção desejada:</h3></li>
            <li>1 - localhost:8080/products: Conferir lista completa de produtos;</li>
            <li>2 - localhost:8080/products/:code: Conferir produtos específicos conforme Código;</li>
            <li style="display: flex; justify-content: center;"> <h4>** Apenas Postman **</strong></h4>
            <li>3 - localhost:8080/products/cadastro: Adicionar produtos;</li>
            <li>4 - localhost:8080/products/editar/estoque/:code: Atualizar estoque de um produto conforme seu Código;</li>
            <li>5 - localhost:8080/products/editar/titulo/:code: Atualizar título de um produto conforme seu Código;</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// *** GET: Buscar todos os produtos
app.get('/products', async (req, res) => {
    try {
    const data = await fs.readFile("products.json", "utf-8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Não foi possível realizar a consulta: ", error);
        res.status(500).send("Erro ao ler arquivo.");
    };
});

// *** GET: Buscar produto pelo Código
app.get('/products/:code', async (req, res) => {
    let productCode = req.params.code
    const product = productManagerInst.getProductByCode(productCode)
    
    try{
    const data = await fs.readFile("products.json", "utf-8");
        
        let products = JSON.parse(data);
        let product = products.find(product => product.code === productCode)

        if(!product){
            res.status(404).send("Produto não encontrado.");
        return
        } else {
            res.json(product);
        };

    } catch (error) {
        console.error("Não foi possível realizar a consulta: ", error);
        res.status(500).send("Erro ao ler arquivo.");
    }
});

// *** POST: Adicionar produtos
 app.post('/products/cadastro', async (req, res) =>{
   let {title, description, price, thumbnail, code, stock} = req.body;

   try{
   if(!title || !description || !price || !thumbnail || !code || !stock === undefined) {
     return res.status(400).send("Todos os campos são obrigatórios.")
   } else{
     productManagerInst.addProduct(title, description, price, thumbnail, code, stock);
     res.status(201).send(`O produto "${title} foi inserido com sucesso!`);
   }} catch (error) {
     console.error("Não foi possível realizar a inserção: ", error);
     res.status(500).send("Erro ao ler arquivo.");
   }});

// *** PUT: Editar produtos (estoque)
app.put('/products/editar/estoque/:code', async (req, res) =>{
  let productCode = req.params.code
  let newStock = req.body.stock;

  try {
    const data = await fs.readFile("products.json", "utf-8");
    let products = JSON.parse(data);

    let product = products.find(product => product.code === productCode);

    if (!product) {
      return res.status(404).send("Produto não encontrado.");
    }

    productManagerInst.updateStock(productCode, newStock);

    res.status(201).send(`O estoque do produto: "${product.title}" foi atualizado para: "${newStock}".`);
  } catch (error) {
    console.error("Não foi possível realizar a atualização do estoque do produto: ", error);
    res.status(500).send("Erro ao ler ou escrever no arquivo.");
  }
});

// *** PUT: Editar produtos (título)
app.put('/products/editar/titulo/:code', async (req, res) =>{
  let productCode = req.params.code
  let newTitle = req.body.title;

  try {
    const data = await fs.readFile("products.json", "utf-8");
    let products = JSON.parse(data);

    let product = products.find(product => product.code === productCode);

    if (!product) {
      return res.status(404).send("Produto não encontrado.");
    }

    productManagerInst.updateTitle(productCode, newTitle);

    res.status(201).send(`O título do produto: "${product.title}" foi atualizado para: "${newTitle}".`);
  } catch (error) {
    console.error("Não foi possível realizar a atualização do estoque do produto: ", error);
    res.status(500).send("Erro ao ler ou escrever no arquivo.");
  }
});


app.listen(8080, () => console.log("Servidor ativo na porta 8080."));

// Para acessar o back end utilize: localhost:8080/
