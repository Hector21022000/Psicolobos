const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const docxPath = path.join(
  process.cwd(),
  'Carpetas de documentación ',
  'Anamnesis',
  'Ficha_Integral_Anamnesis_2026_Identico.docx'
);

const outDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Extracting media from:', docxPath);
const buffer = fs.readFileSync(docxPath);

let pos = 0;
let extractedCount = 0;

while (pos < buffer.length - 30) {
  if (
    buffer[pos] === 0x50 &&
    buffer[pos + 1] === 0x4b &&
    buffer[pos + 2] === 0x03 &&
    buffer[pos + 3] === 0x04
  ) {
    const compression = buffer.readUInt16LE(pos + 8);
    const compressedSize = buffer.readUInt32LE(pos + 18);
    const fileNameLen = buffer.readUInt16LE(pos + 26);
    const extraLen = buffer.readUInt16LE(pos + 28);

    const fileName = buffer.toString('utf-8', pos + 30, pos + 30 + fileNameLen);
    const dataStart = pos + 30 + fileNameLen + extraLen;
    const dataEnd = dataStart + compressedSize;

    if (fileName.startsWith('word/media/')) {
      const imgName = path.basename(fileName);
      const compressedData = buffer.slice(dataStart, dataEnd);
      let imgData = compressedData;

      try {
        if (compression === 8) {
          imgData = zlib.inflateRawSync(compressedData);
        }
      } catch (err) {
        try {
          imgData = zlib.inflateSync(compressedData);
        } catch (e) {}
      }

      const outPath = path.join(outDir, imgName);
      fs.writeFileSync(outPath, imgData);
      console.log(`Extracted: ${fileName} -> ${outPath} (${imgData.length} bytes)`);
      extractedCount++;
    }

    pos = dataEnd > pos ? dataEnd : pos + 1;
  } else {
    pos++;
  }
}

console.log(`Total images extracted: ${extractedCount}`);
