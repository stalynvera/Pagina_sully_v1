import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p className="text-center mt-10 text-black">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Botones fijos en la parte superior */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between z-10">
        <button
          onClick={() => window.history.back()} // Regresar a la página anterior
          className="p-2 bg-blue-500 rounded"
        >
          Regresar
        </button>
        <button
          onClick={() => window.location.href = "/"} // Redirige a la página de inicio
          className="p-2 bg-green-500 rounded"
        >
          Regresar al Inicio
        </button>
      </div>

      <div className="pt-20"> {/* Añadir espacio para que los botones no cubran el contenido */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Productos Disponibles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                {/* Usar la URL completa de la imagen que viene de la API */}
                <img
                  src={producto.imagen} // URL de la imagen directamente desde la API
                  alt={producto.nombre}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{producto.nombre}</h2>
                <p className="text-gray-600 text-sm mb-4">{producto.descripcion}</p>
                <p className="text-green-600 text-lg font-bold">${producto.precio}</p>
                <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-200">
                  Agregar al carrito
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-800">No hay productos disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
