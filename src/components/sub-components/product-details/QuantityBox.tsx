"use client";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import AddToCartButton from "../AddToCartButton";

const QuantityBox = ({
  quantity,
  increment,
  decrement,
  productId,
}: {
  quantity: number;
  increment: () => void;
  decrement: () => void;
  productId: string;
}) => {
  return (
    <div className="flex items-center  gap-6 bg-white ">
      {/* Quantity Controls */}

      <div className="flex  border border-gray-400  ">
        <input
          type="number"
          value={quantity}
          readOnly
          className="w-16 text-center outline-none  "
        />

        <div className="flex flex-col">
          <button
            onClick={increment}
            className="p-1 hover:bg-gray-200 transition-colors duration-100"
          >
            <FaAngleUp size={12} />
          </button>
          <button
            onClick={decrement}
            className=" p-1 hover:bg-gray-200 transition-colors duration-100"
          >
            <FaAngleDown size={12} />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
    
        <AddToCartButton productId={productId} className="w-full bg-primary text-white" />
     
    </div>
  );
};

export default QuantityBox;
