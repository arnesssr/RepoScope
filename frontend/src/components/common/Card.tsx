import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false,
  onClick 
}) => {
  const baseClasses = 'glass rounded-xl p-6 transition-all duration-300';
  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-xl cursor-pointer' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(baseClasses, hoverClasses, className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
