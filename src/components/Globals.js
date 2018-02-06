import React from 'react';
import { inject, observer } from 'mobx-react';
// CSS Imports
import '../styles/_comp.css';
import '../styles/Layout.css';
import '../styles/App.css';
import '../styles/Home.css';

@inject('globalStore')
@observer
export default class Globals extends React.Component {
    
render() {
  console.log("RENDER GLOBALS.JS");
  
  return (<div className={'Paths PanelAdjuster draggableCancel'}/>)
  }
}
      