import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img 
      src="https://i.ibb.co/S7cwbM1Z/dde9afc1-9264-4e4c-b70a-6db4f9cc1285.png" 
      alt="Theory Test Bangla Logo" 
      className={className}
      referrerPolicy="no-referrer"
      onError={(e) => {
        // Fallback if the link is broken or restricted
        e.currentTarget.src = "https://api.dicebear.com/7.x/initials/png?seed=TTB&backgroundColor=059669";
      }}
    />
  );
};
