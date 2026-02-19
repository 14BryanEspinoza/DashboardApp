// Importa las funciones de utils.js
import { Storage, createCard } from './utils.js'

// Clave de almacenamiento
const STORAGE_KEY = 'products'

// Obtiene los productos del almacenamiento local
export const loadProduct = () => Storage.get(STORAGE_KEY)

// Guarda los productos en el almacenamiento local
export const saveProduct = (products) => Storage.set(STORAGE_KEY, products)

// Inicializa el inventario
export const initInventory = () => {
  // Obtiene los elementos del DOM
  const addForm = document.getElementById('addForm')
  const filterForm = document.getElementById('filterForm')
  const productsContainer = document.getElementById('products')

  // Si no hay elementos del DOM, retorna
  if (!addForm || !productsContainer) return

  // Carga los productos
  let products = loadProduct()

  // Renderiza los productos
  const renderProducts = (list = products) => {
    // Limpia el contenedor
    productsContainer.innerHTML = ''

    // Si no hay productos, muestra un mensaje
    if (list.length === 0) {
      productsContainer.innerHTML =
        '<p class="text-muted text-center w-100 py-5">No hay productos registrados.</p>'
      return
    }

    // Renderiza los productos
    list.forEach((product) => {
      // Crea una tarjeta para cada producto
      const card = createCard({
        title: product.name,
        price: product.price,
        details: [`Categoría: ${product.category}`, `Stock: ${product.stock}`],
        onDelete: () => removeProduct(product.id),
      })
      productsContainer.appendChild(card)
    })
  }

  // Elimina un producto
  const removeProduct = (id) => {
    // Filtra los productos
    products = products.filter((p) => p.id !== id)

    saveProduct(products)
    renderProducts()

    // Dispara evento para actualizar estadísticas en el dashboard
    window.dispatchEvent(new CustomEvent('statsUpdated'))
  }

  // Agrega un producto
  const addProduct = (name, category, stock, price) => {
    // Busca si el producto existe
    const existing = products.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    )

    // Si el producto existe, actualiza el stock y el precio
    if (existing) {
      existing.category = category
      existing.stock = Number(existing.stock) + Number(stock)
      existing.price = Number(price)
    } else {
      // Si el producto no existe, crea uno nuevo
      products.push({
        id: Date.now(),
        name,
        category,
        stock: Number(stock),
        price: Number(price),
      })
    }

    saveProduct(products)
    renderProducts()
    window.dispatchEvent(new CustomEvent('statsUpdated'))
  }

  // Event Listeners
  addForm.addEventListener('submit', (e) => {
    // Previene el comportamiento por defecto del formulario
    e.preventDefault()

    // Obtiene los valores de los inputs
    const name = document.getElementById('productInput').value.trim()
    const category = document.getElementById('categoryInput').value.trim()
    const stock = document.getElementById('stockInput').value
    const price = document.getElementById('priceInput').value

    // Si falta algún campo, retorna
    if (!name || !category || !stock || !price) return

    // Agrega el producto
    addProduct(name, category, stock, price)

    // Limpia el formulario
    document.getElementById('productInput').value = ''
    document.getElementById('categoryInput').value = ''
    document.getElementById('stockInput').value = ''
    document.getElementById('priceInput').value = ''
  })

  // Filtra los productos
  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      // Previene el comportamiento por defecto del formulario
      e.preventDefault()

      // Obtiene el valor del input de filtro
      const query = document
        .getElementById('filterInput')
        .value.trim()
        .toLowerCase()
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(query)
      )

      // Renderiza los productos filtrados
      renderProducts(filtered)
    })
  }

  // Render inicial
  renderProducts()
}
