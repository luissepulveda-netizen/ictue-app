"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("./database");
const auth_1 = __importDefault(require("./routes/auth"));
const asistencia_1 = __importDefault(require("./routes/asistencia"));
const estadisticas_1 = __importDefault(require("./routes/estadisticas"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas
app.use('/api/auth', auth_1.default);
app.use('/api/asistencia', asistencia_1.default);
app.use('/api/estadisticas', estadisticas_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Endpoint temporal para crear usuario de prueba
app.post('/api/setup/create-user', async (req, res) => {
    try {
        const email = 'pastor@ictue.cl';
        const passwordHash = bcryptjs_1.default.hashSync('Test@2026', 10);
        const existing = await (0, database_1.queryAsync)('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.json({ message: 'Usuario ya existe' });
        }
        await (0, database_1.runAsync)('INSERT INTO usuarios (email, nombre, rol, password_hash) VALUES (?, ?, ?, ?)', [email, 'Pastor Luis', 'pastor', passwordHash]);
        res.json({ message: 'Usuario creado exitosamente', email });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✓ Servidor ICTUE corriendo en puerto ${PORT}`);
});
//# sourceMappingURL=server.js.map