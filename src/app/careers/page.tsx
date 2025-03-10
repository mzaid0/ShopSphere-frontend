"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const CareersPage: React.FC = () => {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  const jobs = [
    {
      title: "Senior AI Engineer",
      type: "Full-time",
      location: "Remote",
      description:
        "Develop and optimize advanced AI models to power our e-commerce innovations.",
    },
    {
      title: "Growth Marketing Lead",
      type: "Hybrid",
      location: "New York",
      description:
        "Drive user acquisition and build innovative marketing strategies on a global scale.",
    },
    {
      title: "DevOps Architect",
      type: "Full-time",
      location: "San Francisco",
      description:
        "Design and maintain scalable, secure infrastructure for our rapidly growing platform.",
    },
  ];

  const benefits = [
    {
      icon: "💎",
      title: "Competitive Salary",
      text: "Top-tier industry packages",
    },
    {
      icon: "🌍",
      title: "Global Team",
      text: "Collaborate with experts worldwide",
    },
    { icon: "🚀", title: "Growth Budget", text: "$5k annual learning fund" },
    { icon: "⏰", title: "Flex Hours", text: "Results-focused work schedule" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001220] to-[#20b2aa]/20 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        style={{ rotate, scale }}
        className="relative h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#20b2aa]/20 to-[#7fffd4]/20 backdrop-blur-xl"
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#20b2aa] rounded-full"
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
          className="text-center z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#20b2aa] to-[#7fffd4] mb-6">
            Join Shopsphere
          </h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Be part of a revolutionary e-commerce platform powered by
            cutting-edge AI and innovative technology.
          </motion.p>

          <Button className="mt-6" onClick={() => router.push("/")}>
            {" "}
            Return to Home
          </Button>
        </motion.div>
      </motion.section>

      {/* Core Values Section */}
      <section className="py-20 px-4 bg-white text-gray-600">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 ">
          {["Innovation", "Collaboration", "Impact"].map((value, i) => (
            <motion.div
              key={value}
              className="p-8 bg-gradient-to-br from-[#20b2aa]/10 to-transparent backdrop-blur-xl rounded-2xl border border-[#20b2aa]/20 relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-[#20b2aa] text-4xl mb-4">◆</div>
              <h3 className="text-2xl font-bold mb-4">{value}</h3>
              <p className="text-gray-400">
                {
                  {
                    Innovation: "Pioneering AI-driven solutions every day",
                    Collaboration: "A global team united by innovative ideas",
                    Impact: "Transforming lives and commerce worldwide",
                  }[value]
                }
              </p>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#20b2aa/5,transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#20b2aa]/10 to-[#7fffd4]/10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-white mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Current Opportunities
          </motion.h2>
          <div className="space-y-6">
            {jobs.map((job, i) => (
              <motion.div
                key={job.title}
                className="group p-8 bg-gradient-to-br from-[#20b2aa]/10 to-transparent backdrop-blur-xl rounded-2xl border border-[#20b2aa]/20 relative overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {job.title}
                    </h3>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[#20b2aa]">{job.location}</span>
                      <span className="text-gray-400">{job.type}</span>
                    </div>
                  </div>
                  <button
                    className="mt-4 md:mt-0 px-6 py-2 bg-[#20b2aa] rounded-full text-white font-medium hover:bg-[#7fffd4] transition-colors"
                    onClick={() => router.push("/careers/apply")}
                  >
                    Apply Now
                  </button>
                </div>
                <motion.div
                  className="overflow-hidden"
                  initial={{ height: 0 }}
                  whileHover={{ height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mt-4 text-gray-400">{job.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-[#001220] mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Why Work With Us?
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                className="p-6 bg-gradient-to-br from-[#20b2aa]/10 to-transparent backdrop-blur-xl rounded-2xl border border-[#20b2aa]/20 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-[#001220] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Timeline Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#20b2aa]/10 to-[#7fffd4]/10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-white mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Journey
          </motion.h2>
          <div className="relative">
            <div className="absolute left-1/2 w-1 h-full bg-gradient-to-b from-[#20b2aa] to-transparent -translate-x-1/2" />
            {[
              { year: "2020", milestone: "AI Commerce Platform Launched" },
              { year: "2022", milestone: "1M+ Active Users Reached" },
              { year: "2024", milestone: "Global Team Expansion" },
            ].map((item, i) => (
              <motion.div
                key={item.year}
                className={`relative mb-20 w-full ${
                  i % 2 === 0 ? "pr-20" : "pl-20"
                }`}
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`max-w-md ${i % 2 === 0 ? "ml-auto" : ""}`}>
                  <div className="p-6 bg-white text-gray-700 backdrop-blur-xl rounded-2xl border border-[#20b2aa]/20">
                    <div className=" text-2xl text-primary">{item.year}</div>
                    <div className=" text-lg mt-2">
                      {item.milestone}
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#20b2aa] rounded-full -left-8" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
