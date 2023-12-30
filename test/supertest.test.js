import chai from 'chai';
import supertest from 'supertest';
import EErrors from "../src/services/errors/errors-enum.js";


const expect = chai.expect;

const requester = supertest('http://localhost:8080');

describe('testing Proyecto', () => {

    describe('Testing Products API', () => {
        it("Crear producto: el API POST /api/products/ debe crear un producto", async () => {
            const mockProduct = {
                title: "productoPrueba92",
                description: "1kg",
                price: 200,
                stock: 60,
                category: "prueba",
                status: true,
                code: "AJRE512192",
              };

            const result =  await requester.post('/api/products').send(mockProduct);

            expect(result.statusCode).is.eqls(201)
            expect(result._body).is.ok.and.to.have.property("_id")
            expect(result._body).to.have.deep.property('status', true);
        })

        it("Crear un product sin titulo y que retorne un error", async () => {
            const mockProduct = {
                description: "1kg",
                price: 200,
                stock: 60,
                category: "prueba",
                status: true,
                code: "AJRE51216",
              };

              const result =  await requester.post('/api/products').send(mockProduct);
              expect(result.statusCode).is.eqls(400)
              expect(result._body).is.eqls("Product validation failed: title: Path `title` is required.");
        })
    })



    describe('Testing Logging and session with Cookies', () => {
        before(function(){
            this.cookie;
            this.mockUser = {
                first_name: "Usuario de prueba 1",
                last_name: "Apellido de prueba 1",
                username:"username prueba",
                email: "correodeprueba@mail.com",
                age: 20,
                role: "user",
                password: "123456"
            }
        })

        //register
        it("Debe poder registrar correctamente al usuario", async function (){
                const result = await requester.post('/api/sessions/register').send(this.mockUser)
                expect(result.statusCode).is.eqls(201)
        })

        //login
        it("Debe poder logearse el usuario registrado anteriormente", async function (){

            const mockLogin = {
               email: this.mockUser.email,
               password: this.mockUser.password
            }
            const result = await requester.post('/api/sessions/login').send(mockLogin);

            const cookieResult = result.headers["set-cookie"][0];

            expect(result.statusCode).is.eqls(200)

            //extraer cookie

            const cookieData = cookieResult.split("=")
            this.cookie = {
                name: cookieData[0],
                value: cookieData[1]
            };

            expect(this.cookie.name).to.be.ok.and.eql('jwtCookieToken');
            expect(this.cookie).to.be.ok
        })
    })
})