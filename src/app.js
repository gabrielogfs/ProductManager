const express = require("express");
const fs = require('fs').promises;
const app = express();

const productManager = require("./Atividade_aula4");
const productManagerInst = new productManager();

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <section>
          <p>Olá! Para navegar entre as páginas basta digitar a seção desejada:</p>
          <ul>
            <li>1 - products: Lhe trás todos os produtos da nossa lista;</li>
            <li>2 - products:id: Lhe trás o produto conforme id digitado;</li>
            <li>3 - Em construção...</li>
          </ul>
        </section>
      </body>
    </html>
  `);
});

app.get('/products', async (req, res) => {
    try {
    const data = await fs.readFile("products.json", "utf-8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Não foi possível realizar a consulta: ", error);
        res.status(500).send("Erro ao ler arquivo.");
    };
});

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

app.listen(8080, () => console.log("Servidor ativo na porta 8080."));

// Para acessar o back end utilize: localhost:8080/
