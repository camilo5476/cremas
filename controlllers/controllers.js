import { db, bucket } from "../database/firebase.js";
import fs from "fs";
import path from "path";
import {nanoid } from 'nanoid';
import whatsapp from "../helpers/whatsapp.js";

const __dirname = path.resolve();

const PostProductos = async (req, res) => {
    try {

        if (!req.body || !req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        const { name, description, price, type, ingredients, size, skinType, usage, benefits, expirationDate } = req.body;

        const parseDates = {
            name: String(name),
            description: String(description),
            price: Number(price),
            type: String(type),
            ingredients: String(ingredients),
            size: String(size),
            skinType: String(skinType),
            usage: String(usage),
            benefits: String(benefits),
            expirationDate: String(expirationDate)
        };

        const images = req.files;
        const imagesurls = await Promise.all(images.map(async (image) => {
            try {
                const localFilepath = path.join(__dirname, `public/uploads/${image.originalname}`);
                const remoteFilepath = `r/productos/${image.originalname}`;
                const file = bucket.file(remoteFilepath);

                await file.save(fs.readFileSync(localFilepath), {
                    metadata: {
                        contentType: image.mimetype
                    }
                });

                fs.unlinkSync(localFilepath);
                const url = `https://firebasestorage.googleapis.com/v0/b/cremas-5a324.appspot.com/o/r%2Fproductos%2F${image.originalname}?alt=media&token=ff3d6d25-ec03-4c50-a96b-979623e6ff34`;
                return  url;
            } catch (error) {
                console.log(error.message);
                return "Error al subir la imagen";
            }
        }));
        const id = nanoid(3);
        const newProduct = {
            uid: id,
            ...parseDates,
            images: imagesurls,
            date: Date.now().toString()
        };
        const uid = Date.now().toString(20);

        await db.collection("productosCremas").doc(uid).set(newProduct);

        res.status(200).json({ message: 'Creado con exito' });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: 'Error al registrar el producto' });
    }
};

const PostWhatsapp = async (req, res) => {
    try {
        const {telefono, message} = req.body
        console.log(telefono, message)
    
        const chatId = telefono.toString() + "@c.us"; // chatId se forma con el número y "@c.us"
        
        const number_details = await whatsapp.getNumberId(telefono); // Usa el número de teléfono

        if (number_details) {
            await whatsapp.sendMessage(chatId, message); // Usa chatId para enviar el mensaje
            res.status(200).json({ message: 'ENVIADO' });
        } else {
            throw new Error('Número de teléfono no encontrado o inválido');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};


export default {
    PostProductos
    , PostWhatsapp
};
