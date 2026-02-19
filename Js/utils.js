// Local Storage
export const Storage = {
  // Obtiene los datos de local storage
  get(key) {
    // Obtiene los datos de local storage
    const item = localStorage.getItem(key)

    // Si no hay datos, devuelve un array vacío
    if (!item) return []

    try {
      // Intenta parsear los datos
      return JSON.parse(item)
    } catch (error) {
      // Si hay un error, muestra un mensaje de error
      console.error(`Error parsing Storage key "${key}":`, error)
      return []
    }
  },

  // Establece los datos en local storage
  set(key, value) {
    // Intenta establecer los datos en local storage
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      // Si hay un error, muestra un mensaje de error
      console.error(`Error saving to Storage key "${key}":`, error)
    }
  },
}

// Formatea un número como moneda (USD)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Crea una tarjeta estándar
export const createCard = ({ title, price, details, onDelete }) => {
  // Crea un elemento article
  const card = document.createElement('article')

  // Añade la clase card
  card.className = 'card'

  // Añade el contenido HTML
  card.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">${title}</h2>
      <span class="card-price">${formatCurrency(price)}</span>
    </div>
    <div class="card-body">
      ${details.map((detail) => `<p class="card-text">${detail}</p>`).join('')}
    </div>
    <div class="card-footer">
      <button class="btn btn-danger btn-delete" aria-label="Eliminar ${title}">Eliminar</button>
    </div>
  `

  // Obtiene el botón de eliminar
  const deleteBtn = card.querySelector('.btn-delete')

  // Añade el event listener para eliminar
  deleteBtn.addEventListener('click', onDelete)

  // Devuelve la tarjeta
  return card
}
