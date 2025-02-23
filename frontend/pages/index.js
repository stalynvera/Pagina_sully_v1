import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const targetDate = new Date("2025-04-22T00:00:00"); // Cuenta regresiva
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center text-gray-900" style={{ backgroundImage: 'url(/images/fondo.png)' }}>
      {/* Logo en la parte superior izquierda */}
      <div className="absolute top-16 left-6 z-10">
        <img src="/images/logo.png" alt="Logo de InArtPoint" className="w-48 h-auto" /> {/* Logo más grande */}
      </div>

      {/* Navbar */}
      <nav className="bg-green-700/90 backdrop-blur-md text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold">InArtPoint</h1>
          <div className="space-x-6 text-lg">
            <Link href="/productos" className="hover:text-gray-300">Productos</Link>
            <Link href="/categorias" className="hover:text-gray-300">Categorías</Link>
            <Link href="#sobre-nosotros" className="hover:text-gray-300">Sobre Nosotros</Link>
            <Link href="#redes-sociales" className="hover:text-gray-300">Redes Sociales</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24">
        <div className="bg-white/90 backdrop-blur-lg p-10 rounded-lg shadow-xl inline-block text-gray-800">
          <h2 className="text-5xl font-extrabold">Bienvenido a InArtPoint</h2>
          <p className="text-lg mt-4">Encuentra los mejores productos de arte y diseño para tu hogar y oficina.</p>
          <Link href="/productos" className="mt-6 inline-block py-3 px-8 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition">
            Ver Productos
          </Link>
        </div>
      </section>

      {/* Sobre Nosotros */}
      <section id="sobre-nosotros" className="py-20">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl font-semibold mb-8 text-green-700">Sobre Nosotros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200/90 backdrop-blur-lg p-6 rounded-lg shadow-lg">
              <p className="text-xl">
                En InArtPoint, creemos que cada detalle importa y que los momentos especiales merecen ser únicos. Nos apasiona crear productos personalizados que reflejen tu estilo, emociones e ideas, convirtiéndolos en algo más que simples objetos: verdaderas experiencias significativas.
              </p>
            </div>
            <div className="bg-gray-200/90 backdrop-blur-lg p-6 rounded-lg shadow-lg">
              <p className="text-xl">
                Ofrecemos una amplia variedad de artículos personalizados, desde glass cans, termos, camisetas, tazas y cuadros, entre otros. Cada pieza es diseñada con dedicación y fabricada con materiales de alta calidad para garantizar un acabado excepcional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Redes Sociales */}
      <section id="redes-sociales" className="py-20 text-center">
        <h2 className="text-4xl font-semibold mb-6 text-green-700">Síguenos en Redes Sociales</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center">
          {[
            { href: "https://www.facebook.com/share/19z2BQYsUe/", src: "/images/facebook.png", alt: "Facebook", name: "InArtPoint" },
            { href: "https://www.instagram.com/inartpoint?igsh=MTJ3cWR4cmg0ZnZ0bw==", src: "/images/instagram.png", alt: "Instagram", name: "InArtPoint" },
            { href: "mailto:inartpoint@gmail.com?subject=Consulta&body=Hola, quisiera más información.", src: "/images/gmail.png", alt: "Gmail", name: "inartpoint@gmail.com" },
            { href: "https://www.tiktok.com/@inartpoint?_t=ZM-8u8jpMRErtV&_r=1", src: "/images/tik-tok.png", alt: "TikTok", name: "@inartpoint" },
          ].map(({ href, src, alt, name }) => (
            <div key={alt} className="flex flex-col items-center">
              <a href={href} target="_blank" rel="noopener noreferrer" className="transition duration-300 hover:scale-110 transform">
                <img src={src} alt={alt} className="w-16 h-16 object-contain mx-auto" />
              </a>
              <p className="mt-2 text-xl font-bold text-gray-800">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cuenta Regresiva */}
      <div className="absolute top-10 right-10 bg-gray-200/90 backdrop-blur-lg p-6 rounded-lg shadow-lg w-72 text-center">
        <h3 className="text-3xl font-semibold text-green-700">Próximamente</h3>
        <div className="mt-4 text-3xl font-bold text-gray-800">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-800 py-6 bg-green-700/90 backdrop-blur-md text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 InArtPoint. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
