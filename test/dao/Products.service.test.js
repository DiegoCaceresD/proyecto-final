import mongoose from "mongoose";
import productsService from "../../src/services/dao/db/services/productService.js";
import Assert from "assert";
import chai from "chai";

mongoose.connect(
  `mongodb://localhost:27017/proyecto-testing?retryWrites=true&w=majority`
);

const assert = Assert.strict;
const expect = chai.expect;

// Creamos el contexto
describe("Testing products", () => {
  before(function () {
    mongoose.connection.collections.products.drop();
    this.products = new productsService();
  });

  beforeEach(function () {
    this.timeout(10000);
  });

  //test 01
  it("debe agregar el producto correctamente a la DB", async function () {

    // Given
    let mockProduct = {
      title: "prueba2",
      description: "1kg",
      price: 200,
      stock: 60,
      category: "prueba",
      status: true,
      code: "AJRE5487917",
    };

    // Then
    const result = await this.products.addProduct(mockProduct);

    // Assert
    expect(result._id).to.be.ok;
  });

  //test 02
  it("debe devolver un objeto", async function () {
    const result = await this.products.getProducts();
    expect( result).to.be.an('object');
  }); 
});
