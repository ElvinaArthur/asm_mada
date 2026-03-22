import React from "react";
import { Link } from "react-router-dom";

const FooterLinks = ({ title, links }) => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-white mb-6 relative">
        {title}
        <div className="absolute -bottom-2 left-0 w-10 h-0.5 bg-gradient-to-r from-asm-green-500 to-asm-yellow-500"></div>
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className="group flex items-center text-gray-400 hover:text-white transition-all duration-200"
            >
              <span className="h-px w-0 bg-gradient-to-r from-asm-green-500 to-asm-yellow-500 group-hover:w-4 mr-3 transition-all duration-300"></span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                {link.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinks;
