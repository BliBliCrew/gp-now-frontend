import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import Toast from './../../Toast'
import UserAPI from './../../UserAPI'
import AppointmentAPI from '../../AppointmentAPI'

class BookingsView {
  init(){
    document.title = 'Bookings'    
    this.appointments = null
    this.render()    
    Utils.pageIntroAnim()
    this.getBookings()
  }

  async getBookings(){
    try {
      const currentUser = await UserAPI.getUser(Auth.currentUser._id)
      this.appointments = currentUser.appointments
      console.log(this.appointments)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }
  
  render(){
    const template = html`
      <va-app-header title="YOUR BOOKINGS" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h2>${Auth.currentUser.firstName}'s</h2>
        <h1 class ="animate__animated animate__zoomIn">APPOINTMENTS</h1>
        
          <div class="doctors-grid">
            ${this.appointments == null ? html`
              <sl-spinner></sl-spinner>
            ` : html`
            ${this.appointments.map(appointment => html`
              <va-booking
                class="doctor-card"
                id="${appointment._id}"
                name="${appointment.name}"
                user="${JSON.stringify(appointment.user)}"
                image="${appointment.image}"
                day="${appointment.day}"
                time="${appointment.time}"
              >        
          `)}
        `}
      </div>

      <div class="button">
        <p>&nbsp;</p>
        ${Auth.currentUser.accessLevel == 2 ? html`
        <sl-button class="primary" @click=${() => gotoRoute('/newAppointment')}>+ Appointment</sl-button>
        ` : ``} 
        ${Auth.currentUser.accessLevel == 1 ? html`
        <sl-button class="primary" @click=${() => gotoRoute('/appointments')}>BOOK NEW</sl-button>
        ` : ``}
        <p>&nbsp;</p>
        <sl-button class="secondary" @click=${() => gotoRoute('/signin')}>LOG OUT</sl-button>  
      </div>      
    `
    render(template, App.rootEl)
  }
}

export default new BookingsView()

