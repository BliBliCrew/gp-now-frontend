import { LitElement, html, css } from '@polymer/lit-element'
import {anchorRoute, gotoRoute} from './../Router'
import Auth from './../Auth'
import App from './../App'

customElements.define('va-app-header', class AppHeader extends LitElement {
  constructor(){
    super()    
  }

  // retrive properties
  static get properties(){
    return {
      title: {
        type: String
      },
      user: {
        type: Object
      }
    }
  }

  // update links
  firstUpdated(){
    super.firstUpdated()
    this.navActiveLinks()    
  }

  navActiveLinks(){	
    const currentPath = window.location.pathname
    const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a')
    navLinks.forEach(navLink => {
      if(navLink.href.slice(-1) == '#') return
      if(navLink.pathname === currentPath){			
        navLink.classList.add('active')
      }
    })
  }

  hamburgerClick(){  
    const appMenu = this.shadowRoot.querySelector('.app-side-menu')
    appMenu.show()
  }
  
  menuClick(e){
    e.preventDefault()
    const pathname = e.target.closest('a').pathname
    const appSideMenu = this.shadowRoot.querySelector('.app-side-menu')
    // hide appMenu
    appSideMenu.hide()
    appSideMenu.addEventListener('sl-after-hide', () => {
      // go to route after menu is hidden
      gotoRoute(pathname)
    })
  }

  // render the page
  render(){    
    return html`
    
    <style>      
      * {
        box-sizing: border-box;
      }
      .app-header {
        width: 100%;
        background: white;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        height: var(--app-header-height);
        color: #fff;
        display: flex;
        z-index: 9;
        box-shadow: 4px 0px 10px rgba(0,0,0,0.2);
        align-items: center;
      }
      
      .app-header-main {
        align-items: center;
      }

      .app-header-main::slotted(h1){
        color: #fff;
      }

      .app-logo a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        font-size: 1.2em;
        padding: .6em;
        display: inline-block;        
      }

      .app-logo img {
        width: 90px;
      }
      
      .hamburger-btn::part(base) {
        color: black;
        visibility: hidden;
      }

      .app-top-nav {
      }

      .app-top-nav a {
        display: inline-block;
        padding: .8em;
        text-decoration: none;
        color: grey;
      }
      
      .app-side-menu-items {
        padding-top: 3em;
      }

      .app-side-menu-items a {
        display: block;
        padding: .5em;
        text-decoration: none;
        font-size: 1.3em;
        color: grey;
      }

      .app-side-menu-logo {
        width: 120px;
        margin-bottom: 1em;
        position: absolute;
        top: 2em;
        left: 1.5em;
      }

      .page-title {
        color: var(--app-header-txt-color);
        margin-right: 0.5em;
        font-size: var(--app-header-title-font-size);
      }

      /* active nav links */
      .app-top-nav a.active,
      .app-side-menu-items a.active {
        font-weight: bold;
        color: #27d39d;
      }

      .logo {
        display: flex;
        margin-top: 4em;
        max-width: 2%;
        min-width: 3%;
      }

      sl-dropdown { 
        float: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      /* RESPONSIVE - MOBILE ------------------- */
      @media all and (max-width: 768px){       
        
        .app-top-nav {
          display: none;
        }

        .logo {
          min-width: 10%;
          loat: none;
          position: absolute;
          top: 2%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .hamburger-btn::part(base) {
          color: black;
          visibility: visible;
        }

        sl-dropdown {
          float: right;
          position: absolute;
          top: 50%;
          left: 90%;    
        }
      }
    </style>

    <header class="app-header">
      <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}" style="font-size: 1.5em;"></sl-icon-button>       
      <div class ="logo">
        <a href="/">
      <img src= "/images/logo.png" style="width:90%;height:auto;">
      </div>
      </a>
      <nav class="app-top-nav">
        <a href="/" @click="${anchorRoute}">HOME</a> 
        <a href="profile" @click="${anchorRoute}">PROFILE</a> 
        ${this.user.accessLevel == 2 ? html`
          <a href="/newAppointment" @click="${anchorRoute}">+ APPOINTMENT</a>
        ` : ``}    
       </nav>

      <sl-dropdown>
        <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
          <sl-avatar style="--size: 50px;" image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ''}></sl-avatar> 
        </a>
      
        <sl-menu>    
          <sl-menu-item @click="${() => gotoRoute('/profile')}">Profile</sl-menu-item>
          <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Edit Profile</sl-menu-item>
          <sl-menu-item @click="${() => Auth.signOut()}">Sign Out</sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    </header>

    <sl-drawer class="app-side-menu" placement="left">
      <img class="app-side-menu-logo" src="/images/logo.png" style="width:15%;height:auto;">
    
      <nav class="app-side-menu-items">
        <a href="/" @click="${this.menuClick}">Home</a>
        ${this.user.accessLevel == 2 ? html`
          <a href="/newAppointment" @click="${this.menuClick}">Add Appointment</a>
        ` : ``} 
        ${this.user.accessLevel == 1 ? html`
          <a href="/appointments" @click="${anchorRoute}">Book New</a>
        ` : ``}
        <a href="/profile" @click="${this.menuClick}">Profile</a>
        <a href="#" @click="${() => Auth.signOut()}">Log Out</a>
      </nav>  
    </sl-drawer>
  `} 
})