import React from 'react';
import { inject, observer } from 'mobx-react';

// CSS Imports
import '../styles/_comp.css';
import '../styles/Layout.css';
import '../styles/App.css';
import '../styles/MenuBar.css';
import Popup from "reactjs-popup";

//Keys
import { save } from '../keyFunctions'

@inject('menubarStore', 'pulseStore', 'pathStore')
@observer
export default class MenuBar extends React.Component {

  render() {
    console.log("RENDER MENUBAR.JS");

    let serverStatusClass = 'ServerStatus';
    if (this.props.menubarStore.getActive === 0) 
      serverStatusClass += ' inactive';
    else if (this.props.menubarStore.getActive === 1) 
      serverStatusClass += ' ready';
    else if (this.props.menubarStore.getActive === 2) 
      serverStatusClass += ' running';

    const startServer = () => {
      this.props.menubarStore.bootServer(this.props.pathStore.paths);
    }
    const stopServer = () => {
      this.props.menubarStore.stopServer()
    }


    return (<div className='MenuBar boxshadow'>
      <div style={{display: 'flex', displayDirection: 'row'}}>
        <div className={'Logo'}>
        {<img alt="" src={require('../assets/logo.svg')}  height={35} width={35}/> }
        </div>
      </div>
      <div className= 'enabledView'  style={{display: 'flex', flexDirection: 'row', height: 40}}>
        <div className={serverStatusClass}></div>
          {this.props.menubarStore.getActive === 0 && 
            <button className={'Button draggableCancel ' } 
              onClick={startServer}>Boot Server</button>}  
          {this.props.menubarStore.getActive === 1 && 
            <button className={'Button draggableCancel ' } 
              onClick={startServer}>Boot Server</button>}  
          {this.props.menubarStore.getActive === 2 && 
            <button className={'Button draggableCancel ' } 
              onClick={stopServer}>Stop Server</button>}
        <div className={"TimerControls"}>
          {!this.props.pulseStore.isActive && 
            <img src={require('../assets/play@3x.png')} title={'Start Pulse'}
                onClick={() => (this.props.pulseStore.startPulse())} alt="" height={45} width={45}/>}
          {this.props.pulseStore.isActive && 
            <img src={require('../assets/stop@3x.png')} title={'Stop Pulse'}
                onClick={() => (this.props.pulseStore.stopPulse())} alt="" height={45} width={45}/>}
                
        </div>
        <div>
        <Popup trigger={<button className={"OtherControls Button"} >Help</button>} position="bottom">
        <div>
        <strong>Keybinds
        </strong> 
        Compile: cmd/ctrl + enter
        <br/>
        Cell Selection: Enter
        <br/>
        Multiple Cell Selection: Shift + Enter
        <br/>
        Copy Cells: cmd/ctrl + Enter
        <br/>
        Cut Cells: cmd/ctrl + X
        <br/>
        Paste Cells: cmd/ctrl + V

        
        </div>
          </Popup>
        </div>
        <button className={"OtherControls Button"} title={"Save"} onClick={save}>⇩</button>
        <button className={"OtherControls Button"} title={"Refresh Page"} 
          onClick={() => {if(window.confirm('Do you want to refresh page? Unsaved changes will be destroyed.')) {
            window.location.reload(false)}}}>⭯</button>
      </div>
    </div>)
  }
}