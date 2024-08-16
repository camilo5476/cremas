import { Router } from "express";
import controllers from "../controlllers/controllers.js";
import { upload } from "../middlewares/multer.js";

const router = Router()

router.post("/api/pedidos/whatsapp", controllers.PostWhatsapp)
router.post("/api/productos" , upload.array("documents", 10) , controllers.PostProductos)


export default router