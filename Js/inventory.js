// Constantes
const STORAGE_KEYS = 'products'

// Cargar Productos del localStorage
export const loadProduct = () => {
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

// Guardar Productos en el localStorage
export const saveProduct = (products) => {
  localStorage.setItem(STORAGE_KEYS, JSON.stringify(products))
}

export const initInventory = () => {
  const addFrom = document.getElementById('addForm')
  const filterForm = document.getElementById('filterForm')
  const productsContainer = document.getElementById('products')
  const windowSize = window.innerWidth

  // Renderizado de Productos
  const renderProducts = (list = products) => {
    // Limpiamos el contenedor
    productsContainer.innerHTML = ''

    // Creamos los componentes de la card
    list.forEach((product) => {
      const divCard = document.createElement('div')
      const divCardHeader = document.createElement('div')
      const divCardBody = document.createElement('div')
      const divCardFooter = document.createElement('div')
      const btnDelete = document.createElement('button')
      const title = document.createElement('h2')
      const category = document.createElement('p')
      const stock = document.createElement('p')
      const price = document.createElement('span')

      title.textContent = product.name
      category.textContent = `Categoría: ${product.category}`
      stock.textContent = `Cantidad: ${product.stock}`
      price.textContent = `$${product.price}`
      btnDelete.textContent = 'Eliminar'

      divCard.className = 'card'
      divCardHeader.className = 'card-header'
      divCardBody.className = 'card-body'
      divCardFooter.className = 'card-footer'
      btnDelete.className = 'btn btn-danger'

      btnDelete.addEventListener('click', () => removeProduct(product.id))

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

  // Filtrar Productos
  const filterProducts = (filterValue) => {
    // Convertimos el valor del filtro a minúsculas
    const query = (filterValue ?? '').trim().toLowerCase()

    // Si no hay filtro, renderiza todos los productos
    if (!query) {
      renderProducts()
      return
    }

    // Filtramos los productos que coincidan con el filtro
    const filtered = products.filter((item) => {
      const name = (item.name ?? '').toString().toLowerCase()
      return name.includes(query)
    })

    renderProducts(filtered)
  }

  // Agregar Productos en el localStorage
  const addProduct = (name, category, stock, price) => {
    // Verificamos si existe el producto
    const existingProducts = products.find((item) => item.name === name)

    if (existingProducts) {
      // Si existe, actualizamos el producto
      existingProducts.category = category
      existingProducts.stock = Number(existingProducts.stock) + Number(stock)
      existingProducts.price = Number(price)
    } else {
      // Sino existe, Creamos el nuevo producto
      const newProduct = {
        id: Date.now(),
        name,
        category,
        stock: Number(stock),
        price: Number(price),
      }

      // Agregar el nuevo producto
      products.push(newProduct)
    }

    saveProduct(products)
  }

  // Eliminar Productos del localStorage
  const removeProduct = (id) => {
    // Seleccionamos todos los productos menos el que queremos eliminar
    products = products.filter((item) => item.id !== id)

    saveProduct(products)
    renderProducts()
  }

  // Obtenemos los datos del formulario
  addFrom.addEventListener('submit', function (e) {
    // Impide la recarga de la pagina
    e.preventDefault()

    // Datos del Producto
    const name = document.getElementById('productInput').value
    const category = document.getElementById('categoryInput').value
    const stock = document.getElementById('stockInput').value
    const price = document.getElementById('priceInput').value

    // Agregamos el producto
    addProduct(name, category, stock, price)
    renderProducts()

    // Limpiamos el formulario
    document.getElementById('productInput').value = ''
    document.getElementById('categoryInput').value = ''
    document.getElementById('stockInput').value = ''
    document.getElementById('priceInput').value = ''
  })

  // Filtrar Productos
  filterForm.addEventListener('submit', function (e) {
    // Impide la recarga de la pagina
    e.preventDefault()

    // Obtenemos el valor del filtro
    const filterValue = document.getElementById('filterInput').value

    // Filtramos los productos
    filterProducts(filterValue)
  })

  // Media Queries
  if (windowSize >= 1024) {
    addFrom.classList.add('show')
  } else {
    addFrom.classList.remove('show')
  }

  // Inicializamos
  let products = loadProduct()
  renderProducts()
}
