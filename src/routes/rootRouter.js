import express from "express"
import roadRacesRouter from "./roadRacesRouter.js"

const rootRouter = new express.Router()

rootRouter.use("/road-races", roadRacesRouter)

export default rootRouter