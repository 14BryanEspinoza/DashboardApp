// Importa las funciones de utils.js
import { formatCurrency } from './utils.js'
// Importa las funciones de inventory.js
import { initInventory, loadProduct } from './inventory.js'
// Importa las funciones de orders.js
import { initOrders, loadOrders } from './orders.js'

// --- Estado Global y Configuración ---
const THEME_KEY = 'theme'
const currentTheme = localStorage.getItem(THEME_KEY) || 'light'

// --- Inicialización de UI Inmediata ---
document.body.setAttribute('data-theme', currentTheme)

// Actualiza las estadísticas del dashboard
const updateDashboardStats = () => {
  // Carga los productos y las órdenes
  const products = loadProduct()
  const orders = loadOrders()

  // Calcula las estadísticas
  const stats = {
    products: products.length,
    stock: products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0),
    orders: orders.length,
    revenue: orders.reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0),
  }

  // Establece los valores de los KPI
  const setKPI = (id, value) => {
    const el = document.getElementById(id)
    if (el) el.textContent = value
  }

  // Actualiza los KPI
  setKPI('kpi-total-products', stats.products)
  setKPI('kpi-total-stock', stats.stock)
  setKPI('kpi-total-orders', stats.orders)
  setKPI('kpi-total-revenue', formatCurrency(stats.revenue))

  // Actualiza la actividad reciente
  updateRecentActivity(orders)
  // Actualiza los gráficos
  updateCharts(products)
}

// Renderiza la lista de actividad reciente
const updateRecentActivity = (orders) => {
  // Obtiene el contenedor de la actividad reciente
  const container = document.getElementById('recentActivity')
  if (!container) return

  // Si no hay órdenes, muestra un mensaje
  if (orders.length === 0) {
    container.innerHTML =
      '<p class="text-muted text-center py-4">No hay actividad reciente registrada.</p>'
    return
  }

  // Ordena las órdenes por fecha
  const recent = [...orders].reverse().slice(0, 5)

  // Renderiza la lista de actividad reciente
  container.innerHTML = recent
    .map(
      (order) => `
    <div class="list-group-item bg-transparent border-0 px-0 py-3 d-flex justify-content-between align-items-center border-bottom">
      <div class="d-flex align-items-center gap-3">
        <div class="bg-primary bg-opacity-10 p-2 rounded-circle">
          <i class="bi bi-cart-check text-primary"></i>
        </div>
        <div>
          <h6 class="mb-0 text-main">${order.client}</h6>
          <small class="text-muted">${order.product} (${order.stock} uds)</small>
        </div>
      </div>
      <div class="text-end">
        <div class="fw-bold text-main">${formatCurrency(order.totalPrice)}</div>
      </div>
    </div>
  `
    )
    .join('')
}

// Manejo de Gráficos (Chart.js)
let productsChart, categoriesChart

// Actualiza los gráficos
const updateCharts = (products) => {
  const productsCtx = document.getElementById('productsChart')?.getContext('2d')
  const categoriesCtx = document
    .getElementById('categoriesChart')
    ?.getContext('2d')

  // Actualiza el gráfico de productos
  if (productsCtx) {
    if (productsChart) productsChart.destroy()

    // Ordena los productos por stock
    const lowStock = [...products].sort((a, b) => a.stock - b.stock).slice(0, 5)

    // Crea el gráfico de productos
    productsChart = new Chart(productsCtx, {
      type: 'bar',
      data: {
        labels: lowStock.map((p) => p.name),
        datasets: [
          {
            label: 'Stock Actual',
            data: lowStock.map((p) => p.stock),
            backgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    })
  }

  // Actualiza el gráfico de categorías
  if (categoriesCtx) {
    if (categoriesChart) categoriesChart.destroy()

    // Cuenta las categorías
    const categoryCounts = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {})

    // Crea el gráfico de categorías
    categoriesChart = new Chart(categoriesCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryCounts),
        datasets: [
          {
            data: Object.values(categoryCounts),
            backgroundColor: [
              '#3b82f6',
              '#8b5cf6',
              '#ec4899',
              '#f97316',
              '#10b981',
              '#64748b',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%',
        animation: { animateRotate: true, animateScale: true },
      },
    })
  }
}

// Manejo de la fecha
document.addEventListener('DOMContentLoaded', () => {
  // Obtiene la fecha
  const dateEl = document.getElementById('date')

  // Actualiza la fecha
  if (dateEl) {
    dateEl.textContent = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
      .format(new Date())
      .toUpperCase()
  }

  // Toggle de Tema
  const themeToggle = document.getElementById('themeToggle')

  // Actualiza el toggle de tema
  if (themeToggle) {
    // Obtiene el icono del toggle
    const icon = themeToggle.querySelector('.theme-switch__icon')

    // Actualiza el icono del toggle
    icon.textContent = currentTheme === 'dark' ? '☀️' : '🌙'

    // Event listener para el toggle de tema
    themeToggle.addEventListener('click', () => {
      // Verifica si el tema actual es oscuro
      const isDark = document.body.getAttribute('data-theme') === 'dark'
      const nextTheme = isDark ? 'light' : 'dark'

      // Actualiza el tema
      document.body.setAttribute('data-theme', nextTheme)
      localStorage.setItem(THEME_KEY, nextTheme)
      icon.textContent = nextTheme === 'dark' ? '☀️' : '🌙'
    })
  }

  // Inicializa los módulos de página
  if (document.getElementById('addForm')) initInventory()
  if (document.getElementById('addOrderForm')) initOrders()

  // Carga inicial de datos dashboard
  updateDashboardStats()

  // --- Lógica de Sidebar Mobile ---
  const sidebar = document.querySelector('.sidebar')
  const sidebarToggle = document.getElementById('sidebarToggle')
  const mainContent = document.querySelector('.main')

  if (sidebar && sidebarToggle) {
    const toggleSidebar = () => {
      sidebar.classList.toggle('sidebar--open')
      const isOpen = sidebar.classList.contains('sidebar--open')
      sidebarToggle.setAttribute(
        'aria-label',
        isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      )
      sidebarToggle.innerHTML = isOpen
        ? '<i class="bi bi-x-lg"></i>'
        : '<i class="bi bi-list"></i>'
    }

    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation()
      toggleSidebar()
    })

    // Cerrar al hacer click en el contenido principal (mobile)
    if (mainContent) {
      mainContent.addEventListener('click', () => {
        if (sidebar.classList.contains('sidebar--open')) {
          toggleSidebar()
        }
      })
    }

    // Cerrar al presionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('sidebar--open')) {
        toggleSidebar()
      }
    })
  }
})

// Listener para actualizaciones automáticas (DRY)
window.addEventListener('statsUpdated', updateDashboardStats)
