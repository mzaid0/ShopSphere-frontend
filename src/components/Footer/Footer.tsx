import Link from "next/link";
import {
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaGithub,
} from "react-icons/fa";
import SubFooter from "./SubFooter";

const Footer = () => {
  // Define the company links with correct hrefs
  const companyLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ];

  return (
    <>
      <SubFooter />

      <footer className="bg-gradient-to-r from-[#178781] to-[#13615d] text-white pt-16 pb-8">
        <div className="container mx-auto px-4 xl:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Us Column */}
            <div className="mb-8 lg:mb-0">
              <h3 className="text-xl font-bold mb-6 text-white border-b-2 border-[#20b2aa] pb-2">
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <FaPhone className="mr-3 text-lg text-[#20b2aa] shrink-0" />
                  <span className="text-gray-200 hover:text-white transition-colors">
                    +92 315 0323027
                  </span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="mr-3 text-lg text-[#20b2aa] shrink-0" />
                  <a
                    href="mailto:m.zaid.connect@gmail.com" // Updated email href
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    m.zaid.connect@gmail.com
                  </a>
                </li>
                <li className="flex items-center">
                  <FaMapMarkerAlt className="mr-3 text-lg text-[#20b2aa] shrink-0" />
                  <span className="text-gray-200 hover:text-white transition-colors">
                    Jamkey Cheema, Sialkot, Pakistan
                  </span>
                </li>
              </ul>
            </div>

            {/* Our Company Column */}
            <div className="mb-8 lg:mb-0">
              <h3 className="text-xl font-bold mb-6 text-white border-b-2 border-[#20b2aa] pb-2">
                Our Company
              </h3>
              <ul className="space-y-4">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href} // Updated hrefs from additional code
                      className="text-gray-200 hover:text-white transition-colors block hover:translate-x-2 duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Column */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white border-b-2 border-[#20b2aa] pb-2">
                Newsletter
              </h3>
              <p className="text-gray-200 mb-6">
                Get exclusive updates and offers straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#20b2aa] shadow-sm"
                />
                <button
                  type="submit"
                  className="bg-[#20b2aa] hover:bg-[#1da098] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-md whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Social & Payment Section */}
          <div className="mt-16 border-t border-gray-300/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Social Links */}
              <div className="flex space-x-6">
                {[
                  {
                    icon: FaFacebook,
                    color: "#3b5998",
                    url: "https://www.facebook.com/zaid.azmat.1/",
                  },
                  {
                    icon: FaGithub,
                    color: "#24292e",
                    url: "https://github.com/mzaid0",
                  },
                  {
                    icon: FaInstagram,
                    color: "#e1306c",
                    url: "https://www.instagram.com/m_zaid_04/",
                  },
                  {
                    icon: FaLinkedin,
                    color: "#0077b5",
                    url: "https://www.linkedin.com/in/zaidazmat/",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:-translate-y-1 duration-300"
                    style={{ backgroundColor: social.color }}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="flex space-x-6">
                {[FaCcVisa, FaCcMastercard, FaCcPaypal].map((Icon, index) => (
                  <div
                    key={index}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <Icon size={32} />
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 text-center text-gray-300 text-sm">
              <p>
                © {new Date().getFullYear()} Your Company. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
