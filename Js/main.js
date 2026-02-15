import { initInventory, loadProduct } from './inventory.js'
import { initOrders } from './orders.js'

// Constantes
const date = document.getElementById('date')
const addFrom = document.getElementById('addForm')
const productsContainer = document.getElementById('products')
const addOrderForm = document.getElementById('addOrderForm')

// Métodos
const currentDate = new Date()

// Manejo de Fecha
const option = {
  year: 'numeric',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}

const formattedDate = currentDate
  .toLocaleDateString('es-ES', option)
  .toUpperCase()
date.innerText = formattedDate

// Valida si los elementos existen
if (addFrom && productsContainer) {
  initInventory()
}

if (addOrderForm) {
  initOrders()
}

// Crea el gráfico de productos stock
document.addEventListener('DOMContentLoaded', () => {
  // Constantes
  const canvas = document.getElementById('productsChart')
  if (!canvas) return

  // Contexto
  const ctx = canvas.getContext('2d')

  // LLamamos a la función para cargar los productos
  const products = loadProduct()

  // Ordenamos los productos por stock y tomamos los 3 primeros
  const top3 = [...products]
    .sort((a, b) => (a.stock ?? Infinity) - (b.stock ?? Infinity))
    .slice(0, 3)

  // Almacenamos el nombre y el stock de los 3 primeros productos
  const labels = top3.map((product) => product.name)
  const data = top3.map((product) => product.stock)

  // Creamos el gráfico
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Productos con Stock Bajo',
          data: data,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 0.8,

      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Stock',
          },
        },
      },
    },
  })
})

// Crea el gráfico de categorías
document.addEventListener('DOMContentLoaded', () => {
  const canvas2 = document.getElementById('categoriesChart')
  if (!canvas2) return

  // Cargamos los productos
  const products = loadProduct()
  // Obtenemos el contexto del canvas
  const ctx2 = canvas2.getContext('2d')

  // Obtenemos las categorías únicas
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  )

  // Contamos cuántos productos hay en cada categoría
  const data2 = categories.map((category) => {
    return products.filter((product) => product.category === category).length
  })

  // Creamos el gráfico
  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [
        {
          label: 'Categorías',
          data: data2,
          backgroundColor: [
            '#007bff',
            '#6f42c1',
            '#e83e8c',
            '#dc3545',
            '#fd7e14',
            '#ffc107',
            '#28a745',
            '#17a2b8',
            '#6c757d',
            '#000000',
          ],
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
      layout: {
        padding: 20,
      },
      cutout: '50%',
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    },
  })
})
