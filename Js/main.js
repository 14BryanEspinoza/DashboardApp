import { initInventory } from './inventory.js'

// Constantes
const date = document.getElementById('date')
const addFrom = document.getElementById('addForm')
const productsContainer = document.getElementById('products')

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
