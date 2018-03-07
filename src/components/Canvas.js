import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import P5Wrapper from 'react-p5-wrapper';
import patternRoll from './patternRoll/main.js';

// import vis_patternRoll from './patternRolles/tempo';

// import GL from "gl-react";
// import GLReactDOM from "gl-react-dom";

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

    let dimensions = this.updateDimensions();
    let width = dimensions ? dimensions.w: 600;
    let height = dimensions ? dimensions.h: 90;
        
    return (<div className={"Canvas draggableCancel"}>
      <div className={'CanvasControls'}>
        <div>Cycles:
          <input className={'Input'}
            placeholder={8}
            onChange={(e) => {this.props.rollStore.updateCycles(_.toInteger(e.target.value))}}/>
        </div>
        <div>Resolution:
          <input className={'Input'} 
            placeholder={12} 
            onChange={(e) => {this.props.rollStore.updateResolution(_.toInteger(e.target.value))}}/>
        </div>
        <button className={"Button"}
          onClick={(e) => {
            this.props.rollStore.reloadRoll(true);
            _.delay(() => { this.props.rollStore.reloadRoll(false) }, 50)
          }
          }>⭯</button>
      </div>

      <div className={'CanvasSketch'}>
        {<P5Wrapper sketch={patternRoll}
            width={width}
            height={height}
            resolution={this.props.rollStore.resolution ? this.props.rollStore.resolution : 12}
            cycles={this.props.rollStore.cycles ? this.props.rollStore.cycles : 8}
            reload={this.props.rollStore.reload}
            activeMatrix={this.props.rollStore.activeMatrix}
            message={this.props.rollStore.value} />}
      </div>
    </div>);
  }
}

