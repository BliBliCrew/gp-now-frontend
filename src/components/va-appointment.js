import { LitElement, html, css } from '@polymer/lit-element'
import { render } from 'lit-html'
import {anchorRoute, gotoRoute} from './../Router'
import Auth from './../Auth'
import App from './../App'
import UserAPI from './../UserAPI'
import Toast from './../Toast'
import AppointmentAPI from '../AppointmentAPI'
import appointments from '../views/pages/appointments'

customElements.define('va-appointment', class Appointment extends LitElement {
  constructor(){
    super()    
  }

  static get properties(){
    return {
        id: {
          type: String
        },
        name: {
            type: String
        },
        day: {
            type: String
        },
        time: {
            type: String
        },
        user: {
            type: Object
        },  
        image: {
            type: String
        }, 
        bio: {
          type: String
      }, 
    }
  }

  firstUpdated(){
    super.firstUpdated()
  }

  bioHandler(){
    // create sl-dialog 
    const dialogEl = document.createElement('sl-dialog')
    // add class name
    dialogEl.className = 'doctor-dialog'
    // sl-dialog content
    const dialogContent = html`
    <style>
      .wrap {
        display: flex;
      }
      .image {
        width: 50%;
      }
      .image img {
        width: 100%;
      }
      .content {
        padding-left: 1em;
      } 

      .sl-button {
        color: var(--brand-color);
      }
    </style>

    <div class="wrap">
      <div class="image">
        <img src="${App.apiBase}/images/${this.image}" alt="${this.name}" />
      </div>
      <div class="content">
        <h1>${this.name}</h1>
        <p>${this.bio}</p> 
      </div>
    </div>
    `

    render(dialogContent, dialogEl)

    // append to document.body
    document.body.append(dialogEl)

    // show sl-dialog
    dialogEl.show()

    // on hide delete dialogEl
    dialogEl.addEventListener('sl-after-hide', () => {
      dialogEl.remove()
    })
  }

  async addAppointmentHandler(){    
    try {
      await UserAPI.addAppointment(this.id)
      Toast.show('Successfully Booked')
       
      }catch(err){
      Toast.show(err, 'error')
    }
    window.open('/')
  }

  render(){    
    return html`
    <style>
    .doctor {
      text-align: center;
      padding-bottom: 2em;
    }

    img {
      width: 20em;
    }

    h2 {
     text-align: center;
    }
    </style>

    <sl-card class= "doctor"> 
      <img slot="image" src="${App.apiBase}/images/${this.image}" />
      <h2>${this.name}</h2>
      <p>${this.day}</p>
      <p>${this.time}</p>
      <sl-button @click=${this.bioHandler.bind(this)}>Bio</sl-button>
      <sl-button @click=${this.addAppointmentHandler.bind(this)}>BOOK</sl-button>
    </sl-card>
  `} 
})