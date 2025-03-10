"use client";
import React, { useEffect, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

interface ProductZoomProps {
  src: string;
}

const ProductZoom: React.FC<ProductZoomProps> = ({ src }) => {
  const [displaySrc, setDisplaySrc] = useState(src);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (src !== displaySrc) {
      // Trigger slide out animation
      setAnimate(true);
      const timeout = setTimeout(() => {
        // Update image and slide in
        setDisplaySrc(src);
        setAnimate(false);
      }, 300); // Duration of the animation in ms
      return () => clearTimeout(timeout);
    }
  }, [src, displaySrc]);

  return (
    <div
      className={`rounded-md overflow-hidden transform transition-all duration-300 ${
        animate ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <InnerImageZoom src={displaySrc} zoomType="hover" zoomScale={1} />
    </div>
  );
};

export default ProductZoom;
