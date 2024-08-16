import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // Ejecuta Puppeteer en modo headless (sin interfaz gráfica)
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // Estas opciones son importantes en algunos entornos
    }
});

whatsapp.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

whatsapp.on("ready", () => {
    console.log("Whatsapp is ready");
});

whatsapp.on("auth_failure", (msg) => {
    console.error("AUTHENTICATION FAILURE", msg);
});

whatsapp.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
});

export default whatsapp;
