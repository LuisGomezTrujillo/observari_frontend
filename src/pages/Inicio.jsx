// src/pages/Inicio.jsx
import React from "react";
import { motion } from "framer-motion";
import LogoBambino from "../assets/Logo.png"; // Asegúrate de tener la imagen aquí

export const Inicio = () => (
  <div className="text-center mt-20 px-4">
    <motion.img
      src={LogoBambino}
      alt="Logo Bambino"
      className="mx-auto mb-6 w-40 h-auto"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    />
    <motion.h1
      className="text-3xl font-bold text-blue-700"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      Bienvenido a la Casa del Bambino
    </motion.h1>
  </div>
);

// import React from "react";

// export const Inicio = () => (
//   <div className="text-center mt-20 text-3xl font-bold text-blue-700">
//     Bienvenido a la Casa del Bambino
//   </div>
// );