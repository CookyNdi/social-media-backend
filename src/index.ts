import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import userRoute from './routes/user.router';
dotenv.config();

const app: express.Application = express();
const PORT: string = process.env.PORT ?? '5000';

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('./public'));
app.use(userRoute);

app.listen(PORT, () => {
  console.log(`server up and running at http://localhost:${PORT}`);
});
