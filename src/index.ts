import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

// Configuration
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

try {
  if (!process.env.PORT) {
    throw new Error('Lütfen .env dosyasını kontrol ediniz. PORT değeri bulunamadı.');
  }

  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(`[ArastaTS] developer için hazır!, port: ${process.env.PORT}`);
  });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

export default app;
