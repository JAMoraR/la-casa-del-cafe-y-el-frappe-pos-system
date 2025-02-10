"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Edit, Check, Search, Plus, Minus, RotateCcw } from "lucide-react"

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

const productos = [
  { id: 1, nombre: "Frappe de Frapuchino", precio: 75, categoria: "Frappe Cremosos" },
{ id: 2, nombre: "Frappe de Oreo con Chocolate", precio: 75, categoria: "Frappe Cremosos" },
{ id: 3, nombre: "Frappe de Cacao", precio: 65, categoria: "Frappe Cremosos" },
{ id: 4, nombre: "Frappe de Fresa", precio: 750, categoria: "Frappe Cremosos" },
{ id: 5, nombre: "Frappe de Chicle Azul", precio: 65, categoria: "Frappe Cremosos" },
{ id: 6, nombre: "Frappe de Doble Chocolate", precio: 70, categoria: "Frappe Cremosos" },
{ id: 7, nombre: "Frappe de Gansito", precio: 75, categoria: "Frappe Cremosos" },
{ id: 8, nombre: "Frappe de Rompope", precio: 70, categoria: "Frappe Cremosos" },
{ id: 9, nombre: "Frappe de Moka con Chocolate", precio: 70, categoria: "Frappe Cremosos" },
{ id: 10, nombre: "Frappe de Bombom Esponjoso", precio: 70, categoria: "Frappe Cremosos" },
{ id: 11, nombre: "Frappe de Vainilla", precio: 70, categoria: "Frappe Cremosos" },
{ id: 12, nombre: "Frappe de Café", precio: 70, categoria: "Frappe Cremosos" },
{ id: 13, nombre: "Frappe de Mazapan", precio: 75, categoria: "Frappe Cremosos" },
{ id: 14, nombre: "Frappe de Fresa", precio: 60, categoria: "Frappe Picositos" },
{ id: 15, nombre: "Frappe de Piña", precio: 60, categoria: "Frappe Picositos" },
{ id: 16, nombre: "Frappe de Mango", precio: 60, categoria: "Frappe Picositos" },
{ id: 17, nombre: "Café Americano", precio: 40, categoria: "Café Caliente" },
{ id: 18, nombre: "Capuchino", precio: 45, categoria: "Café Caliente" },
{ id: 19, nombre: "Capuchino con Vainilla", precio: 45, categoria: "Café Caliente" },
{ id: 20, nombre: "Donas Glaseadas", precio: 45, categoria: "Postres" },
{ id: 21, nombre: "Fresas con Crema", precio: 45, categoria: "Postres" },
{ id: 22, nombre: "Del Día", precio: 60, categoria: "Postres" },
]

const categorias = [...new Set(productos.map((p) => p.categoria))]

