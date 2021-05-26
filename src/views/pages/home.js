import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute } from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import AppointmentAPI from '../../AppointmentAPI'



class HomeView {
  init(){    
    console.log('HomeView.init')
    document.title = 'Home'  
    this.render()    
    Utils.pageIntroAnim() 
    this.getAppointments()
  }

  async getAppointments(){
    try{
      this.appointment = await AppointmentAPI.getAppointments()
      console.log(this.appointment)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }



  render(){
    const template = html`
      <va-app-header title="Home" user=${JSON.stringify(Auth.currentUser)}></va-app-header>
      
      <div class="page-content">
      
        <h2>${Auth.currentUser.firstName}</h2>
       
      
        <h1>YOUR APPOINTMENTS</h1>


        <div class= "doctors-grid">
        ${this.appointment == null ? html`
          <sl-spinner></sl-spinner>
        ` : html`
          ${this.appointment.map(appointment => html`
            
          <va-appointment class= "doctor-card"
            id="${appointment._id}"
            name="${appointment.name}"
            user="${JSON.stringify(appointment.user)}"
            image="${appointment.image}"
            >
          </va-appointment>
          
          `)}
        `}
        </div>

          <div class="button">
    
          <sl-button class="primary" @click=${() => gotoRoute('/appointments')}>BOOK NOW</sl-button>
          <p>&nbsp;</p>
          <sl-button class="secondary" @click=${() => gotoRoute('/signin')}>LOG OUT</sl-button>
        
      
    
        
       
      </div>
      </div>
     
    `

    
    render(template, App.rootEl)
  }
}

export default new HomeView()