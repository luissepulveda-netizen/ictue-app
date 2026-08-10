"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { reunion_id, fecha, num_asistentes, expositor, observaciones } = req.body;
        const usuario_id = req.user.id;
        if (!reunion_id || !fecha || typeof num_asistentes !== 'number') {
            return res.status(400).json({ error: 'Datos incompletos' });
        }
        const result = await (0, database_1.runAsync)(`INSERT INTO asistencia (reunion_id, fecha, num_asistentes, expositor, observaciones, registrado_por)
       VALUES (?, ?, ?, ?, ?, ?)`, [reunion_id, fecha, num_asistentes, expositor || null, observaciones || null, usuario_id]);
        res.status(201).json({ id: result.id, reunion_id, fecha, num_asistentes });
    }
    catch (error) {
        console.error('Error registrando asistencia:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
router.get('/reuniones', auth_1.authenticateToken, async (req, res) => {
    try {
        const reuniones = await (0, database_1.queryAsync)(`SELECT * FROM reuniones_planeadas ORDER BY
       CASE WHEN dia_semana = 'MAR' THEN 1
            WHEN dia_semana = 'JUE' THEN 2
            WHEN dia_semana = 'DOM' THEN 3 END, hora`);
        res.json(reuniones);
    }
    catch (error) {
        console.error('Error obteniendo reuniones:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=asistencia.js.map