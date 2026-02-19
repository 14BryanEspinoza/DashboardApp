// Importar funciones de utils.js
import { Storage, createCard } from './utils.js'
// Importar funciones de inventory.js
import { loadProduct, saveProduct } from './inventory.js'

// Clave de almacenamiento
const STORAGE_KEY = 'orders'

// Devuelve las órdenes de local storage
export const loadOrders = () => Storage.get(STORAGE_KEY)

// Guarda las órdenes en local storage
export const saveOrders = (orders) => Storage.set(STORAGE_KEY, orders)

// Inicializa las órdenes
export const initOrders = () => {
  // Constantes
  const addOrderForm = document.getElementById('addOrderForm')
  const itemInput = document.getElementById('itemInput')
  const priceProductInput = document.getElementById('priceProductInput')
  const stockInput = document.getElementById('stockInput')
  const totalPriceInput = document.getElementById('totalPriceInput')
  const ordersContainer = document.getElementById('orders')

  // Si no hay elementos, retorna
  if (!addOrderForm || !ordersContainer) return

  // Carga los datos
  let products = loadProduct()
  let orders = loadOrders()

  // Renderiza las órdenes
  const renderOrders = (list = orders) => {
    // Limpia el contenedor
    ordersContainer.innerHTML = ''

    // Si no hay órdenes, muestra un mensaje
    if (list.length === 0) {
      ordersContainer.innerHTML =
        '<p class="text-muted text-center w-100 py-5">No hay órdenes registradas.</p>'
      return
    }

    // Recorre las órdenes y crea una tarjeta para cada una
    list.forEach((order) => {
      const card = createCard({
        title: order.client,
        price: order.totalPrice,
        details: [`Artículo: ${order.product}`, `Cantidad: ${order.stock}`],
        onDelete: () => removeOrder(order.id),
      })
      ordersContainer.appendChild(card)
    })
  }

  // Elimina una orden
  const removeOrder = (id) => {
    // Filtra las órdenes y elimina la que tenga el id proporcionado
    orders = orders.filter((o) => o.id !== id)

    saveOrders(orders)
    renderOrders()

    // Dispara el evento statsUpdated
    window.dispatchEvent(new CustomEvent('statsUpdated'))
  }

  // Llena las opciones del select con los productos
  const populateProductOptions = () => {
    // Si no hay itemInput, retorna
    if (!itemInput) return

    // Crea las opciones del select
    const options = products
      .map(
        (p) => `<option value="${p.id}">${p.name} (Stock: ${p.stock})</option>`
      )
      .join('')

    // Actualiza el select con las opciones
    itemInput.innerHTML = `<option value="" selected disabled>Seleccione un producto</option>${options}`
  }

  // Actualiza los precios de la orden
  const updateOrderPrices = () => {
    // Obtiene el id del producto
    const productId = parseInt(itemInput.value)
    const product = products.find((p) => p.id === productId)

    // Si hay un producto, actualiza los precios
    if (product) {
      const quantity = parseInt(stockInput.value) || 0
      priceProductInput.value = product.price
      totalPriceInput.value = (product.price * quantity).toFixed(2)

      // Si la cantidad es mayor al stock, muestra un mensaje de error
      if (quantity > product.stock) {
        stockInput.classList.add('is-invalid')
      } else {
        stockInput.classList.remove('is-invalid')
      }
    }
  }

  // Event Listeners
  if (itemInput) itemInput.addEventListener('change', updateOrderPrices)
  if (stockInput) stockInput.addEventListener('input', updateOrderPrices)

  // Event Listener para el formulario de órdenes
  addOrderForm.addEventListener('submit', (e) => {
    // Previene el comportamiento por defecto del formulario
    e.preventDefault()

    // Obtiene los datos del formulario
    const productId = parseInt(itemInput.value)
    const quantity = parseInt(stockInput.value)
    const client = document.getElementById('clientInput').value.trim()

    // Busca el producto
    const product = products.find((p) => p.id === productId)

    // Si no hay producto, cantidad mayor al stock o cliente vacío, muestra un mensaje de error
    if (!product || quantity > product.stock || !client) {
      stockInput.classList.add('is-invalid')
      return
    }

    // Procesa la orden
    const totalPrice = product.price * quantity
    const newOrder = {
      id: Date.now(),
      client,
      product: product.name,
      stock: quantity,
      totalPrice,
    }

    // Agrega la orden al array de órdenes
    orders.push(newOrder)
    product.stock -= quantity

    // Guarda las órdenes y los productos
    saveOrders(orders)
    saveProduct(products)

    // Resetea el formulario
    document.getElementById('clientInput').value = ''
    document.getElementById('itemInput').value = ''
    document.getElementById('stockInput').value = ''
    document.getElementById('priceProductInput').value = ''
    document.getElementById('totalPriceInput').value = ''

    // Renderiza las órdenes y actualiza los productos
    renderOrders()
    populateProductOptions()

    // Dispara el evento statsUpdated
    window.dispatchEvent(new CustomEvent('statsUpdated'))
  })

  // Render inicial
  populateProductOptions()
  renderOrders()
}
