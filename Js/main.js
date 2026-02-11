// Constantes
const date = document.getElementById('date')

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
