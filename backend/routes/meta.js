import { Router } from 'express';
import { getSalesMeta } from '../models/salesCatalog.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getSalesMeta());
});

export default router;
