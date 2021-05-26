import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../utils'
import AppointmentAPI from '../../AppointmentAPI'
import Toast from '../../Toast'

class AppointmentsView {
  async init(){
    document.title = 'Appointments'   
    this.appointments = null 
    this.render()    
    Utils.pageIntroAnim()
    await this.getAppointments()
  }

  async filterAppointments(field, match){
    // validate
    if(!field || !match) return

    // get refresh copy of appointments
    this.appointments = await AppointmentAPI.getAppointments()

    let filteredAppointments 

    // name
    if(field == 'name'){
      filteredAppointments = this.appointments.filter(appointment => appointment.name == match)
    }

    // day 
    if(field == 'day'){
        filteredAppointments = this.appointments.filter(appointment => appointment.day == match) 
    }

    // time 
    if(field == 'time'){
      // get timeRangeStart
      const timeRangeStart = match.split('-')[0]
      const timeRangeEnd = match.split('-')[1]
      filteredAppointments = this.appointments.filter(appointment => appointment.time >= timeRangeStart && appointment.time <= timeRangeEnd)
    }

    // render
    this.appointments = filteredAppointments
    this.render()
  }

  clearFilterBtns() {
    const filterBtns = document.querySelectorAll('.filter-btn')
    filterBtns.forEach(btn => btn.removeAttribute("type") )
  }

  handleFilterBtn(e){
    // clear all filter buttons 
    this.clearFilterBtns()

    // set button active (type = primary)
    e.target.setAttribute("type", "primary")

    // extract the field and match from the button
    const field = e.target.getAttribute("data-field")
    const match = e.target.getAttribute("data-match")

    // filter appointments
    this.filterAppointments(field, match)

  }

  clearFilters() {
    this.getAppointments()
    this.clearFilterBtns()
  }

  async getAppointments(){
    try{
      this.appointments = await AppointmentAPI.getAppointments()
      console.log(this.appointments)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  render(){
    const template = html`

      <style>
        .filter-menu {
          justify-content: center;
          display: flex;
        }

        .filter-menu > div {
          margin-right: 2em;
        }

        sl-button.filter-btn::part(base) {
          /* Set design tokens for height and border width */
          --sl-input-height-medium: 48px;
          margin: 2px;
          border-radius: 5em;
          background-color: #ffffff;;
          color: #878787;
          font-size: 1.125rem;
          box-shadow: 0px 0px 10px #0002;
          transition: var(--sl-transition-medium) transform ease, var(--sl-transition-medium) border ease;
        }
        
        sl-button.filter-btn::part(base):hover {
          transform: scale(1.05) rotate(-1deg);
        }
        
        sl-button.filter-btn::part(base):active {
          background-color: #198261;
          transform: scale(1.05) rotate(-1deg) translateY(2px);
          }
       
      </style>

      <va-app-header title="BOOK NOW" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">      
      <h2>${Auth.currentUser.firstName}</h2>
      <h1 class ="animate__animated animate__zoomIn">BOOK NOW</h1>

        <div class="filter-menu">
          <div>
            <h2>Filter by:</h2>
          </div>
            <div>
              <strong>Name</strong>
                <sl-button class="filter-btn" size="small" data-field="name" data-match="Dr Xuan" @click=${this.handleFilterBtn.bind(this)}>Dr Xuan</sl-button>
                <sl-button class="filter-btn" size="small" data-field="name" data-match="Dr Reid" @click=${this.handleFilterBtn.bind(this)}>Dr Reid</sl-button>
                <sl-button class="filter-btn" size="small" data-field="name" data-match="Dr Smith" @click=${this.handleFilterBtn.bind(this)}>Dr Smith</sl-button>
            </div>
            <div>
              <strong>Day</strong>
                <sl-button class="filter-btn" size="small" data-field="day" data-match="Monday" @click=${this.handleFilterBtn.bind(this)}>Mon</sl-button>
                <sl-button class="filter-btn" size="small" data-field="day" data-match="Tuesday" @click=${this.handleFilterBtn.bind(this)}>Tues</sl-button>
                <sl-button class="filter-btn" size="small" data-field="day" data-match="Wednesday" @click=${this.handleFilterBtn.bind(this)}>Wed</sl-button>
                <sl-button class="filter-btn" size="small" data-field="day" data-match="Thursday" @click=${this.handleFilterBtn.bind(this)}>Thurs</sl-button>
                <sl-button class="filter-btn" size="small" data-field="day" data-match="Friday" @click=${this.handleFilterBtn.bind(this)}>Fri</sl-button>
                <sl-button class="filter-btn" size="small" data-field="day" data-match="Saturday" @click=${this.handleFilterBtn.bind(this)}>Sat</sl-button>
            </div>
            <div>
              <strong>Time</strong>
                <sl-button class="filter-btn" size="small" data-field="time" data-match="9:00-11:00" @click=${this.handleFilterBtn.bind(this)}>9:00-11:00</sl-button>
                <sl-button class="filter-btn" size="small" data-field="time" data-match="11:00-13:00" @click=${this.handleFilterBtn.bind(this)}>11:00-13:00</sl-button>
                <sl-button class="filter-btn" size="small" data-field="time" data-match="13:00-15:00" @click=${this.handleFilterBtn.bind(this)}>13:00-15:00</sl-button>
                <sl-button class="filter-btn" size="small" data-field="time" data-match="15:00-17:00" @click=${this.handleFilterBtn.bind(this)}>15:00-17:00</sl-button>
            </div
            <div>
              <sl-button class= "primary" size="small" @click=${this.clearFilters.bind(this)}>Clear Filters</sl-button>
            </div>
        
     
        <div class= "doctors-grid">
        ${this.appointments == null ? html`
          <sl-spinner></sl-spinner>
        ` : html`
          ${this.appointments.map(appointment => html`
            
          <va-appointment
            class= "doctor-card"
            id="${appointment._id}"
            name="${appointment.name}" 
            day="${appointment.day}"
            time="${appointment.time}"
            user="${JSON.stringify(appointment.user)}"
            image="${appointment.image}"
            bio="${appointment.bio}"
            >
          </va-appointment>
          `)}
        `}
        </div>

      <div class="button">
        <p>&nbsp;</p>
        <sl-button class="secondary" @click=${() => gotoRoute('/')}>CANCEL</sl-button>
      </div>
    </div>
  `
    render(template, App.rootEl)
  }
}

export default new AppointmentsView()