import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  hover = true,
  glassmorphism = false,
  padding = true,
  ...props 
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : '';
  const glassClasses = glassmorphism ? 'glassmorphism' : 'bg-white shadow-lg border-gray-100';
  const paddingClasses = padding ? 'p-6' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClasses} ${hoverClasses} ${glassClasses} ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
