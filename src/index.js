import App from './App.js'

// components (custom web components)
import './components/va-app-header'
import './components/va-appointment'
import './components/va-booking'

// styles
import './scss/master.scss'

// app.init
document.addEventListener('DOMContentLoaded', () => {
  App.init()
})