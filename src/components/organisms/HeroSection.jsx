import React, { useState, useEffect } from "react";

export const HeroSection = ({
    images = [],
    logo = null,
    title = "",
    subtitle = "",
    textPosition = "center", // Opciones: "center", "left", "right", "top", "bottom", o valores específicos como "top-10 left-5"
    interval = 5000, // Intervalo del carrusel en ms
    height = "calc(100vh - 4rem)",
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Si no hay imágenes, mostrar una por defecto
    const imageList = images.length > 0 ? images : ["/default-background.jpg"];

    // Carrusel de imágenes
    useEffect(() => {
        if (imageList.length <= 1) return;

        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
        }, interval);

        return () => clearInterval(intervalId);
    }, [imageList.length, interval]);

    // Manejar la posición del texto
    const getPositionClasses = () => {
        // Mapeo de posiciones predefinidas
        const positionMap = {
            center: "items-center justify-center",
            left: "items-center justify-start pl-10",
            right: "items-center justify-end pr-10",
            top: "items-start justify-center pt-10",
            bottom: "items-end justify-center pb-10",
        };

        // Si es una posición predefinida, devolver las clases correspondientes
        if (positionMap[textPosition]) {
            return positionMap[textPosition];
        }

        // Si es un valor personalizado, asumimos que son clases directas de tailwind
        return textPosition;
    };

    // Navegación manual del carrusel
    const goToSlide = (index) => {
        setCurrentImageIndex(index);
    };

    // Botones de navegación para el carrusel
    const prevSlide = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % imageList.length
        );
    };

    return (
        <div className="relative overflow-hidden" style={{ height }}>
            {/* Carrusel de imágenes de fondo */}
            <div className="absolute inset-0">
                {imageList.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50" />
                    </div>
                ))}
            </div>

            {/* Contenido del hero */}
            <div className={`relative z-10 flex flex-col h-full text-white px-4 ${getPositionClasses()}`}>

                {title && (
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 animate-fade-in-up">
                        {title}
                    </h1>
                )}

                {logo && (
                    <div className="mb-8">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-32 h-32 object-contain animate-bounce-slow"
                        />
                    </div>
                )}

                {subtitle && (
                    <p className="text-xl md:text-2xl text-center mb-8 animate-fade-in-up delay-150">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Controles del carrusel (sólo visibles si hay más de una imagen) */}
            {imageList.length > 1 && (
                <>
                    {/* Flechas de navegación */}
                    <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        &#10094;
                    </button>
                    <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        &#10095;
                    </button>

                    {/* Indicadores de slide */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                        {imageList.map((_, index) => (
                            <button
                                key={index}
                                className={`h-2 w-8 rounded-full transition-all ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                                    }`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};