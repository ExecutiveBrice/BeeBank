import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const targetFile = resolve(scriptDirectory, '../src/assets/runtime-config.js');
const backendUrl = process.env.API_URL?.trim().replace(/\/$/, '');
const apiUrl = backendUrl ? `${backendUrl}/api` : '/api';
const content = `window.__BEEBANK_CONFIG__ = Object.freeze(${JSON.stringify({ apiUrl })});\n`;

await mkdir(dirname(targetFile), { recursive: true });
await writeFile(targetFile, content, 'utf8');
