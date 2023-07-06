import express, {Request, Response} from 'express'
import {Product, UnitProduct} from './product.interface'
import * as database from './product.database'
import { StatusCodes } from 'http-status-codes'

export const productRouter = express.Router()


// get all products
productRouter.get('/products', async (req: Request, resp: Response) => {
  try {
    const allProducts = await database.findAll()

    if (!allProducts) {
      return resp.status(StatusCodes.NOT_FOUND).json({error: `No Products found!`})
    }

    return resp.status(StatusCodes.OK).json({total: allProducts.length, allProducts})
  } catch (error) {
    return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})

// get particular product
productRouter.get('/product/:id', async(req: Request, resp: Response) => {
  try {
    const product = await database.findOne(req.params.id)
    if (!product) {
      return resp.status(StatusCodes.NOT_FOUND).json({error: `Product does not exist`})
    }

    return resp.status(StatusCodes.OK).json({product})
  }
  catch (error) {
    return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})

// post for creating product
productRouter.post('/product', async(req: Request, resp: Response) => {
  try {
    const {name, price, quantity, image} = req.body

    if (!name || !price || !quantity || !image) {
      resp.status(StatusCodes.BAD_REQUEST).json({error: `Please provide all the parameters..`})
    }

    const newProduct = await database.create({...req.body})
    return resp.status(StatusCodes.CREATED).json({newProduct})
  } catch (error) {
    resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})

// put for updating product
productRouter.put('/product/:id', async(req: Request, resp: Response) => {
  try {
    const id = req.params.id

    const newProduct = req.body

    const findProduct = await database.findOne(id)

    if (!findProduct) {
      resp.status(StatusCodes.NOT_FOUND).json({error: `Product does not exist..`})
    }

    const updateProduct = await database.update(id, newProduct)
    return resp.status(StatusCodes.OK).json({updateProduct})
  } catch (error) {
    return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})

// delete for deleting product
productRouter.delete('/product/:id', async(req: Request, resp: Response) => {
  try {
    const getProduct = database.findOne(req.params.id)

    if (!getProduct) {
      return resp.status(StatusCodes.NOT_FOUND).json({error: `Product does not exist...`})
    }

    await database.remove(req.params.id)
    return resp.status(StatusCodes.OK).json({msg: `Product Deleted...`})
  } catch (error) {
    return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})