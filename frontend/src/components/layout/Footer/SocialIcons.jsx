import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
} from "lucide-react";

const SocialIcons = () => {
  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "https://facebook.com/asm",
      label: "Facebook",
      color: "hover:bg-[#1877F2] hover:border-[#1877F2]",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com/asm",
      label: "Twitter",
      color: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]",
      gradient: "from-sky-500 to-sky-600",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com/company/asm",
      label: "LinkedIn",
      color: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
      gradient: "from-blue-700 to-blue-800",
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com/asm",
      label: "Instagram",
      color:
        "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F56040] hover:border-transparent",
      gradient: "from-[#833AB4] via-[#FD1D1D] to-[#F56040]",
    },
    {
      icon: <Youtube className="w-5 h-5" />,
      href: "https://youtube.com/asm",
      label: "YouTube",
      color: "hover:bg-[#FF0000] hover:border-[#FF0000]",
      gradient: "from-red-500 to-red-600",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:newsletter@asm.mg",
      label: "Newsletter",
      color:
        "hover:bg-gradient-to-r hover:from-asm-green-500 hover:to-asm-yellow-500 hover:border-transparent",
      gradient: "from-asm-green-500 to-asm-yellow-500",
    },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            relative group w-12 h-12 flex items-center justify-center 
            rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 
            text-white transition-all duration-300 hover:shadow-2xl
            ${social.color}
          `}
          aria-label={social.label}
        >
          {/* Hover background effect */}
          <div
            className={`
            absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
            bg-gradient-to-br ${social.gradient} transition-opacity duration-300
          `}
          />

          {/* Icon */}
          <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
            {social.icon}
          </div>

          {/* Glow effect on hover */}
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
