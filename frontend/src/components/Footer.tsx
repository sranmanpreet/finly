import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-white shadow mt-8 py-4 text-center text-gray-500 text-sm">
    &copy; {new Date().getFullYear()} CatagoryBuilder &mdash; 
    <a href="https://github.com/sranmanpreet/catagorybuilder" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
      GitHub
    </a>
    <span className="mx-2">|</span>
    <a href="#" className="hover:underline">Privacy Policy</a>
    <span className="mx-2">|</span>
    <a href="#" className="hover:underline">Help</a>
  </footer>
);

export default Footer;