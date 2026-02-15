import { initInventory } from './inventory.js'
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
