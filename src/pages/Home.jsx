import React, { useState } from "react";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import Fundacion1Img from "../assets/fundacion1.jpg";
import Fundacion2Img from "../assets/fundacion2.jpg"; // Añadir más imágenes para el carrusel
import Fundacion3Img from "../assets/fundacion3.jpg"; 
import LogoImg from "../assets/LogoCasaDelBambino.png";
import { HeroSection } from "../components/organisms/HeroSection";

export const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // Comprobamos si algún modal está abierto
  const isAnyModalOpen = isLoginOpen || isRegisterOpen;

  const heroImages = [Fundacion1Img, Fundacion2Img, Fundacion3Img];

  return (
    <div className="min-h-screen relative">
      {/* Aplicamos el desenfoque directamente al contenedor principal */}
      <div className={`transition-all duration-300 ${isAnyModalOpen ? "blur-sm" : ""}`}>
        
         <HeroSection 
          images={heroImages}
          title="Bienvenidos a la Fundación Casa del Bambino"
          logo={LogoImg}
          subtitle="Un lugar donde los sueños se hacen realidad"
          textPosition="center" // Puedes usar "center", "left", "right", etc. o valores específicos como "top-10 left-5"
          interval={5000} // Tiempo entre cambios de imagen del carrusel en ms
        />

        {/* Fixed Bottom Buttons */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 flex justify-center gap-4 z-20 ${
          isAnyModalOpen ? "opacity-50 pointer-events-none" : ""
        }`}>
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all"
          >
            Registrarse
          </button>
        </div>
      </div>

      {/* Modales - Fuera del contenedor principal para evitar el desenfoque en ellos */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      <Register 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </div>
  );
};