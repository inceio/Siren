import React from 'react';
import { inject, observer } from 'mobx-react';
// CSS Imports
import '../styles/_comp.css';
import '../styles/Layout.css';
import '../styles/App.css';
import '../styles/Home.css';

@inject('historyStore')
@observer
export default class PatternHistory extends React.Component {
    
render() {
  console.log("RENDER PATTERNHISTORY.JS");
  
  return (<div className={'Paths PanelAdjuster draggableCancel'}/>)
  }
}
      