const MAX_SIZE_KB = 200;
const MAX_SHORT_SIDE = 1280;
const OUTPUT_FORMAT = 'image/jpeg';

export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const shortSide = Math.min(width, height);
        if (shortSide > MAX_SHORT_SIDE) {
          const ratio = MAX_SHORT_SIDE / shortSide;
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let result = canvas.toDataURL(OUTPUT_FORMAT, quality);
        while (result.length > MAX_SIZE_KB * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.05;
          result = canvas.toDataURL(OUTPUT_FORMAT, quality);
        }
        resolve(result);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
