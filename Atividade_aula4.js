let readline = require('readline')
const fs = require("fs");
const crypto = require("crypto");
const { isUtf8 } = require("buffer");

class ProductManager {
  constructor(jsonfFilePath = "products.json") {
    this.products = [];
    this.currentId = 1;
    this.loadProducts();
  }

  // Método 1: Adicionar novos produtos
  addProduct(title, description, price, thumbnail, code, stock) {
    // Validação dos campos obrigatórios
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      stock === undefined
    ) {
      console.error(
        "O produto não foi adicionado, pois todos os campos são obrigatórios."
      );
      return;
    }

    // Validação do ID individual do produto
    if (this.products.some((product) => product.code === code)) {
      console.error(`Código "${code}" já existe. Produto não adicionado.`);
      return;
    }

    const newProduct = {
      id: this.currentId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    console.log(`Produto "${title}" adicionado com sucesso.`);

    // Adicionar o produto criado no JSON

    fs.writeFile(
      "products.json",
      JSON.stringify(this.products, null, 2),
      (err) => {
        if (err) {
          console.error("Erro ao criar produto no arquivo JSON: ", err);
        }
      }
    );
  }

  // Carregar dados do JSON

  loadProducts() {
    try {
      const data = fs.readFileSync("products.json", "utf-8");
      this.products = JSON.parse(data);
      console.log("Produtos carregados do JSON.");
    } catch (err) {
      console.error("Erro ao ler JSON.");
    }
  }

  // Método 2: Buscador de produtos pelo ID
  getProductById(code) {
    if (this.products.length === 0) {
      console.log("Não há produtos em sua lista.");
    } else {
      const product = this.products.find((product) => product.code === code);

      if (product) {
        console.log(product);
      } else {
        console.error(`Produto com ID ${code} não encontrado.`);
        return null;
      }
    }
  }

  // Método 3: Atualizar estoque do produto
  updateStock(code, newStock) {
    const product = this.products.find((product) => product.code === code);

    if (product) {
      product.stock = newStock;

      fs.writeFile(
        "products.json",
        JSON.stringify(this.products, null, 2),
        (err) => {
          if (err) {
            console.error("Erro ao alterar estoque do produto: ", err);
          } else {
            console.log(
              `Estoque do produto "${product.title}" atualizado para ${newStock} unidades.`
            );
          }
        }
      );
    }
  }

  // Método 4: Atualizar o título do produto
  updateTitle(code, newTitle) {
    const product = this.products.find((product) => product.code === code);

    if (product) {
      product.title = newTitle;

      fs.writeFile(
        "products.json",
        JSON.stringify(this.products, null, 2),
        (err) => {
          if (err) {
            console.error("Erro ao atualizar o título do produto: ", err);
          } else {
            console.log(
              `O título do produto foi atualizado para "${product.title}".`
            );
          }
        }
      );
    }
  }

  // Método 5: Remover o produto da lista
  removeProduct(code) {
    const product = this.products.find((product) => product.code === code);

    if (product !== -1) {
      let removedProduct = this.products.splice(product, 1)[0];

      fs.writeFile(
        "products.json",
        JSON.stringify(this.products, null, 2),
        (err) => {
          if (err) {
            console.error(`Produto com código ${code} não encontrado.`, err);
          } else {
            console.log(`O produto "${removedProduct.title}" foi removido.`);
          }
        }
      );
    }
  }

  // Método 6: Apresentar produtos
  displayProducts() {
    console.log("Lista de Produtos:");
    this.products.forEach((product) => {
      console.log(
        `- ${product.id}: ${product.title} (${
          product.code
        }): R$${product.price.toFixed(2)} - Estoque: ${product.stock}`
      );
    });
  }
}

// **** Gabriel, se quiser usar as funções em outro json é só especificar um caminho diferente como abaixo:
// const productManager = new ProductManager('caminho/arquivo.json');

// ********* Exemplos de uso, basta descomentar:

const productManager = new ProductManager('products.json');

  productManager.addProduct(
    "Apple iPhone 16 248 GB - Preto",
    "O iPhone 16 nem existe ainda, mas já temos aqui disponível!",
    9299.99,
    "Iphone16.jpg",
    "P004",
    3
  );

  // productManager.getProductById(2)
  productManager.removeProduct("P004");
  // productManager.updateStock("P003", 8);
  // productManager.updateTitle("P002", "Iphone 14 64GB - Meia-noite")


// ************** O código abaixo está em desenvolvimento, por gentileza desconsiderar

// let leitor = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// let exibirMenu = true;

// while (exibirMenu) {
//   console.log("Seja bem vindo ao sistema de gestão de produtos!");
//   console.log("1 - Cadastrar produto");
//   console.log("2 - Buscar produto");
//   console.log("3 - Atualizar estoque do produto");
//   console.log("4 - Atualizar o título do produto");
//   console.log("5 - Apagar produto");
//   console.log("6 - Encerrar aplicação");

// } switch (resp) {
//   case "1": console.log("Cadastrar produto");
//   break;
//   case "2": console.log("Buscar produto");
//   break;
//   case "3": console.log("Atualizar estoque");
//   break;
//   case "4": console.log("Atualizar o título do produto");
//   exibirMenu = false;
//   break;
//   case "5": console.log("Apagar produto");
//   break;
//   case "6": console.log("Finalizado a aplicação...");
//   break;
//   default:
//   console.log("Opção inválida")
// };

// console.log("A aplicação foi encerrada.")

//   leitor.question("Insira o número da opção desejada:\n", function(answer) {
//     let resp = answer;
//     console.log("A opção selecionada foi a número " + resp)
//     leitor.close();
// })

