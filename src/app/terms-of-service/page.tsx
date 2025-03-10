"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const TermsPage: React.FC = () => {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  // Data for the main sections of the Terms
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: "✅",
      content:
        "By accessing or using ShopSphere services, you agree to be bound by these Terms. Your continued use signifies your acceptance of our policies.",
    },
    {
      title: "User Responsibilities",
      icon: "🔐",
      content:
        "Users must provide accurate information, maintain account security, and comply with all applicable laws and regulations.",
    },
    {
      title: "Transactions",
      icon: "💳",
      content:
        "All purchases are subject to availability and payment verification. Any fraudulent activity may result in account suspension.",
    },
    {
      title: "Intellectual Property",
      icon: "⚖️",
      content:
        "All content on ShopSphere is the property of ShopSphere or its licensors. Unauthorized use is strictly prohibited.",
    },
    {
      title: "Termination",
      icon: "⛔",
      content:
        "We reserve the right to suspend or terminate accounts for violations of these terms or any fraudulent activity.",
    },
    {
      title: "Governing Law",
      icon: "🌍",
      content:
        "These Terms are governed by the laws of [Your Jurisdiction] without regard to its conflict of law principles.",
    },
  ];

  // Timeline data for policy evolution
  const timeline = [
    { year: "2020", update: "Initial Terms Published" },
    { year: "2022", update: "Global Compliance Update" },
    { year: "2024", update: "AI Governance Addendum" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001220] to-[#20b2aa]/30 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        style={{ scale }}
        className="relative h-[45vh] flex items-center justify-center bg-gradient-to-br from-[#20b2aa]/20 to-[#7fffd4]/20 backdrop-blur-xl"
      >
        <div className="absolute inset-0 opacity-30">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-[#20b2aa] rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <motion.div
          className="text-center z-10 px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#20b2aa] to-[#7fffd4]">
            Terms of Service
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            Effective Date: March 2024 | Version 3.2
          </p>
          <Button className="mt-6" onClick={() => router.push("/")}>
            {" "}
            Return to Home
          </Button>
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{section.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Legal Timeline */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#20b2aa]/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-gray-100 mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Policy Evolution
          </motion.h2>
          <div className="relative">
            <div className="absolute left-1/2 w-1 h-full bg-gray-300 -translate-x-1/2" />
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className={`relative mb-16 w-full ${
                  i % 2 === 0 ? "pr-20" : "pl-20"
                }`}
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div className={`max-w-md ${i % 2 === 0 ? "ml-auto" : ""}`}>
                  <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 relative">
                    <div className="text-xl font-semibold text-[#20b2aa]">
                      {item.year}
                    </div>
                    <p className="mt-2 text-gray-700">{item.update}</p>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#20b2aa] rounded-full -left-8" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Clauses */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">
          {[
            {
              title: "Limitation of Liability",
              content:
                "ShopSphere shall not be liable for indirect, incidental, or consequential damages arising from the use of our services.",
              icon: "⚠️",
            },
            {
              title: "Dispute Resolution",
              content:
                "Any disputes will be resolved through binding arbitration in accordance with the applicable laws.",
              icon: "⚖️",
            },
            {
              title: "Amendments",
              content:
                "We reserve the right to modify these terms at any time. Updated terms will be posted on our website.",
              icon: "📝",
            },
          ].map((clause, i) => (
            <motion.div
              key={clause.title}
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{clause.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {clause.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {clause.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Acceptance Section */}
      <motion.section
        className="py-40 px-4 text-center bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold text-[#20b2aa] mb-8">
          Your Agreement
        </h2>
        <div className="max-w-2xl mx-auto text-gray-600 mb-12">
          By using our services, you confirm that you have read, understood, and
          agree to be bound by these Terms of Service.
        </div>
        <div className="space-x-6">
          <Button onClick={() => router.push("/register")}>Register</Button>
          <Button variant="outline" onClick={() => router.push("/login")}>
            Login
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default TermsPage;
