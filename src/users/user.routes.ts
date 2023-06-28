import express, {Request, Response} from "express"
import {UnitUser, User} from './user.interface'
import {StatusCodes} from 'http-status-codes'
import * as database from './user.database'

export const userRouter = express.Router()

userRouter.get('/users', async (req: Request, resp: Response) => {
  try {
    const allUsers : UnitUser[] = await database.findAll()
    
    if (!allUsers) {
      return resp.status(StatusCodes.NOT_FOUND).json({msg: `No user at this time...`})
    }

    return resp.status(StatusCodes.OK).json({total_user: allUsers.length, allUsers})
  } catch (error) {
    return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})

userRouter.get('/user/:id', async(req: Request, resp: Response) => {
  try {
    const user : UnitUser = await database.findOne(req.params.id)

    if (!user) {
      return resp.status(StatusCodes.NOT_FOUND).json({msg: `User not found!`})
    }

    return resp.status(StatusCodes.OK).json({user})
  } catch (error) {
    return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})

userRouter.post("/register", async (req: Request, resp: Response) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return resp.status(StatusCodes.NOT_FOUND).json({msg: `Please provide all the required parameters`})
    }

    const user = await database.findByEmail(email)
    if (user) {
      return resp.status(StatusCodes.BAD_REQUEST).json({msg: `The Email has already been registered`})
    }

    const newUser = await database.create(req.body)
    return resp.status(StatusCodes.OK).json({newUser})
  } catch (error) {
    return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})

userRouter.post("/login", async (req: Request, resp: Response) => {
  try {
    const {email, password} = req.body
    if (!email || !password) {
      return resp.status(StatusCodes.BAD_REQUEST).json({error: `Please provide all the required parameters`})
    }

    const user = await database.findByEmail(email)
    if (!user) {
      return resp.status(StatusCodes.NOT_FOUND).json({error: `No user exists with the email provided`})
    }

    const comparePassword = await database.comparePassword(email, password)
    if (!comparePassword) {
      return resp.status(StatusCodes.BAD_REQUEST).json({error: `Incorrect Password`})
    }
    // returns user data
    return resp.status(StatusCodes.OK).json({user})
  } catch (error) {
    return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})

userRouter.put('user/:id', async(req: Request, resp: Response) => {
  try {
    const {username, email, password} = req.body
    
    const getUser = database.findOne(req.params.id)

    if (!username || !email || !password) {
      return resp.status(401).json({error: `Please provide all the required parameters`})
    }
  } catch (error) {
    return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
  }
})