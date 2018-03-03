import React from 'react';
import { inject, observer } from 'mobx-react';
// CSS Imports
import _ from 'lodash';
import '../styles/_comp.css';
import '../styles/Layout.css';
import '../styles/App.css';
import '../styles/Home.css';

@inject('globalStore','channelStore')
@observer
export default class Globals extends React.Component {

  handleUpdatePatterns = (event) => {
    console.log(event.keyCode);
    //event.keyCode === 91 && 
    if(event.keyCode === 13){
      this.props.globalStore.updatePatterns();
    }
  }

  handleUpdateGlobals = (index) => {
    console.log(index);
    this.props.globalStore.updateGlobals(index);
    
  }

  handleSaveGlobals = () => {
    this.props.globalStore.saveGlobals();
    
  }

  
  render() {
  console.log("RENDER GLOBALS.JS");
  const ctx = this;
  const maskedInputDurations=  _.repeat("1.1  ", 4);
  const maskedInputPatterns = "0 | " + _.repeat("1  ", 10);
  const options = {
    mode: '_rule',
    theme: '_style',
    fixedGutter: true,
    scroll: false,
    styleSelectedText:true,
    showToken:true,
    lineWrapping: true,
    showCursorWhenSelecting: true, 
    readOnly: true
  };
  //{_.map(this.props.channelStore.getActiveChannels, this.renderGlobalChanels.bind(this))}

  return (<div className={'Globals PanelAdjuster draggableCancel'}>
    <div style={{display: 'flex', displayDirection: 'row'}}>
      <div className={'GlobalParamsInputs'}>
        <div className={'GlobalChannelInputs'}>
          <input ref={(global_channels) => { this.globalChannels = global_channels; }}
          className={"GlobalChannels-text draggableCancel"}
          placeholder={"Channels"}  
          value={this.props.globalStore.getChannels}
          onChange={() => (this.props.globalStore.updateChannels(this.globalChannels.value))}
          onClick={() =>  this.globalChannels.focus()} 
          onKeyUp={this.handleUpdatePatterns.bind(this)}/>
        </div>
        <div className={'GlobalTransformer'}>
          <input ref={(global_transformer) => { this.globalTransformer = global_transformer; }}
            className={"GlobalTransformer-text draggableCancel"}
            placeholder={"Transformer"}  
            value={this.props.globalStore.getTransform}
            onChange={() => (this.props.globalStore.updateTransformer(this.globalTransformer.value))}
            onClick={() =>  this.globalTransformer.focus()} 
            onKeyUp={this.handleUpdatePatterns.bind(this)}/>
        </div>
        <div className={'GlobalModifier'}>
          <input ref={(global_modifier) => { this.globalModifier = global_modifier; }}
          className={"GlobalModifier-text draggableCancel"}
          placeholder={"Modifier"}  
          value={this.props.globalStore.getModifier}
          onChange={() => (this.props.globalStore.updateModifier(this.globalModifier.value))}
          onClick={() =>  this.globalModifier.focus()} 
          onKeyUp={this.handleUpdatePatterns.bind(this)}/>
        </div>
      </div>
      </div>
      <div style={{display: 'flex', displayDirection: 'column'}}>
        <div style={{display: 'flex', displayDirection: 'row'}}>
          <input ref={(global_param) => { this.globalParam = global_param; }}
              className={"GlobalModifier-text draggableCancel"}
              placeholder={"Global Param to be used within patterns"}  
              value={this.props.globalStore.global_mod.param}
              onChange={() => (this.props.globalStore.updateParam(this.globalParam.value))}
              onClick={() =>  this.globalParam.focus()} 
              onKeyUp={this.handleUpdatePatterns.bind(this)}/>
          <button className={"Button draggableCancel"} onClick={this.handleSaveGlobals.bind(this)}>Save</button>
          {this.props.globalStore.getGlobals.map((glb, i) => {
            <button key={i} className={"Button draggableCancel"} onClick={this.handleUpdateGlobals.bind(this,glb)}>{glb}</button>  
          })}
          
        </div>
      </div>
    </div>
    )
  }
}      