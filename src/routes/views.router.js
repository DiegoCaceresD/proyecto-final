import {Router} from 'express';
// import * as CartsService from "../db/services/cartsService"
import { ProductModel}  from "../services/dao/db/models/product.model.js";
// import { CartModel } from '../db/models/cart.model.js';

const router = Router();

router.get('/',async(req,res)=>{
    let page = parseInt(req.query.page);
    if (!page) page = 1;
    let result = await ProductModel.paginate({}, { page, limit: 5, lean: true });
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/?page=${result.nextPage}` : '';
    result.isValid = !(page <= 0 || page > result.totalPages)
    res.render('products',result)
})


// router.get('/courses',async(req,res)=>{
//     let cart = await CartsService.getCartById();
//     res.render('courses',{courses})
// })


export default router;