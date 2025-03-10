"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PaymentFailedPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-red-50 p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-red-600 mb-6"
      >
        <FaTimesCircle className="w-32 h-32" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-bold text-red-600 mb-4"
      >
        Payment Failed
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg md:text-xl text-gray-700 max-w-2xl text-center mb-8"
      >
        Unfortunately, your transaction could not be processed. Please try again or contact support if the issue persists.
      </motion.p>
      <Button
        onClick={() => router.push("/checkout")}
        className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold rounded-lg shadow-lg transition-transform"
      >
        Retry Payment
      </Button>
    </div>
  );
};

export default PaymentFailedPage;
