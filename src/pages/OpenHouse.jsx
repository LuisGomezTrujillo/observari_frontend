import React, { useState, useEffect, useRef } from "react";
import LogoImg from "../assets/LogoCasaDelBambino.png";
import { Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";

export const OpenHouse = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // URL del video de YouTube (reemplaza VIDEO_ID con el ID real del video)
  const YOUTUBE_VIDEO_ID = "I0SEqMJVc20"; // Placeholder - reemplazar con el ID real
  const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0`;
  //const YOUTUBE_EMBED_URL ="https:youtu.be/I0SEqMJVc20"

  // URL del formulario de Google Forms (reemplazar con la URL real)
  const GOOGLE_FORM_URL = "https://forms.gle/rifhbD6ufMG12P5SA"; // Placeholder - reemplazar con la URL real

  useEffect(() => {
    // Ocultar controles después de 3 segundos de inactividad
    const hideControlsTimer = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    hideControlsTimer();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      } else {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
      }
      setIsMuted(!isMuted);
    }
  };

  const handleFormClick = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header con Logo */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="flex justify-center">
          <img 
            src={LogoImg} 
            alt="Logo Casa del Bambino" 
            className="h-16 w-auto sm:h-20 md:h-24 object-contain"
          />
        </div>
      </header>

      {/* Contenedor principal del video */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 landscape:py-2">
        <div className="w-full max-w-4xl mx-auto landscape:max-w-6xl landscape:flex landscape:items-center landscape:space-x-8">
          
          {/* Título */}
          <div className="text-center mb-6 sm:mb-8 landscape:text-left landscape:flex-1 landscape:mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl landscape:text-2xl font-bold text-gray-800 mb-2 sm:mb-4 landscape:mb-2">
              Fundación Casa del Bambino
            </h1>
            <p className="text-base sm:text-lg md:text-xl landscape:text-base text-gray-600 px-4 landscape:px-0">
              Educación Montessori para el desarrollo integral de tu hijo
            </p>
            
            {/* Call to Action en modo landscape */}
            <div className="hidden landscape:block mt-6">
              <button
                onClick={handleFormClick}
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm"
              >
                <span className="mr-2">Diligenciar Formulario</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              
              <p className="text-sm text-gray-600 mt-3">
                Completa nuestro formulario para conocer más sobre nuestros programas educativos
              </p>
            </div>
          </div>

          {/* Contenedor del Video - Optimizado para video vertical */}
          <div 
            className="relative bg-black rounded-lg overflow-hidden shadow-2xl mb-6 sm:mb-8 landscape:mb-0 mx-auto landscape:flex-shrink-0"
            onMouseMove={handleMouseMove}
            onTouchStart={() => setShowControls(true)}
            style={{ maxWidth: '400px', width: '100%' }} // Limita el ancho máximo para video vertical
          >
            {/* Aspect ratio container para video vertical 9:16 */}
            <div className="relative w-full" style={{ paddingBottom: '177.78%' /* 16:9 invertido para vertical */ }}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-sm">Cargando video...</p>
                  </div>
                </div>
              )}
              
              <iframe
                ref={videoRef}
                src={YOUTUBE_EMBED_URL}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoLoad}
                title="Video Casa del Bambino"
              />

              {/* Controles personalizados mejorados */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-between transition-opacity duration-300 pointer-events-none ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Indicador de estado superior */}
                <div className="flex justify-between items-center p-4 pointer-events-auto">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-white text-xs font-medium">
                      {isPlaying ? 'Reproduciendo' : 'Pausado'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-1 h-1 rounded-full ${isMuted ? 'bg-gray-400' : 'bg-green-400'}`}></div>
                    <span className="text-white text-xs">
                      {isMuted ? 'Sin sonido' : 'Con sonido'}
                    </span>
                  </div>
                </div>

                {/* Controles centrales */}
                <div className="flex items-center justify-center pointer-events-auto">
                  <div className="flex items-center space-x-6 bg-black/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                    <button
                      onClick={togglePlay}
                      className="group relative bg-white/10 hover:bg-white/20 rounded-full p-4 transition-all duration-200 active:scale-95"
                    >
                      <div className="absolute inset-0 rounded-full bg-white/5 group-hover:bg-white/10 transition-all duration-200"></div>
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-white relative z-10" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1 relative z-10" />
                      )}
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="group relative bg-white/10 hover:bg-white/20 rounded-full p-4 transition-all duration-200 active:scale-95"
                    >
                      <div className="absolute inset-0 rounded-full bg-white/5 group-hover:bg-white/10 transition-all duration-200"></div>
                      {isMuted ? (
                        <VolumeX className="w-6 h-6 text-white relative z-10" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-white relative z-10" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Espacio inferior para evitar superposición */}
                <div className="h-16"></div>
              </div>
            </div>
          </div>

          {/* Call to Action - Formulario (Solo en modo portrait) */}
          <div className="text-center landscape:hidden">
            <button
              onClick={handleFormClick}
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
            >
              <span className="mr-2">Diligenciar Formulario</span>
              <ExternalLink className="w-5 h-5" />
            </button>
            
            <p className="text-sm sm:text-base text-gray-600 mt-4 px-4">
              Completa nuestro formulario para conocer más sobre nuestros programas educativos
            </p>
          </div>
        </div>
      </main>

      {/* Footer opcional */}
      <footer className="text-center p-4 sm:p-6 text-gray-500 text-sm">
        <p>&copy; 2025 Fundación Casa del Bambino. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};