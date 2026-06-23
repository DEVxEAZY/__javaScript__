import express from 'express';
import alunoRoutes from './routes/alunoRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';



class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    routes() {

        this.app.use('/home', homeRoutes);
        this.app.use('/alunos', alunoRoutes);
        this.app.use('/usuarios', usuarioRoutes);
        this.app.use('/hobbies', hobbyRoutes);

    }
}

export default new App().app;


