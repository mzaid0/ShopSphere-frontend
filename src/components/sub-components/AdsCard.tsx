import Image, { StaticImageData } from "next/image";
import React from "react";

type Card = {
  image: StaticImageData;
  name: string;
};

const AdsCard = ({ image, name }: Card) => {
  return (
    <div className="bg-white cursor-pointer border border-gray-200 rounded-md w-full overflow-hidden">
      <div className="relative w-full h-48">
        {/* Aspect ratio container for maintaining image proportions */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover hover:scale-105 hover:rotate-1 duration-700"
        />
      </div>
    </div>
  );
};

export default AdsCard;
