import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(registerUser);

export default router



/*
export default router:
Exports the router object directly.
Use, if you only need to export a single entity (the router object).

export default {router}:
Exports an object containing the router object as a property.
Use, if you need to export multiple related entities or anticipate adding more properties to the exported object in the future.

export const router = ..........
Exported router as it is, no changes possible including name changing during import.
*/


/*
import userRoutes from './userRoutes.js':
Imported with desired name only when export was default 

import {router} from './userRoutes.js':
Imported with used name, when export was not default.
syntax of export for this is: export const router = ......
As we used this method to export the models
*/