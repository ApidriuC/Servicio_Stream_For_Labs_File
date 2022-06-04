import { Router } from 'express';
import FileRouter from './file.route';

const router = Router();
const prefix: string = '/api';

router.use(`${prefix}/file`, FileRouter);

export default router;
