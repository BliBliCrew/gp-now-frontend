import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import UserAPI from './../../UserAPI'
import Toast from '../../Toast'

class GuideView {
  init(){
    document.title = 'Guide'    
    this.render()    
    Utils.pageIntroAnim()
    this.updateCurrentUser()
  }

  async updateCurrentUser(){
    try{
      const updatedUser = await UserAPI.updateUser(Auth.currentUser._id, { newUser: false }, 'json')
      console.log('user updated')
      console.log(updatedUser)
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  render(){
    const template = html`
      <va-app-header title="Guide" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content calign">        
      <h1 class="animate__animated animate__zoomIn">Welcome ${Auth.currentUser.firstName}!</h1>
      <p>This basic tour will teach you the functionality of GP NOW</p>
      
      <div class="guide-step">
        <h4>Review any currently booked appointments</h4>
        <img src="/images/Tour1.jpg">
      </div>
      
      <div class="guide-step">
        <h4>Book a new appointment</h4>
        <img src="/images/Tour2.jpg">
      </div>
      
      <div class="guide-step">
        <h4>Cancel an appointment</h4>
        <img src="/images/Tour3.jpg">
      </div>
      
      <sl-button type="primary" class="primary" @click=${() => gotoRoute('/')}>Okay got it!</sl-button>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new GuideView()