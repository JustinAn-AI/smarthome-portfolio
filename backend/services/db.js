import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

const FILES = {
  products: 'products.json',
  serials: 'serials.json',
  activations: 'activations.json',
};

let cache = null;

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile(filename, fallback) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    throw err;
  }
}

async function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function initDb() {
  await ensureDataDir();
  cache = {
    products: await readJsonFile(FILES.products, []),
    serials: await readJsonFile(FILES.serials, []),
    activations: await readJsonFile(FILES.activations, []),
  };

  const { migrateProductsToSales } = await import('./salesNormalize.js');
  const migrated = migrateProductsToSales(cache.products);
  if (JSON.stringify(migrated) !== JSON.stringify(cache.products)) {
    cache.products = migrated;
    await persistCollection('products');
  }

  return cache;
}

export function getDb() {
  if (!cache) throw new Error('Database not initialized');
  return cache;
}

export async function persistCollection(name) {
  if (!FILES[name]) throw new Error(`Unknown collection: ${name}`);
  await ensureDataDir();
  await writeJsonFile(FILES[name], cache[name]);
}

export async function persistAll() {
  await Promise.all(Object.keys(FILES).map((name) => persistCollection(name)));
}

export async function resetDb(data) {
  cache = {
    products: data.products || [],
    serials: data.serials || [],
    activations: data.activations || [],
  };
  await persistAll();
  return cache;
}
