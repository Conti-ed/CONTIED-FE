import { useState, useEffect } from "react";

export const useAdaptiveTextColor = (imageUrl: string) => {
  const [textColor, setTextColor] = useState<string>("#001438");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0,
          g = 0,
          b = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.floor(r / (data.length / 4));
        g = Math.floor(g / (data.length / 4));
        b = Math.floor(b / (data.length / 4));

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setTextColor(brightness > 128 ? "#001438" : "#e1e8ed");
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      setTextColor("#001438");
      setIsLoading(false);
    };
  }, [imageUrl]);

  return { textColor, isLoading };
};
