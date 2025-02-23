import { useEffect, useState, useMemo } from "react";
import api from "../utils/api";
import { useCarrito } from "../context/CarritoContext";
import { ShoppingCart } from "lucide-react";

export default function Productos() {
  const { carrito, agregarAlCarrito } = useCarrito();
  
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Pre-cargar las categorías al principio
  useEffect(() => {
    api.get("categorias/")
      .then(response => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener categorías:", error);
        setError("No se pudieron cargar las categorías.");
        setLoading(false);
      });
  }, []);

  // Optimización con useMemo para los productos de una categoría
  const productosMemo = useMemo(() => productos, [productos]);

  // Cargar los productos solo cuando se selecciona una categoría
  useEffect(() => {
    if (selectedCategoria) {
      setLoading(true);
      setProductos([]);  // Resetear productos
      api.get(`productos/?categoria=${selectedCategoria}`)
        .then(response => {
          setProductos(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al obtener productos:", error);
          setError("No se pudieron cargar los productos.");
          setLoading(false);
        });
    }
  }, [selectedCategoria]);

  // Función para manejar el clic en la imagen
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

 // Función para agregar el producto al carrito
 const handleAgregarAlCarrito = (producto) => {
  agregarAlCarrito(producto); // Llama a la función para agregar al carrito
  setMensaje("Producto agregado correctamente al carrito"); // Muestra el mensaje
  setTimeout(() => {
    setMensaje(""); // Oculta el mensaje después de 3 segundos
  }, 3000);
};


  if (loading) return <p className="text-center mt-10 text-white">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-gray-900" 
      style={{ backgroundImage: 'url(/images/fondo.png)' }}
    >
      {/* Barra superior */}
      <div className="fixed top-0 left-0 right-0 bg-[#B1C41B] text-white p-4 flex justify-between items-center z-10 shadow-lg">
        <button
          onClick={() => window.location.href = "/productos"}
          className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Regresar a Productos
        </button>

        <button
          onClick={() => window.location.href = "/carrito"}
          className="relative p-3 bg-[#A1B81C] rounded-xl hover:bg-[#8E9F1A] transition duration-300 transform hover:scale-105 shadow-lg"
        >
          <ShoppingCart size={24} />
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {carrito.length}
            </span>
          )}
        </button>

        <button
          onClick={() => window.location.href = "/"}
          className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Regresar al Inicio
        </button>
      </div>

      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-[#B1C41B] mb-8">Categorías</h1>
        
        {/* Aquí mostramos las categorías con un placeholder */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {categorias.length === 0 ? (
            <div className="p-4 bg-gray-200 rounded-lg shadow-lg text-center">Cargando categorías...</div>
          ) : (
            categorias.map((categoria) => (
              <button
                key={categoria.id}
                className="p-2 bg-white rounded-lg shadow-lg text-center text-black hover:bg-[#B1C41B] transition duration-300 transform hover:scale-105"
                onClick={() => setSelectedCategoria(categoria.id)}
              >
                <h2 className="font-semibold text-sm">{categoria.nombre}</h2>
              </button>
            ))
          )}
        </div>

        {mensaje && (
  <div 
    className="fixed bottom-16 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg z-20"
    style={{ backgroundColor: "#B1C41B" }}
  >
    <p>{mensaje}</p>
  </div>
)}


        {/* Mostrar productos solo cuando se selecciona una categoría */}
        {selectedCategoria && (
          <>
            <h2 className="text-3xl font-extrabold mb-6 text-center text-[#B1C41B]">Productos en esta categoría</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {productosMemo.map((producto) => (
                <div key={producto.id} className="bg-white p-4 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl" style={{ width: "280px", height: "280px" }}>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-cover mb-4 rounded-lg border-2 border-[#B1C41B] cursor-pointer"
                    onClick={() => handleImageClick(producto.imagen)}
                  />
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{producto.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-4">{producto.descripcion}</p>
                  <p className="text-[#B1C41B] font-bold text-xl">${producto.precio}</p>
                  <button 
                    onClick={() => handleAgregarAlCarrito(producto)}
                    className="mt-4 w-full py-2 bg-[#B1C41B] text-white rounded-lg hover:bg-[#A1B81C] transition duration-300 transform hover:scale-105"
                  >
                    Agregar al carrito
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal para mostrar imagen ampliada */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
          <div className="bg-white p-4 rounded-lg shadow-lg w-auto h-auto max-w-4xl mx-auto">
            <img 
              src={selectedImage} 
              alt="Imagen ampliada" 
              className="w-full h-auto max-h-screen object-contain rounded-lg" 
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
