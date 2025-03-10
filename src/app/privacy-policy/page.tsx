"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PrivacyPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);
  const router = useRouter();

  // Data arrays for policy sections, compliance milestones, and updates
  const policies = [
    {
      title: "Data Collection",
      content:
        "We only collect essential information to provide and improve our services. Your data is used solely for enhancing your experience.",
      icon: "📥",
    },
    {
      title: "Usage & Sharing",
      content:
        "Your data is never sold. We share information only with trusted partners when necessary for service enhancement.",
      icon: "🤝",
    },
    {
      title: "Security Measures",
      content:
        "We implement military-grade encryption and conduct regular security audits to ensure your information is protected.",
      icon: "🛡️",
    },
    {
      title: "Your Rights",
      content:
        "You have full control over your data, including access, correction, and deletion rights at any time.",
      icon: "🔑",
    },
  ];

  const milestones = [
    { year: "2020", milestone: "GDPR Compliance Achieved" },
    { year: "2022", milestone: "CCPA Certification Completed" },
    { year: "2024", milestone: "Global Privacy Standard Implementation" },
  ];

  const policyUpdates = [
    "Last Updated: March 2024",
    "Next Review: September 2024",
    "Version: 4.2",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001220] to-[#20b2aa]/30 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        style={{ scale }}
        className="relative h-[55vh] flex items-center justify-center bg-gradient-to-br from-[#20b2aa]/20 to-[#7fffd4]/20 backdrop-blur-xl"
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
            Your Privacy Matters
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            We practice transparent data handling to build trust and ensure your
            peace of mind.
          </p>
          <Button className="mt-6" onClick={() => router.push("/")}>
            {" "}
            Return to Home
          </Button>
        </motion.div>
      </motion.section>

      {/* Policy Sections */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-2">
          {policies.map((section, i) => (
            <motion.div
              key={section.title}
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
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

      {/* Compliance Timeline */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#20b2aa]/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-gray-100 mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Compliance Journey
          </motion.h2>
          <div className="relative">
            <div className="absolute left-1/2 w-1 h-full bg-gray-300 -translate-x-1/2" />
            {milestones.map((item, i) => (
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
                    <p className="mt-2 text-gray-700">{item.milestone}</p>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#20b2aa] rounded-full -left-8" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Updates */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Policy Updates
            </h2>
            <div className="space-y-4">
              {policyUpdates.map((update) => (
                <div key={update} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#20b2aa] rounded-full" />
                  <span className="text-gray-500">{update}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact & Acceptance */}
      <motion.section
        className="py-40 px-4 text-center bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-6xl font-bold text-[#20b2aa] mb-8">
          Need More Information?
        </h2>
        <Button onClick={() => router.push("/about-us")}>About Us</Button>
        <p className="mt-8 text-gray-500 max-w-2xl mx-auto">
          By using our services, you acknowledge that you have read and
          understood our Privacy Policy.
        </p>
      </motion.section>
    </div>
  );
};

export default PrivacyPage;
