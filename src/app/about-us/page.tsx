"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const AboutUsPage: React.FC = () => {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  // Subtle rotation and scale on scroll for a gentle animated effect
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a20] to-[#20b2aa]/20 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        style={{ rotate, scale }}
        className="relative h-screen flex items-center justify-center bg-gradient-to-br from-[#20b2aa]/20 to-[#7fffd4]/20 backdrop-blur-xl"
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#20b2aa] rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-center z-10 "
        >
          <h1 className="text-5xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#20b2aa] to-[#7fffd4] mb-8">
            Shopsphere
          </h1>
          <motion.p
            className="text-xl md:text-3xl text-gray-200 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            A fully integrated e-commerce platform that empowers you to buy and
            sell products seamlessly—enhanced by an AI assistant for interactive
            support.
          </motion.p>
          <Button
          className="mt-6"
          onClick={() => router.push("/")}>Return to Home</Button>
        </motion.div>
      </motion.section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-[#001220] mb-10"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Story
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto text-justify"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            viewport={{ once: true }}
          >
            Shopsphere was born from a vision to revolutionize online commerce.
            By integrating cutting-edge technologies such as Next.js, Node.js,
            Express, Prisma, and PostgreSQL, we built a platform that is robust,
            secure, and delightfully intuitive. Our advanced admin panel and
            integrated AI assistant enable seamless buying and selling
            experiences while offering real-time, intelligent support to both
            businesses and customers.
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#20b2aa]/10 to-[#7fffd4]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Seamless Commerce",
              description:
                "Experience effortless transactions with a user-friendly interface.",
              icon: "🛒",
            },
            {
              title: "Interactive AI Assistant",
              description:
                "Get real-time support and personalized recommendations through our smart chat.",
              icon: "🤖",
            },
            {
              title: "Robust Infrastructure",
              description:
                "Built with modern tech ensuring speed, security, and scalability.",
              icon: "⚙️",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-8 bg-white rounded-xl shadow-md border border-gray-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-[#001220] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-800 mb-10"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Technology
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Next.js & React",
              "Node.js & Express",
              "Prisma & PostgreSQL",
              "Stripe Payment Integration",
              "AI Chatbot Integration",
              "Advanced Admin Panel",
            ].map((tech, i) => (
              <motion.div
                key={i}
                className="p-6 bg-gradient-to-br from-[#20b2aa]/20 to-[#7fffd4]/20 rounded-xl shadow-sm text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <p className="text-lg font-medium text-gray-800">{tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#20b2aa]/10 to-[#7fffd4]/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Vision & Mission
          </motion.h2>
          <motion.p
            className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            viewport={{ once: true }}
          >
            We aim to redefine online commerce by creating a seamless and
            intelligent shopping experience. Our mission is to empower
            businesses and customers through innovation, advanced technology,
            and exceptional service.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
