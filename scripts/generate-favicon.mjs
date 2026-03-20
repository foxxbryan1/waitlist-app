import sharp from 'sharp';

// SVG with dark purple background and lightning bolt shape
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="5" fill="#7c3aed"/>
  <polygon points="18,3 10,18 15,18 14,29 22,14 17,14" fill="white"/>
</svg>`;

const svgBuffer = Buffer.from(svg);

await sharp(svgBuffer)
  .resize(32, 32)
  .toFile('app/favicon.ico');

console.log('favicon.ico generated successfully');
