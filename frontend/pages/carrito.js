import { useState, useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useRouter } from "next/router"; 

export default function Carrito() {
  const { carrito, eliminarDelCarrito } = useCarrito();
  const [carritoState, setCarritoState] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [nombreCliente, setNombreCliente] = useState(""); 
  const [fechaEntrega, setFechaEntrega] = useState(""); 
  const [errorFecha, setErrorFecha] = useState(""); 
  const [selectedImage, setSelectedImage] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    setBackgroundImage('url(/images/fondo.png)');
    setCarritoState(carrito);

    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1);
    const fechaMinima = hoy.toISOString().split("T")[0];
    setFechaEntrega(fechaMinima);
  }, [carrito]);

  const calcularTotal = () => {
    return carritoState.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2);
  };

  const generarMensajeWhatsApp = () => {
    let mensaje = `*🛍️ Pedido de ${nombreCliente}*\n\n`; 
    mensaje += `📝 *Detalle de tu pedido:*\n\n`; 

    carritoState.forEach((item) => {
      mensaje += `🔸 *${item.nombre}* x${item.cantidad} - *$${(item.precio * item.cantidad).toFixed(2)}*\n`; 
    });
  
    mensaje += `\n💰 *Total: $${calcularTotal()}*\n\n`; 
    mensaje += `*--------------------------------------*\n`; 
    mensaje += `*Fecha de entrega: ${fechaEntrega}*\n\n`; 
    mensaje += `*Gracias por tu compra, ${nombreCliente}! 🎉*\n`; 
    mensaje += `*Si tienes alguna pregunta, no dudes en contactarnos.*\n`; 
    mensaje += `📞 *Teléfono de atención: [0959065186]*`; 
    
    return encodeURIComponent(mensaje);
  };

  const irAPagar = () => {
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split("T")[0];
    if (fechaEntrega === fechaHoy) {
      setErrorFecha("Debes esperar al menos 1 día para la entrega. Elige una fecha posterior.");
      return;
    }

    if (carritoState.length === 0 || !nombreCliente || !fechaEntrega) return;
    const numeroAdmin = "593959065186"; 
    const url = `https://wa.me/${numeroAdmin}?text=${generarMensajeWhatsApp()}`;
    window.open(url, "_blank");

    carritoState.forEach((item) => eliminarDelCarrito(item.id));

    router.push("/"); 
  };

  const regresar = () => {
    window.history.back();
  };

  const handleFechaChange = (e) => {
    const fechaSeleccionada = e.target.value;
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1);

    const fechaHoy = hoy.toISOString().split("T")[0];
    if (fechaSeleccionada === fechaHoy) {
      setErrorFecha("La fecha seleccionada no puede ser el mismo día. Debe ser al menos 1 día después.");
    } else {
      setErrorFecha(""); 
      setFechaEntrega(fechaSeleccionada); 
    }
  };

  // Función para incrementar la cantidad
  const aumentarCantidad = (id) => {
    setCarritoState(prevState =>
      prevState.map(item => 
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  // Función para decrementar la cantidad
  const disminuirCantidad = (id) => {
    setCarritoState(prevState =>
      prevState.map(item => 
        item.id === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item
      )
    );
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-gray-900" 
      style={{ backgroundImage: backgroundImage }}
    >
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-extrabold text-center text-[#B1C41B] mb-8">Carrito de Compras</h1>

        {carritoState.length === 0 ? <p className="text-center text-gray-700 mt-10">El carrito está vacío.</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {carritoState.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
                <img 
                  src={item.imagen} 
                  alt={item.nombre} 
                  className="w-full h-40 object-cover mb-4 rounded-lg border-2 border-[#B1C41B] cursor-pointer"
                  onClick={() => setSelectedImage(item.imagen)} 
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{item.nombre}</h2>
                <p className="text-gray-600 text-sm mb-4">{item.descripcion}</p>
                <p className="text-[#B1C41B] text-lg font-bold">${item.precio}</p>
                
                <div className="flex justify-between items-center mt-4">
                  {/* Botones para aumentar o disminuir la cantidad */}
                  <div className="flex items-center">
                    <button 
                      onClick={() => disminuirCantidad(item.id)} 
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      -
                    </button>
                    <span className="mx-4">{item.cantidad}</span>
                    <button 
                      onClick={() => aumentarCantidad(item.id)} 
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => eliminarDelCarrito(item.id)} 
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="nombreCliente" className="text-xl font-semibold text-gray-800">Tu nombre:</label>
          <input 
            type="text" 
            id="nombreCliente"
            value={nombreCliente} 
            onChange={(e) => {
              const nuevoValor = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚÑñ\s]/g, '');
              setNombreCliente(nuevoValor);
            }} 
            className="mt-2 w-64 p-2 border-2 border-[#B1C41B] rounded-lg text-center"
            placeholder="Ingresa tu nombre"
            required
          />
        </div>

        <div className="mt-6">
          <label htmlFor="fechaEntrega" className="text-xl font-semibold text-gray-800">Fecha de entrega:</label>
          <input 
            type="date" 
            id="fechaEntrega"
            value={fechaEntrega} 
            onChange={handleFechaChange} 
            min={fechaEntrega} 
            className="mt-2 w-64 p-2 border-2 border-[#B1C41B] rounded-lg text-center"
            required
          />
          {errorFecha && <p className="text-red-500 text-sm mt-2">{errorFecha}</p>}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-10 space-y-4 md:space-y-0">
          <div className="w-full md:w-auto text-center md:text-left">
            {carritoState.length > 0 && (
              <h2 className="text-2xl font-bold text-gray-800">Total: <span className="text-gray-800">${calcularTotal()}</span></h2>
            )}
          </div>
          <div className="w-full md:w-auto flex justify-center md:justify-end space-x-4">
            <button 
              onClick={irAPagar} 
              className={`w-full md:w-auto p-3 bg-[#B1C41B] text-white rounded-lg hover:bg-[#9A9D16] shadow-lg transform transition-all hover:scale-105 ${carritoState.length === 0 || !nombreCliente || !fechaEntrega || errorFecha ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={carritoState.length === 0 || !nombreCliente || !fechaEntrega || errorFecha || fechaEntrega === new Date().toISOString().split('T')[0]}
            >
              Ir a pagar por WhatsApp
            </button>
            <button 
              onClick={regresar} 
              className="w-full md:w-auto p-3 bg-[#B1C41B] text-white rounded-lg hover:bg-[#B1C41B] shadow-lg transform transition-all hover:scale-105"
            >
              Volver a elegir productos
            </button>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
          <div className="bg-white p-4 rounded-lg shadow-lg w-auto h-auto max-w-4xl mx-auto">
            <img 
              src={selectedImage} 
              alt="Imagen ampliada" 
              className="w-full h-auto max-h-screen object-contain rounded-lg" 
              style={{ objectFit: "contain" }} 
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
