import jwt from"jsonwebtoken";
import { Request,Response,NextFunction} from "express"

export const authenticate = async function(req:Request, res:Response, next:NextFunction) {
    try {
        let token:any = req.headers["x-api-key"]
        if (!token) {
            return res.status(404).send({ status: false, msg: "token is not present in header" })
        }

        let decodeToken: any = jwt.verify(token, "rushi-159")
        if (!decodeToken) {
            return res.status(401).send({ status: false, msg: "invalid token" })
        } else {
            req.body.userId = decodeToken.userId
            next()
        }
        

    } catch (err:any) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
