"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-cyan-100 p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-primary mb-6"
      >
        <FaCheckCircle className="w-32 h-32" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-bold text-primary mb-4"
      >
        Payment Successful!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg md:text-xl text-gray-700 max-w-2xl text-center mb-8"
      >
        Thank you for your purchase. Your transaction has been processed
        successfully.
      </motion.p>
      <Button onClick={() => router.push("/product-list")}>
        Continue Shopping
      </Button>
    </div>
  );
};

export default PaymentSuccessPage;
