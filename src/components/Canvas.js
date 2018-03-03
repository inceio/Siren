import _ from 'lodash';
import React from 'react';
import { inject, observer } from 'mobx-react';
import '../styles/_comp.css';
import '../styles/Layout.css';
import '../styles/App.css';
import '../styles/Home.css';
import '../styles/ContextMenu.css';

import P5Wrapper from 'react-p5-wrapper';
import patternRoll from './patternRoll/main';
// import vis_patternRoll from './patternRolles/tempo';

import GL from "gl-react";
import GLReactDOM from "gl-react-dom";
@inject('rollStore')
@observer
export default class Canvas extends React.Component {
  

  updateDimensions() {
    const element = document.getElementById('canvasLayout');
    if(element && element !== null){
      const w = element.clientWidth;
      const h = element.clientHeight;

      // -25 (header) -3 (borders) -24 (controls) -1 border
      return {w: w, h: h-53};
    }
  }

  render() {
    const ctx = this;

    // SINGLE MESSAGE STRUCTURE
    // {time, args}

    // STACK MESSAGE STRUCTURE
    // 0: Array(2)
    //   0:
    //     s: "hh"
    //     t: Array(1)
    //       0:
    //         cycle: 902,
    //         delta: 0.5,
    //         time: 901.41357317311
    let time = 1; 
    let rate = 1;
    let depth = 1
    let msg = this.props.rollStore.trigger_msg;
    if (msg !== undefined) {
      // console.log(msg);
      time = msg['time'] !== undefined ? msg['time'] : 0;
      rate = Math.sin(time)/2; //msg['cycleInfo'] !== undefined ? _.toNumber(msg['cycleInfo']['delta']) : 0.5;
      depth = msg['cycleInfo'] !== undefined ? _.toNumber(msg['cycleInfo']['delta']) : 0.5;
    }
    
      // TODO: 
      // Listen to patternRoll window events to toggle `isEditor`
      const handleClickProcessing = event => {
        const ctx = this;
        if(!this.props.rollStore.isEditor) {
          console.log("Interpreting Editor");
          //this.props.rollStore.startProcessing("localhost:3001");
          //this.props.rollStore.updateEditor(true);
        }
      }
      const handleClickChange = event => {
        //this.props.rollStore.setContent(this.props.rollStore.content+1 % this.props.rollStore.maxContent);      
      }

      let dimensions = this.updateDimensions();
      let width = dimensions ? dimensions.w: 600;
      let height = dimensions ? dimensions.h: 90;
        
      return (<div className={"Canvas draggableCancel"}>
        <div className={'CanvasControls'}>
          <div>Cycles: <input className = {'Input'} ref={(input) => { this.cycles = input; }} 
          placeholder={8}
          onChange={() => 
              (this.props.rollStore.updateCycles(this.cycles))}/>
              </div>
          <div>Resolution: <input ref={(input) => { this.resolution = input; }} 
              placeholder={12} 
              onChange={() => 
              (this.props.rollStore.updateResolution(this.resolution))}/> </div>
              <button onClick={(e) => {this.props.rollStore.reloadRoll(true)
                                                _.delay(() => {
                                                    this.props.rollStore.reloadRoll(false)}, 50)}}>
                                                  ⭯</button>
              <button className={'Button'} onClick={handleClickChange} > {"Change Content ("+this.props.rollStore.content + ")"} </button>
          <button className={'Button'} onClick={handleClickProcessing} > {"Editor"} </button>
          </div>
        <div className={'CanvaspatternRoll'}>
        this.props.rollStore.content === 0 && 
        <P5Wrapper patternRoll={patternRoll}
                  width={dimensions ? dimensions.w: 600}
                  height={dimensions ? dimensions.h: 90}
                  resolution={this.props.rollStore.resolution ? this.props.rollStore.resolution : 12}
                  cycles={this.props.rollStore.cycles ? this.props.rollStore.cycles : 8}
                  reload={this.props.rollStore.reload}
                  activeMatrix={this.props.rollStore.activeMatrix}
                  message={this.props.rollStore.trigger_msg}/>
        
      
        </div>
      </div>);
    }
}

