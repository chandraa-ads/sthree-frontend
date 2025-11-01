// convert-all-to-webp.js
import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "./src/assets/size";        // 🔹 your main image folder
const outputDir = "./src/assets/size";  // 🔹 where converted images will go

// Create output directory if it doesn't exist
fs.mkdirSync(outputDir, { recursive: true });

// Supported image formats
const supportedExtensions = [".jpg", ".jpeg", ".png", ".svg"];

function convertImages(folder) {
  const files = fs.readdirSync(folder);

  files.forEach((file) => {
    const inputPath = path.join(folder, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      // 🔁 If subfolder exists, recursively process
      convertImages(inputPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (supportedExtensions.includes(ext)) {
        const outputPath = path.join(
          outputDir,
          file.replace(ext, ".webp")
        );

        sharp(inputPath)
          .toFormat("webp", { quality: 80 })
          .toFile(outputPath)
          .then(() => {
            console.log(`✅ Converted: ${file} → ${path.basename(outputPath)}`);
          })
          .catch((err) => {
            console.error(`❌ Error converting ${file}:`, err.message);
          });
      }
    }
  });
}

convertImages(inputDir);
