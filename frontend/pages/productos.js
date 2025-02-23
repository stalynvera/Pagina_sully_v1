import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react"; // Importa el icono de carrito
import api from "../utils/api";
import { useCarrito } from "../context/CarritoContext"; // Importa el contexto del carrito

export default function Productos() {
  const { carrito, agregarAlCarrito } = useCarrito(); // Usa el carrito desde el contexto
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Para manejar la imagen seleccionada
  const [mensaje, setMensaje] = useState(""); // Estado para manejar el mensaje de éxito

  useEffect(() => {
    api.get("productos/")
      .then(response => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener productos:", error);
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      });
  }, []);

  // Función para manejar el clic en la imagen
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Setea la imagen seleccionada para mostrarla más grande
  };

  // Función para agregar el producto al carrito
  const handleAgregarAlCarrito = (producto) => {
    agregarAlCarrito(producto); // Llama a la función para agregar al carrito
    setMensaje("Producto agregado correctamente al carrito"); // Muestra el mensaje
    setTimeout(() => {
      setMensaje(""); // Oculta el mensaje después de 3 segundos
    }, 3000);
  };

  if (loading) return <p className="text-center mt-10 text-black">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-gray-900" 
      style={{ backgroundImage: 'url(/images/fondo.png)' }}
    >
      {/* Botones fijos en la parte superior */}
      <div className="fixed top-0 left-0 right-0 bg-[#B1C41B] text-white p-4 flex justify-between items-center z-10 shadow-lg">
        <button
          onClick={() => window.history.back()} // Regresar a la página anterior
          className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Regresar
        </button>
        
        {/* Icono del carrito con la cantidad de productos */}
        <button
          onClick={() => window.location.href = "/carrito"} // Redirige a la página del carrito
          className="relative p-3 bg-[#8B9424] rounded-xl hover:bg-[#8B9424] transition duration-300 transform hover:scale-105 shadow-lg"
        >
          <ShoppingCart size={24} />
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {carrito.length}
            </span>
          )}
        </button>

        <button
          onClick={() => window.location.href = "/"} // Redirige a la página de inicio
          className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Regresar al Inicio
        </button>
      </div>

      {mensaje && (
  <div 
    className="fixed bottom-16 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg z-20"
    style={{ backgroundColor: "#B1C41B" }}
  >
    <p>{mensaje}</p>
  </div>
)}


      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <h1 className="text-4xl font-extrabold text-center text-[#B1C41B] mb-8">
          Productos Disponibles
        </h1>

        {/* Contenedor de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white p-4 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl"
                style={{ width: "280px", height: "280px" }} // Aumentamos el tamaño de los cuadros
              >
                {/* Imagen del producto */}
                <img
                  src={producto.imagen} // URL de la imagen directamente desde la API
                  alt={producto.nombre}
                  className="w-full h-full object-cover mb-4 rounded-lg border-2 border-[#8B9424] cursor-pointer"
                  onClick={() => handleImageClick(producto.imagen)} // Mostrar la imagen en grande al hacer clic
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{producto.nombre}</h2>
                <p className="text-gray-600 text-sm mb-4">{producto.descripcion}</p>
                <p className="text-[#B1C41B] text-lg font-bold">${producto.precio}</p>
                <button 
                  onClick={() => handleAgregarAlCarrito(producto)} // Agregar al carrito
                  className="mt-4 w-full py-3 bg-[#B1C41B] text-white rounded-lg shadow-lg hover:bg-[#B1C41B] transition duration-300 transform hover:scale-105"
                >
                  Agregar al carrito
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-800">No hay productos disponibles.</p>
          )}
        </div>
      </div>

      {/* Modal para mostrar imagen ampliada */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
          <div className="bg-white p-4 rounded-lg shadow-lg w-auto h-auto max-w-4xl mx-auto">
            <img 
              src={selectedImage} 
              alt="Imagen ampliada" 
              className="w-full h-auto max-h-screen object-contain rounded-lg" 
              style={{ objectFit: "contain" }} // Ajuste para que se ajuste según el zoom
            />
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
              style={{ zIndex: 30 }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
