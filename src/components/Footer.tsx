import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      Ticketbox Terminal {currentYear} powered by Soxfort Solutions
    </footer>
  );
};

export default Footer;