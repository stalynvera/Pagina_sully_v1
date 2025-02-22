import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // Estado para la cuenta regresiva
  const [timeLeft, setTimeLeft] = useState({});
  
  useEffect(() => {
    const targetDate = new Date("2025-04-22T00:00:00"); // Fecha objetivo para la cuenta regresiva (2 meses desde ahora)
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wide">InArtPoint</h1>
          <div className="space-x-6 text-lg">
            <Link href="/productos" className="hover:text-blue-200 transition duration-300">
              Productos
            </Link>
            <Link href="/categorias" className="hover:text-blue-200 transition duration-300">
              Categorías
            </Link>
            <Link href="#sobre-nosotros" className="hover:text-blue-200 transition duration-300">
              Sobre Nosotros
            </Link>
            <Link href="#redes-sociales" className="hover:text-blue-200 transition duration-300">
              Redes Sociales
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-32">
        <h2 className="text-5xl font-extrabold mb-4">Bienvenido a InArtPoint</h2>
        <p className="text-lg mb-6">Encuentra los mejores productos de arte y diseño para tu hogar y oficina.</p>
        <Link href="/productos" className="mt-6 inline-block py-3 px-8 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-blue-200 transition duration-300">
          Ver Productos
        </Link>
      </section>

      {/* Cuadro de Sobre Nosotros */}
      <section id="sobre-nosotros" className="py-20 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto text-center px-6">
          <h2 className="text-4xl font-semibold mb-8 text-blue-600">Sobre Nosotros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
              <p className="text-xl mb-4">
                En InArtPoint, nos especializamos en ofrecer productos únicos de arte y diseño para quienes buscan darle un toque especial a su espacio.
              </p>
              <p className="text-xl">
                Trabajamos con artistas y diseñadores talentosos para llevar lo mejor del arte contemporáneo a tu hogar.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
              <p className="text-xl mb-4">
                Nuestro compromiso es ofrecer productos de alta calidad con el toque artístico que mereces. ¡Explora nuestra tienda y encuentra piezas que te encantarán!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cuadro de Redes Sociales */}
      <section id="redes-sociales" className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6">Síguenos en Redes Sociales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="transition duration-300 hover:scale-110 transform">
              <img
                src="/images/facebook.png" // Aquí va la ruta de la imagen
                alt="Facebook"
                className="w-16 h-16 object-contain mx-auto"
              />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="transition duration-300 hover:scale-110 transform">
              <img
                src="/images/instagram.png" // Aquí va la ruta de la imagen
                alt="Instagram"
                className="w-16 h-16 object-contain mx-auto"
              />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="transition duration-300 hover:scale-110 transform">
              <img
                src="/images/twitter.png" // Aquí va la ruta de la imagen
                alt="Twitter"
                className="w-16 h-16 object-contain mx-auto"
              />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="transition duration-300 hover:scale-110 transform">
              <img
                src="/images/tik-tok.png" // Aquí va la ruta de la imagen
                alt="LinkedIn"
                className="w-16 h-16 object-contain mx-auto"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Cuenta Regresiva en la esquina (más grande) */}
      <div className="absolute top-10 right-10 bg-blue-600 text-white p-6 rounded-lg shadow-lg w-72">
        <h3 className="text-3xl font-semibold text-center">Próximamente</h3>
        <div className="mt-4 text-3xl text-center">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 InArtPoint. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
