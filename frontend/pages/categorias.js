import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Productos() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Obtener las categorías
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

  // Cargar los productos de la categoría seleccionada
  useEffect(() => {
    if (selectedCategoria) {
      setLoading(true);
      setProductos([]);
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
    } else {
      setProductos([]); // Si no hay categoría seleccionada, no mostrar productos
    }
  }, [selectedCategoria]);

  // Función para manejar el clic en la imagen
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Setea la imagen seleccionada para mostrarla más grande
  };

  if (loading) return <p className="text-center mt-10 text-white">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-gray-900" 
      style={{ backgroundImage: 'url(/images/fondo.png)' }}
    >
      {/* Botones fijos en la parte superior */}
      <div className="fixed top-0 left-0 right-0 bg-green-600 text-white p-4 flex justify-between items-center z-10 shadow-lg">
        <button
          onClick={() => setSelectedCategoria(null)} // Regresar a la vista de categorías
          className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Regresar a Categorías
        </button>
        <button
          onClick={() => window.location.href = "/"} // Redirige a la página de inicio
          className="p-3 bg-green-800 rounded-xl hover:bg-green-700 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Regresar al Inicio
        </button>
      </div>

      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <h1 className="text-4xl font-extrabold text-center text-green-900 mb-8">Categorías</h1>

        {/* Contenedor de categorías */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {categorias.length > 0 ? (
            categorias.map((categoria) => (
              <button
                key={categoria.id}
                className="p-2 bg-white rounded-lg shadow-lg text-center text-black hover:bg-green-200 transition duration-300 transform hover:scale-105"
                onClick={() => setSelectedCategoria(categoria.id)} // Cambiar la categoría seleccionada
              >
                <h2 className="font-semibold text-sm">{categoria.nombre}</h2>
              </button>
            ))
          ) : (
            <p className="text-center text-black">No hay categorías disponibles.</p>
          )}
        </div>

        {/* Solo muestra productos si una categoría ha sido seleccionada */}
        {selectedCategoria && (
          <>
            <h2 className="text-3xl font-extrabold mb-6 text-center text-green-900">Productos en esta categoría</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <div key={producto.id} className="bg-white p-4 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl" style={{ width: "280px", height: "280px" }}>
                    {/* Imagen del producto */}
                    <img
                      src={producto.imagen} // Asegúrate de que el campo imagen contiene la URL completa
                      alt={producto.nombre}
                      className="w-full h-full object-cover mb-4 rounded-lg border-2 border-green-500 cursor-pointer"
                      onClick={() => handleImageClick(producto.imagen)} // Mostrar la imagen en grande al hacer clic
                    />
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{producto.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-4">{producto.descripcion}</p>
                    <p className="text-green-600 font-bold text-xl">${producto.precio}</p>
                    <button 
                      className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-black">No hay productos en esta categoría.</p>
              )}
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
