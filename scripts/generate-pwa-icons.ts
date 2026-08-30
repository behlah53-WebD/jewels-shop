import fs from "fs";
import path from "path";
import zlib from "zlib";

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crcBuf]);
}

function generatePng(width: number, height: number): Buffer {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type 2 (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk("IHDR", ihdr);

  // Scanlines (RGBA/RGB)
  // Background: #0a100d (RGB: 10, 16, 13)
  // Gold accent: #d5ad67 (RGB: 213, 173, 103)
  const rawData: number[] = [];
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    rawData.push(0); // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Simple elegant emblem: gold border circle + central gold diamond accent
      const isCircleBorder = dist >= radius - width * 0.03 && dist <= radius;
      const isDiamond = Math.abs(dx) + Math.abs(dy) <= width * 0.18;

      if (isCircleBorder || isDiamond) {
        rawData.push(213, 173, 103); // Gold #d5ad67
      } else {
        rawData.push(10, 16, 13); // Dark #0a100d
      }
    }
  }

  const compressedData = zlib.deflateSync(Buffer.from(rawData));
  const idatChunk = makeChunk("IDAT", compressedData);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function main() {
  const iconsDir = path.join(process.cwd(), "public", "icons");
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log("🎨 Generating Aurelia Jewels PWA PNG icons...");
  fs.writeFileSync(path.join(iconsDir, "icon-192.png"), generatePng(192, 192));
  fs.writeFileSync(path.join(iconsDir, "icon-512.png"), generatePng(512, 512));
  fs.writeFileSync(path.join(iconsDir, "maskable-512.png"), generatePng(512, 512));
  fs.writeFileSync(path.join(iconsDir, "apple-touch-icon.png"), generatePng(180, 180));
  fs.writeFileSync(path.join(process.cwd(), "public", "favicon.ico"), generatePng(32, 32));
  console.log("✅ PWA Icons generated successfully!");
}

main();
