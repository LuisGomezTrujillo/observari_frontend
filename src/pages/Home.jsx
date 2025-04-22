import React, { useState } from "react";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import FundacionImg from "../assets/FundacionCasaDelBambino.jpg";
import LogoImg from "../assets/LogoCasaDelBambino.png";

export const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
  <div className="absolute inset-0">
    <img
      src={FundacionImg}
      alt="Fundación Casa del Bambino"
      className="w-full h-full object-cover animate-fade-in"
    />
    <div className="absolute inset-0 bg-black/50" />
  </div>

  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
    <img
      src={LogoImg}
      alt="Logo Casa del Bambino"
      className="w-32 h-32 mb-8 animate-bounce-slow"
    />

    <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 animate-fade-in-up">
      Bienvenidos a la Fundación Casa del Bambino
    </h1>

    <p className="text-xl md:text-2xl text-center mb-8 animate-fade-in-up delay-150">
      Un lugar donde los sueños se hacen realidad
    </p>
  </div>
</div>

      {/* Fixed Bottom Buttons */ }
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 flex justify-center gap-4">
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

      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      <Register 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </div >
  );
};