Owned by: @DiegoCaceresD

App ID: 401228

Client ID: Iv1.7144d031f0ab84e6

4d559d7993b29caed4b7b1a772253dff0590ce5c


paso a paso para completar una compra desde postman:

----------------- LOG IN ----------------
1.- resgistrarse
body de ejemplo: 
{
    "first_name": "prueba",
    "last_name": "Final",
    "email": "pruebaFinal@mail.com",
    "password": "123asd",
    "age": "25"
}


2.- Log in
body de ejemplo: 

{
    "email": "pruebaFinal@mail.com",
    "password": "123asd"
}


3.- verificar que se haya creado exitosamente el usuario

get localhost:8080/api/users

y obtener el cartId


------------------ AÑADIR PRODUCTOS AL CARRITO ------------------------

4.- con el endpoint get localhost:8080/api/products podras visualizar todos los productos disponibles y obtener su ID para luego añadirlo al Cart
    4.1 -  en caso de querer añadir mas productos acceder a post localhost:8080/api/products


5.- Teniendo el cartID y el productID podras accceder a post localhost:8080/api/carts/***carid***/product/***productid*** y añadir cuantos productos quieras a tu carrito


6.- verificar que se hayan cargado los productos correctamente al carrito con get localhost:8080/api/carts/**cartId**


------------------ EFECTUAR COMPRA --------------------

7.- una vez cargados los productos al carrito, se podra acceder a post localhost:8080/api/carts/**cartID**/purchase para efectuar la compra

8.- verificar que el ticket se haya generado correctamente en localhost:8080/api/tickets/**ticketId**
