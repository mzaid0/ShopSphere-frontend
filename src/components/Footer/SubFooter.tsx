import React from "react";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const iconData = [
  { icon: <FaHome />, title: "Home", description: "Your home for everything!" },
  {
    icon: <FaInfoCircle />,
    title: "About",
    description: "Learn more about us.",
  },
  {
    icon: <FaEnvelope />,
    title: "Contact",
    description: "We'd love to hear from you!",
  },
  {
    icon: <FaPhone />,
    title: "Call Us",
    description: "We're available for you 24/7.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Location",
    description: "Find us at our office.",
  },
];

const SubFooter = () => {
  return (
    <div className="bg-white my-4">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-8">
          {iconData.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-6 cursor-pointer 
              transform transition-all duration-300 hover:-translate-y-2 hover:shadow-md rounded-xl"
            >
              <div className="text-4xl mb-4 text-gray-600 group-hover:text-primary transition-colors">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed px-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubFooter;
