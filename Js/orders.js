import { loadProduct, saveProduct } from './inventory.js'

export const initOrders = () => {
  // Constantes
  const addOrderForm = document.getElementById('addOrderForm')
  const itemInput = document.getElementById('itemInput')
  const priceProductInput = document.getElementById('priceProductInput')
  const productsContainer = document.getElementById('orders')
  const windowSize = window.innerWidth
  const products = loadProduct()
  const STORAGE_KEYS = 'orders'

  // Cargar Ordenes del localStorage
  const loadOrders = () => {
    const item = localStorage.getItem(STORAGE_KEYS)

    // Si no hay colección, retorna un array vacío
    if (!item) return []

    try {
      // Si el JSON es válido, retorna el array
      return JSON.parse(item)
    } catch (e) {
      // Si el JSON se daña, retorna un array vacío
      return []
    }
  }

  // Guardar Ordenes en el localStorage
  const saveOrders = (orders) => {
    localStorage.setItem(STORAGE_KEYS, JSON.stringify(orders))
  }

  // Eliminar Orden del localStorage
  const removeOrder = (id) => {
    // Seleccionamos todos los productos menos el que queremos eliminar
    orders = orders.filter((item) => item.id !== id)

    saveOrders(orders)
    renderOrders()
  }

  // Agregar Orden en el localStorage
  const addOrder = (client, product, stock, totalPrice) => {
    // Creamos el nuevo producto
    const newOrder = { id: Date.now(), client, product, stock, totalPrice }

    // Agregar el nuevo producto
    orders.push(newOrder)

    saveOrders(orders)
    renderOrders()
  }

  // Lógica para el select options
  const inputOptions = () => {
    // Mapear los productos para almacenarlos en el option
    const options = products
      .map(
        (product) => `<option value="${product.id}">${product.name}</option>`
      )
      .join('')

    // Insertar opciones en el select
    return (itemInput.innerHTML = options)
  }

  // Lógica para el precio del producto
  const priceProduct = () => {
    // constantes
    const stockInput = document.getElementById('stockInput')
    const totalPriceInput = document.getElementById('totalPriceInput')

    // Obtener el valor del input
    const value = itemInput.value

    // Encontrar el producto correspondiente
    const product = products.find((product) => product.id === parseInt(value))

    // Establecer el precio del producto
    priceProductInput.value = product.price

    const total = Number(product.price) * Number(stockInput.value)

    // Establecer el precio total
    totalPriceInput.value = total.toFixed(2)

    // Escuchar el cambio del input
    itemInput.addEventListener('change', priceProduct)
    stockInput.addEventListener('change', priceProduct)
  }

  const renderOrders = (list = orders) => {
    // Limpiamos el contenedor
    productsContainer.innerHTML = ''

    // Creamos los componentes de la card
    list.forEach((order) => {
      const divCard = document.createElement('div')
      const divCardHeader = document.createElement('div')
      const divCardBody = document.createElement('div')
      const divCardFooter = document.createElement('div')
      const btnDelete = document.createElement('button')
      const title = document.createElement('h2')
      const category = document.createElement('p')
      const stock = document.createElement('p')
      const price = document.createElement('span')

      title.textContent = order.client
      category.textContent = `Articulo: ${order.product}`
      stock.textContent = `Cantidad: ${order.stock}`
      price.textContent = `$${order.totalPrice}`
      btnDelete.textContent = 'Eliminar'

      divCard.className = 'card'
      divCardHeader.className = 'card-header'
      divCardBody.className = 'card-body'
      divCardFooter.className = 'card-footer'
      btnDelete.className = 'btn btn-danger'

      btnDelete.addEventListener('click', () => removeOrder(order.id))

      divCardHeader.appendChild(title)
      divCardHeader.appendChild(price)
      divCardBody.appendChild(stock)
      divCardBody.appendChild(category)
      divCardFooter.appendChild(btnDelete)
      divCard.appendChild(divCardHeader)
      divCard.appendChild(divCardBody)
      divCard.appendChild(divCardFooter)

      productsContainer.appendChild(divCard)
    })
  }

  // Obtenemos los datos del formulario
  addOrderForm.addEventListener('submit', function (e) {
    // Impide la recarga de la pagina
    e.preventDefault()

    // Datos del Producto
    const client = document.getElementById('clientInput').value
    const item = document.getElementById('itemInput').value
    const stockInput = document.getElementById('stockInput')
    const stock = Number(stockInput.value)
    const totalPrice = document.getElementById('totalPriceInput').value

    // Encontrar el producto correspondiente
    const product = products.find((product) => product.id === parseInt(item))

    if (Number(product.stock) < stock) {
      // No agregamos la orden porque no hay suficiente stock
      stockInput.classList.add('is-invalid')
      stockInput.setCustomValidity('No hay suficiente stock')
    } else {
      // Actualizamos el stock del producto
      stockInput.classList.remove('is-invalid')
      stockInput.setCustomValidity('')
      product.stock = Number(product.stock) - stock
      saveProduct(products)

      // Agregamos el producto
      addOrder(client, product.name, stock, totalPrice)

      // Limpiamos el formulario
      document.getElementById('clientInput').value = ''
      document.getElementById('itemInput').value = ''
      document.getElementById('stockInput').value = ''
      document.getElementById('totalPriceInput').value = ''
    }
  })

  // Media Queries
  if (windowSize >= 1024) {
    addOrderForm.classList.add('show')
  } else {
    addOrderForm.classList.remove('show')
  }

  // Initialization
  let orders = loadOrders()
  inputOptions()
  priceProduct()
  renderOrders()
}
