import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        sequelize.sync().then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }).catch(error => {
            console.error('Unable to connect to the database:', error);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
