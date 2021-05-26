import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import AppointmentAPI from './../../AppointmentAPI'
import Toast from '../../Toast'

class NewAppointmentView {
  init(){
    document.title = 'NewAppointment'    
    this.render()    
    Utils.pageIntroAnim()
  }

  async newAppointmentHandler(e) {
    e.preventDefault()
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')    
    const formData = e.detail.formData

    try{
      await AppointmentAPI.newAppointment(formData)
      Toast.show('Appointment Added')
      submitBtn.removeAttribute('loading')
      // reset form
      // reset text & textarea inputs
      const textInputs = document.querySelectorAll('sl-input, sl-textarea')
      if(textInputs) textInputs.forEach(textInput => textInput.value = null)
      // reset radio inputs
      const radioInputs = document.querySelectorAll('sl-radio')
      if(radioInputs) radioInputs.forEach(radioInput => radioInput.removeAttribute('checked'))
      // reset file input
      const fileInput = document.querySelector('input[type=file]')
      if(fileInput) fileInput.value = null
      
      const timeInput = document.querySelector('sl-select')
      if(timeInput) timeInput.value = null


    }catch(err){
      Toast.show(err, 'error')
      submitBtn.removeAttribute('loading')
    }
  }

  render(){
    const template = html`
      <va-app-header title="Add an Appointment" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">        
        <h1>Add an Appointment</h1>
        <p>Doctors Name</p>
        <p>&nbsp;</p>
        <sl-form class="page-form" @sl-submit=${this.newAppointmentHandler}>
        <input type="hidden" name="user" value="${Auth.currentUser._id}" />
        <div class="input-group">
          
        <sl-input name="name" type="text" placeholder="Dr...." required value="Dr ${Auth.currentUser.lastName}"></sl-input>
        </div>
        <p>Bio</p>
        <p>&nbsp;</p>
        <div class="input-group">
        <sl-textarea name="bio" rows="4" placeholder= "bio" value="${Auth.currentUser.bio}"></sl-textarea>
        </div>
        <div class="input-group" style="margin-bottom: 2em;">
          <label>Profile Pic</label>
          <p>&nbsp;</p>
          <input type="file" name="image" />              
        </div>
        <div class="input-group" style="margin-bottom: 2em;">
          <label>Day</label>
          <p>&nbsp;</p>
          <sl-radio-group label="Select Day" no-fieldset>
            <sl-radio name="day" value="Monday">Monday</sl-radio>
            <sl-radio name="day" value="Tuesday">Tuesday</sl-radio>
            <sl-radio name="day" value="Wednesday">Wednesday</sl-radio>
            <sl-radio name="day" value="Thursday">Thursday</sl-radio>
            <sl-radio name="day" value="Friday">Friday</sl-radio>
            <sl-radio name="day" value="Saturday">Saturday</sl-radio>
          </sl-radio-group>
        </div>
        <div class="input-time">
        <label>Time</label>
        <p>&nbsp;</p>
              <sl-select name="time" placeholder="Select">
                <sl-menu-item value="9:00">9:00</sl-menu-item>
                <sl-menu-item value="10:00">10:00</sl-menu-item>
                <sl-menu-item value="11:00">11:00</sl-menu-item>
                <sl-menu-item value="12:00">12:00</sl-menu-item>
                <sl-menu-item value="13:00">13:00</sl-menu-item>
                <sl-menu-item value="14:00">14:00</sl-menu-item>
                <sl-menu-item value="15:00">15:00</sl-menu-item>
                <sl-menu-item value="16:00">16:00</sl-menu-item>
                <sl-menu-item value="17:00">17:00</sl-menu-item>
              </sl-select>
            </div>
        <sl-button type="primary" class="submit-btn" submit>ADD APPOINTMENT</sl-button>
      </sl-form>    
      <div class=" cancel-btn">
      <p>&nbsp;</p>
        <sl-button class="secondary" @click=${() => gotoRoute('/')}>CANCEL</sl-button>
     
  
      </div>

      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new NewAppointmentView()

