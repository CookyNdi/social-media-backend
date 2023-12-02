import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();

const app: express.Application = express();
const PORT: string = process.env.PORT ?? '5000';

app.use(cors())

app.listen(PORT, () => {
  console.log(`server up and running at http://localhost:${PORT}`);
});
