import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Productos() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

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
      // Limpiar los productos previos antes de cargar los de la nueva categoría
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
  }, [selectedCategoria]);  // Actualiza los productos cuando cambia la categoría seleccionada

  if (loading) return <p className="text-center mt-10 text-black">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Botones fijos en la parte superior */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between z-10">
        <button
          onClick={() => setSelectedCategoria(null)} // Regresar a la vista de categorías
          className="p-2 bg-blue-500 rounded"
        >
          Regresar a Categorías
        </button>
        <button
          onClick={() => window.location.href = "/"} // Redirige a la página de inicio
          className="p-2 bg-green-500 rounded"
        >
          Regresar al Inicio
        </button>
      </div>

      <div className="pt-20"> {/* Añadir espacio para que los botones no cubran el contenido */}
        <h1 className="text-2xl font-bold mb-4 text-black">Categorías</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {categorias.length > 0 ? (
            categorias.map((categoria) => (
              <button
                key={categoria.id}
                className="p-4 bg-white shadow text-black text-center"
                onClick={() => setSelectedCategoria(categoria.id)} // Cambiar la categoría seleccionada
              >
                <h2 className="font-bold">{categoria.nombre}</h2>
              </button>
            ))
          ) : (
            <p className="text-center text-black">No hay categorías disponibles.</p>
          )}
        </div>

        {/* Solo muestra productos si una categoría ha sido seleccionada */}
        {selectedCategoria && (
          <>
            <h2 className="text-xl font-bold mb-4 text-black">Productos en esta categoría</h2>
            <div className="grid grid-cols-2 gap-4">
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <div key={producto.id} className="p-4 bg-white shadow text-black">
                    {/* Mostrar la imagen del producto */}
                    <img
                      src={producto.imagen} // Asegúrate de que el campo imagen contiene la URL completa
                      alt={producto.nombre}
                      className="w-full h-48 object-cover mb-4 rounded-lg"
                    />
                    <h3 className="font-bold text-black">{producto.nombre}</h3>
                    <p className="text-black">{producto.descripcion}</p>
                    <p className="text-green-500 font-bold">${producto.precio}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-black">No hay productos en esta categoría.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
