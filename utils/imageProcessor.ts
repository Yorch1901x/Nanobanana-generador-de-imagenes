
import { ASSETS } from './assets';

export type WatermarkType = 'none' | 'icon' | 'full';

export const addWatermark = async (
  base64Image: string,
  type: WatermarkType
): Promise<string> => {
  if (type === 'none') return base64Image;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const mainImage = new Image();
    const watermarkImage = new Image();

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    mainImage.onload = () => {
      // Set canvas size to match the main image
      canvas.width = mainImage.width;
      canvas.height = mainImage.height;

      // Draw main image
      ctx.drawImage(mainImage, 0, 0);

      // Prepare watermark
      watermarkImage.onload = () => {
        // Calculate watermark size (e.g., 20% of image width)
        const wmScale = 0.25;
        const wmWidth = mainImage.width * wmScale;
        const wmAspectRatio = watermarkImage.width / watermarkImage.height;
        const wmHeight = wmWidth / wmAspectRatio;

        // Position: Bottom Right with padding
        const padding = mainImage.width * 0.05;
        const x = mainImage.width - wmWidth - padding;
        const y = mainImage.height - wmHeight - padding;

        // Draw watermark (Opaque/Solid as requested)
        // We do NOT set globalAlpha to ensure it is exactly as the source
        ctx.drawImage(watermarkImage, x, y, wmWidth, wmHeight);

        // Return result
        resolve(canvas.toDataURL('image/png'));
      };

      watermarkImage.onerror = (err) => reject(err);
      
      // Select watermark source
      watermarkImage.src = type === 'full' ? ASSETS.logoFull : ASSETS.logoIcon;
    };

    mainImage.onerror = (err) => reject(err);
    mainImage.src = base64Image;
  });
};
