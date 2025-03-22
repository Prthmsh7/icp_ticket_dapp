import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center text-center py-20"
    >
      <div className="text-9xl font-display font-bold text-primary">404</div>
      <h1 className="text-4xl font-display font-semibold mt-6 mb-4">Page Not Found</h1>
      <p className="text-xl text-gray-400 max-w-md mb-12">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn btn-primary py-3 px-8 text-base rounded-lg"
      >
        Return Home
      </Link>
    </motion.div>
  );
};

export default NotFoundPage; 