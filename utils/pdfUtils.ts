// lib/pdfjs-node.ts

import path from 'path';
import { createCanvas } from 'canvas';

const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

// Corrigir workerSrc manualmente
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(
  __dirname,
  '../../node_modules/pdfjs-dist/build/pdf.worker.js'
);

export { pdfjsLib, createCanvas };