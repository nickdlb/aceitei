import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagens = [438690, 437654, 464264, 325562, 437248, 471975, 437798, 449000, 205737, 436271, 450722, 451404, 436723, 435817, 207157]

const OUTPUT_DIR = path.join(__dirname, 'public', 'paints');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function fetchObjectIDs() {
  const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?q=painting&hasImages=true');
  const data = await response.json();
  return data.objectIDs || [];
}

function getRandomElements(array, count) {
  return [...array].sort(() => 0.5 - Math.random()).slice(0, count);
}

async function fetchObjectDetails(id) {
  const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
  return await response.json();
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err.message);
    });
  });
}

async function main() {
  try {
    const allIDs = await fetchObjectIDs();
    const selectedIDs = getRandomElements(allIDs, 30);

    for (const id of selectedIDs) {
      const obj = await fetchObjectDetails(id);
      if (obj && obj.primaryImage) {
        const ext = path.extname(obj.primaryImageSmall).split('?')[0] || '.jpg';
        const filename = `${id}${ext}`;
        const filepath = path.join(OUTPUT_DIR, filename);
        console.log(`⬇️  Baixando: ${filename}`);
        await downloadImage(obj.primaryImage, filepath);
      }
    }

    console.log('✅ Imagens salvas em public/paints');
  } catch (err) {
    console.error('Erro:', err);
  }
}

main();
