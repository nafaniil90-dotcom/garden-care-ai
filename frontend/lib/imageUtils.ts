/**
 * Utility for client-side image compression and resizing using HTML5 Canvas.
 * Prevents localStorage QuotaExceededError and optimizes API payloads.
 */
export async function compressImage(
  fileOrDataUrl: File | string,
  maxDimension: number = 800,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const processImage = () => {
      let width = img.width;
      let height = img.height;

      if (width <= 0 || height <= 0) {
        // Fallback if image dimensions cannot be read
        resolve(typeof fileOrDataUrl === "string" ? fileOrDataUrl : "");
        return;
      }

      // Calculate resized dimensions keeping aspect ratio
      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(typeof fileOrDataUrl === "string" ? fileOrDataUrl : "");
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Export compressed image as JPEG Data URL
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };

    img.onerror = (err) => {
      console.warn("Failed to load image for compression:", err);
      resolve(typeof fileOrDataUrl === "string" ? fileOrDataUrl : "");
    };

    if (typeof fileOrDataUrl === "string") {
      img.src = fileOrDataUrl;
      if (img.complete) {
        processImage();
      } else {
        img.onload = processImage;
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = processImage;
      };
      reader.onerror = (err) => {
        console.warn("FileReader error during compression:", err);
        resolve("");
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
