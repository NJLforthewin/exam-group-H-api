import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import * as examRouter from "./exams/exams.routes"; 

dotenv.config();

if (!process.env.PORT) {
    console.log(`No port value specified...`);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Use the correct router for handling the /exams routes
app.use('/', examRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
