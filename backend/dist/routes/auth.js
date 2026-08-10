"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const router = express_1.default.Router();
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }
        const usuarios = await (0, database_1.queryAsync)('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (!usuarios || usuarios.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const usuario = usuarios[0];
        const passwordValid = await bcryptjs_1.default.compare(password, usuario.password_hash);
        if (!passwordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ id: usuario.id, email: usuario.email, nombre: usuario.nombre }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
router.post('/register', async (req, res) => {
    try {
        const { email, nombre, password, rol } = req.body;
        if (!email || !nombre || !password) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        await (0, database_1.runAsync)('INSERT INTO usuarios (email, nombre, password_hash, rol) VALUES (?, ?, ?, ?)', [email, nombre, passwordHash, rol || 'lider']);
        res.status(201).json({ usuario: { email, nombre, rol: rol || 'lider' } });
    }
    catch (error) {
        if (error.message?.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map