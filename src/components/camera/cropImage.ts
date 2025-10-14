export default function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const canvas = document.createElement("canvas");
  const img = document.createElement("img");
  img.src = imageSrc;

  return new Promise((resolve) => {
    img.onload = () => {
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx?.drawImage(
        img,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
  });
}
