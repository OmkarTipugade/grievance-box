import React, { useState, useEffect } from "react";

const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  loading = "lazy",
  objectFit = "cover",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    // Create a new image object to preload
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };

    return () => {
      // Cleanup
      img.onload = null;
    };
  }, [src]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
          aria-hidden="true"
        />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            width,
            height,
            objectFit,
          }}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
