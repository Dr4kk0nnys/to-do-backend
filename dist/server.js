"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
/**
    * Configurations
    * It will initiate the app ( express )
    * Call the config function for the dotenv file ( .env )
    * Create the port variable
**/
dotenv_1.config();
const app = express_1.default();
const PORT = process.env.PORT;
/* Custom express configuration */
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
/* Routes */
const index_1 = __importDefault(require("./routes/index"));
const register_1 = __importDefault(require("./routes/register"));
const login_1 = __importDefault(require("./routes/login"));
const to_do_1 = __importDefault(require("./routes/to-do"));
app.use('/', index_1.default);
app.use('/register', register_1.default);
app.use('/login', login_1.default);
app.use('/to-dos', to_do_1.default);
app.listen(PORT, () => console.log('\x1b[35m%s\x1b[0m', `Server listening on http://localhost:${PORT}`));
