import express from "express";
import morgan from "morgan";
import cors from "cors";
import routerRutas from "./routes/route.js";
import { PORT } from "./port.js";
import whatsapp from "./helpers/whatsapp.js";

const app = express();

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

whatsapp.initialize()

//routes
app.use(routerRutas)


//server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}: in http://localhost:${PORT}`);
})