export function CafeApp() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [ordenes, setOrdenes] = useState([])
  const [ordenActual, setOrdenActual] = useState({})
  const [ordenEnEdicion, setOrdenEnEdicion] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
  const [siguienteNumeroOrden, setSiguienteNumeroOrden] = useState(1)

  const productosFiltrados = useMemo(() => {
    const busquedaSinAcentos = removeAccents(busqueda.toLowerCase())

    return productos
      .filter((producto) => {
        const nombreSinAcentos = removeAccents(producto.nombre.toLowerCase())
        const categoriaSinAcentos = removeAccents(producto.categoria.toLowerCase())

        const coincideNombre = nombreSinAcentos.includes(busquedaSinAcentos)
        const coincideCategoria = categoriaSinAcentos.includes(busquedaSinAcentos)

        if (busqueda && coincideNombre) {
          return true // Siempre incluye si coincide con el nombre, sin importar la categoría
        }

        if (categoriaSeleccionada) {
          return producto.categoria === categoriaSeleccionada && (coincideNombre || !busqueda)
        }

        return coincideNombre || coincideCategoria
      })
      .sort((a, b) => {
        const aNombreSinAcentos = removeAccents(a.nombre.toLowerCase())
        const bNombreSinAcentos = removeAccents(b.nombre.toLowerCase())

        // Prioriza los productos que coinciden exactamente con la búsqueda
        if (busqueda) {
          const aCoincideExacto = aNombreSinAcentos === busquedaSinAcentos
          const bCoincideExacto = bNombreSinAcentos === busquedaSinAcentos
          if (aCoincideExacto && !bCoincideExacto) return -1
          if (!aCoincideExacto && bCoincideExacto) return 1
        }

        // Luego, prioriza los productos de la categoría seleccionada
        if (categoriaSeleccionada) {
          if (a.categoria === categoriaSeleccionada && b.categoria !== categoriaSeleccionada) return -1
          if (a.categoria !== categoriaSeleccionada && b.categoria === categoriaSeleccionada) return 1
        }

        // Finalmente, ordena alfabéticamente
        return aNombreSinAcentos.localeCompare(bNombreSinAcentos)
      })
  }, [busqueda, categoriaSeleccionada])

  const ordenesFiltradas = useMemo(() => {
    return [...ordenes].sort((a, b) => {
      if (a.estado === "pendiente" && b.estado === "finalizada") return -1
      if (a.estado === "finalizada" && b.estado === "pendiente") return 1
      if (a.estado === "pendiente" && b.estado === "pendiente") return b.id - a.id
      if (a.estado === "finalizada" && b.estado === "finalizada") return b.fechaFinalizacion - a.fechaFinalizacion
      return 0
    })
  }, [ordenes])

  const abrirMenu = (orden = null) => {
    if (orden) {
      setOrdenEnEdicion(orden)
      setOrdenActual(
        orden.productos.reduce((acc, item) => {
          acc[item.id] = item.cantidad
          return acc
        }, {}),
      )
    } else {
      setOrdenEnEdicion(null)
      setOrdenActual({})
    }
    setBusqueda("")
    setCategoriaSeleccionada("")
    setMenuAbierto(true)
  }

  const cerrarMenu = () => {
    setMenuAbierto(false)
    setOrdenEnEdicion(null)
    setOrdenActual({})
    setBusqueda("")
    setCategoriaSeleccionada("")
  }

  const actualizarCantidad = (id, cantidad) => {
    setOrdenActual((prev) => ({
      ...prev,
      [id]: Number.parseInt(cantidad) || 0,
    }))
  }

  const incrementarCantidad = (id) => {
    setOrdenActual((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }))
  }

  const decrementarCantidad = (id) => {
    setOrdenActual((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }))
  }

  const realizarOrden = () => {
    const nuevosProductos = Object.entries(ordenActual)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([id, cantidad]) => {
        const producto = productos.find((p) => p.id === Number.parseInt(id))
        return {
          ...producto,
          cantidad,
          subtotal: producto.precio * cantidad,
        }
      })

    if (nuevosProductos.length > 0) {
      if (ordenEnEdicion) {
        setOrdenes((prev) =>
          prev.map((orden) =>
            orden.id === ordenEnEdicion.id
              ? {
                  ...orden,
                  productos: nuevosProductos,
                  total: nuevosProductos.reduce((sum, item) => sum + item.subtotal, 0),
                }
              : orden,
          ),
        )
      } else {
        const nuevaOrden = {
          id: Date.now(),
          numeroOrden: siguienteNumeroOrden,
          productos: nuevosProductos,
          total: nuevosProductos.reduce((sum, item) => sum + item.subtotal, 0),
          estado: "pendiente",
        }
        setOrdenes((prev) => [nuevaOrden, ...prev])
        setSiguienteNumeroOrden((prev) => prev + 1)
      }
      cerrarMenu()
    }
  }

  const finalizarOrden = (id) => {
    setOrdenes((prev) =>
      prev.map((orden) =>
        orden.id === id ? { ...orden, estado: "finalizada", fechaFinalizacion: Date.now() } : orden,
      ),
    )
  }

  const reiniciarSistema = () => {
    setSiguienteNumeroOrden(1)
    setOrdenes([])
  }

  const manejarBusqueda = (valor) => {
    setBusqueda(valor)
    if (valor) {
      setCategoriaSeleccionada("")
    }
  }

  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria)
    setBusqueda("")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Button onClick={() => abrirMenu()} className="w-full mb-4">
        Realizar Nueva Orden
      </Button>

      {menuAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg flex flex-col h-[90vh]">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{ordenEnEdicion ? "Editar Orden" : "Hacer Orden"}</h2>
                <Button variant="ghost" size="icon" onClick={cerrarMenu}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="mb-4">
                <div className="flex items-center border rounded-md">
                  <Search className="h-5 w-5 text-gray-400 ml-2" />
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => manejarBusqueda(e.target.value)}
                    className="border-0 focus:ring-0"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={categoriaSeleccionada === "" ? "default" : "outline"}
                  onClick={() => seleccionarCategoria("")}
                  size="sm"
                >
                  Todos
                </Button>
                {categorias.map((categoria) => (
                  <Button
                    key={categoria}
                    variant={categoriaSeleccionada === categoria ? "default" : "outline"}
                    onClick={() => seleccionarCategoria(categoria)}
                    size="sm"
                  >
                    {categoria}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className="mb-4 p-2 border rounded">
                  <h3 className="font-semibold">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-2">${producto.precio.toFixed(2)}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label htmlFor={`cantidad-${producto.id}`} className="mr-2">
                        Cantidad:
                      </Label>
                      <Input
                        type="number"
                        id={`cantidad-${producto.id}`}
                        value={ordenActual[producto.id] || ""}
                        onChange={(e) => actualizarCantidad(producto.id, e.target.value)}
                        min="0"
                        className="w-20"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => decrementarCantidad(producto.id)} size="sm">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => incrementarCantidad(producto.id)} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <Button onClick={realizarOrden} className="w-full">
                {ordenEnEdicion ? "Actualizar Orden" : "Confirmar Orden"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Órdenes</h2>
          <Button onClick={reiniciarSistema} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reiniciar Sistema
          </Button>
        </div>
        {ordenes.length === 0 ? (
          <p className="text-gray-600">No hay órdenes.</p>
        ) : (
          ordenesFiltradas.map((orden) => (
            <div key={orden.id} className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Orden #{orden.numeroOrden}</h3>
                <div className="flex space-x-2">
                  {orden.estado === "pendiente" && (
                    <>
                      <Button size="sm" onClick={() => abrirMenu(orden)}>
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <Button size="sm" onClick={() => finalizarOrden(orden.id)}>
                        <Check className="h-4 w-4 mr-1" /> Finalizar
                      </Button>
                    </>
                  )}
                  {orden.estado === "finalizada" && <span className="text-green-600 font-semibold">Finalizada</span>}
                </div>
              </div>
              {orden.productos.map((item, index) => (
                <p key={index} className="text-sm">
                  {item.cantidad}x {item.nombre} - ${item.subtotal.toFixed(2)}
                </p>
              ))}
              <p className="font-bold mt-2">Total: ${orden.total.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

