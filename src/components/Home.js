import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import Pattern from './Pattern';
import Console from './Console';
import Scene from './Scene';
import Paths from './Paths';
import Grid from './Channel';
import PatternHistory from './PatternHistory';
import Globals from './Globals';
import Canvas from './Canvas';
// CSS Imports
import '../styles/_comp.css';
import '../styles/Layout.css';
import '../styles/App.css';
import '../styles/Home.css';
import '../styles/ContextMenu.css';

import {SubMenu, ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { save, timer } from '../keyFunctions'

// Grid Layout Initialization
let ReactGridLayout = require('react-grid-layout');
let WidthProvider = ReactGridLayout.WidthProvider;
let ResponsiveReactGridLayout = WidthProvider(ReactGridLayout.Responsive);

let keymaster = require('keymaster');

@inject('layoutStore', 'sceneStore', 'channelStore')
@observer
export default class Home extends React.Component {
  componentDidMount(){
    keymaster('⌘+s, ctrl+s', save); 
    keymaster('ctrl+enter', timer); 
  }
  componentWillUnmount() {
    keymaster.unbind('⌘+s, ctrl+s', save);
    keymaster.unbind('ctrl+enter', timer); 
  }

  handleChangeLayout = layout => {
    this.props.layoutStore.onLayoutChange(layout);
  };
 
  renderLayouts(layoutItem) {
    let {layoutStore} = this.props;
    let pos;
    if (layoutItem.i === 'matrix') {
      return layoutItem.isVisible && (<div key={'matrix'} data-grid={layoutStore.gridParameters('matrix')} >
        <div className={"PanelHeader"}> ■ {this.props.sceneStore.activeScene}
          <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("matrix")}>X</span>
        </div>
        <div className={'PanelAdjuster'}>
          <Grid className={"draggableCancel"}/>
        </div>
      </div>);
    }
    else if (layoutItem.i === 'canvas') {
      return layoutItem.isVisible && (<div key={'canvas'}  id={'canvasLayout'} data-grid={layoutStore.gridParameters('canvas')} >
        <div className={"PanelHeader"}> ■ PatternRoll
          <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("canvas")}>X</span>
        </div>
        <div className={'Canvas PanelAdjuster'}>
        <Canvas/>
        </div>
      </div>);
    }
    else if (layoutItem.i === 'scenes') {
      return layoutItem.isVisible && (<div key={"scenes"}  data-grid={layoutStore.gridParameters('scenes')}>
        <div>
          <div className={"PanelHeader"}> ■ Scenes
            <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("scenes")}>X</span>
          </div>
          <div className={'Scenes PanelAdjuster'}>
            <Scene />
          </div>
        </div>
      </div>);
    }
    else if (layoutItem.i === 'patterns') {
      return layoutItem.isVisible && (<div key={'patterns'}  data-grid={layoutStore.gridParameters('patterns')}>
        <div className={"PanelHeader"}> ■ Patterns 
          <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("patterns")}>X</span>
        </div>
        <div className={'AllPatterns PanelAdjuster'}>
          <Pattern/> 
        </div>
      </div>);
    }
    else if (layoutItem.i === 'pattern_history') {
      return layoutItem.isVisible && (<div key={'pattern_history'}  data-grid={layoutStore.gridParameters('pattern_history')}>
        <div className={"PanelHeader"}> ■ Pattern History
          <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("pattern_history")}>X</span>
        </div>
        <div className={'defaultPatternHistoryArea PanelAdjuster'}>
          <PatternHistory />
        </div>
      </div>);
    }
    else if (layoutItem.i === 'channel_add') {
      return layoutItem.isVisible && (<div key={'channel_add'}  data-grid={layoutStore.gridParameters('channel_add')}>
        <div className={"PanelHeader"}> ■ Add Channel
          <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("channel_add")}>X</span>
        </div>
        <div className={'XXX PanelAdjuster'}></div>
      </div>);
    }
    else if (layoutItem.i === 'globals') {
      return layoutItem.isVisible && (<div key={'globals'}  data-grid={layoutStore.gridParameters('globals')}>
        <div className={"PanelHeader"}> ■ Global Parameters
          <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("globals")}>X</span>
        </div>
        <div className={'XXX PanelAdjuster'}>
        <Globals/>
        </div>
      </div>);
    }
    else if (layoutItem.i === 'console') {
      return layoutItem.isVisible && (<div key={'console'}  data-grid={layoutStore.gridParameters('console')}>
        <div className={"PanelHeader"}> ■ Console
          <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("console")}>X</span>
        </div>
        <div className={'Console PanelAdjuster'}>
          <Console />
        </div>
      </div>);
    }
    else if (layoutItem.i === 'debugconsole') {
      return layoutItem.isVisible && (<div key={'debugconsole'} data-grid={layoutStore.gridParameters('debugconsole')}>
        <div className={"PanelHeader"}> ■ Debug Console
          <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("debugconsole")}>X</span>
        </div>
        <div className={'XXX PanelAdjuster'}>
        </div>
      </div>);
    }
    else if (layoutItem.i === 'paths') {
      return layoutItem.isVisible && (<div key={'paths'} data-grid={layoutStore.gridParameters('paths')}>
        <div className={"PanelHeader"}> ■ Config Paths
          <span className={"PanelClose draggableCancel"} onClick={() => layoutStore.hideLayout("paths")}>X</span>
        </div>
        <div className={'Paths PanelAdjuster'}>
          <Paths/>
        </div>
      </div>);
    }
    else {
      return layoutItem.isVisible && (<div key={"unknown_layout"} data-grid={layoutStore.gridParameters(layoutItem.i)}>
        unknown_layout
        </div>)
    }
  }
  handleRightClick = (param, {target: { value }}) => {
    // if(param.type === 'sceneSave') save;
    if(param.type === 'channelAdd') this.props.channelStore.addChannel('temp','',8, '');
    else if(param.type === 'modulesRemove') this.props.layoutStore.hideLayout(param.val);
    else if(param.type === 'modulesAdd') this.props.layoutStore.showLayout(param.val);
    else if(param.type === 'layoutSave') this.props.layoutStore.save();
    else if(param.type === 'layoutReset') this.props.layoutStore.reset();
    else if(param.type === 'matrixFull') this.props.layoutStore.matrixFullscreen();
    else if(param.type === 'layoutLoadCustom') this.props.layoutStore.loadCustom(param.val);
    else if(param.type === 'layoutSaveCustom') this.props.layoutStore.saveCustom(param.val);
    else if(param.type === 'layoutOverrideCustom') this.props.layoutStore.overrideCustom(param.val);
    
  };

  render() {
    const ctx = this;
    console.log("RENDER HOME.JS");
    // console.log(this.props.layoutStore.visibleLayouts);
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 52, // Total Height
        n = 20,               // Number of rows
        m = 7,                // Margin
        h_ = (h-(n+1)*m)/n;   // Item height

    
    return (
      <div>
      <ContextMenuTrigger id="global_context" holdToDisplay={-1}>

      <div className={'Home cont'}>
        <ResponsiveReactGridLayout
          className={"layout"}
          layout={this.props.layoutStore.visibleLayouts}
          breakpoints={{lg: 1200, md: 996, sm: 768, xs: 360}}
          cols={{lg: 24, md: 20, sm: 12, xs: 8}}
          draggableCancel={'.draggableCancel'}
          margin={[m, m]}
          rowHeight={h_}
          onLayoutChange={this.handleChangeLayout.bind(this)}
        >
        {this.props.layoutStore.visibleLayouts.map(this.renderLayouts.bind(this))}
        </ResponsiveReactGridLayout> 
        </div>    
        </ContextMenuTrigger>
            
        <ContextMenu id="global_context" className={"draggableCancel"}>
        <MenuItem data={{value: 1}} onClick = {ctx.handleRightClick.bind(ctx,{type:'channelAdd', val:true})}>
          Add Channel
        </MenuItem>
        <MenuItem onClick={save} data={{ item: 'reset' }}>Save Scene</MenuItem>
        <MenuItem divider />
        <SubMenu title={'Modules'}>
        {_.map(ctx.props.layoutStore.allLayouts, function(layoutItem, key) {
          if(_.find(ctx.props.layoutStore.allLayouts, { 'i': layoutItem.i, 'isVisible': true }) )
            return <MenuItem key={key} onClick={ctx.handleRightClick.bind(ctx,{type:'modulesRemove', val:layoutItem.i})} data={{ item: layoutItem.i }}>{layoutItem.i}<span style={{float: 'right'}}>√</span></MenuItem>;
          else
            return <MenuItem key={key} onClick={ctx.handleRightClick.bind(ctx,{type:'modulesAdd', val:layoutItem.i})} data={{ item: layoutItem.i }}>{layoutItem.i}</MenuItem>;
        })}
        </SubMenu>
        <SubMenu title={'Layouts'}>
        <MenuItem onClick={ctx.handleRightClick.bind(ctx,{type:'layoutSave'})} data={{ item: 'reset' }}>Save Layout</MenuItem>
        <MenuItem onClick={ctx.handleRightClick.bind(ctx,{type:'layoutReset'})} data={{ item: 'reset' }}>Reset Layout<span style={{float: 'right'}}>⇧ + R</span></MenuItem>
        <MenuItem onClick={ctx.handleRightClick.bind(ctx,{type:'matrixFull'})} data={{ item: 'reset' }}>Max. Grid<span style={{float: 'right'}}>⇧ + F</span></MenuItem>
        <MenuItem divider />
        <MenuItem disabled> alt-click to remove </MenuItem>
        {_.map({a:1, b:2, c:3, d:4}, function(i, key) {
          if(ctx.props.layoutStore.customs !== undefined && ctx.props.layoutStore.layouts !== undefined) {
            if(ctx.props.layoutStore.customs[["c_"+i]] !== undefined)
              return <MenuItem key={key} onClick={ctx.handleRightClick.bind(ctx,{type:'layoutLoadCustom', val: 'c_'+i })} data={{ item: 'c_'+i }}>Cust. {i}<span style={{float: 'right'}}>⇧ + {i}</span></MenuItem>
            else
              return <MenuItem key={key} onClick={ctx.handleRightClick.bind(ctx,{type:'layoutSaveCustom', val: 'c_'+i })} data={{ item: 'c_'+i }}>click to save here</MenuItem>
          }
          else
            return <MenuItem key={key} onClick={ctx.handleRightClick.bind(ctx,{type:'layoutOverrideCustom', val: 'c_'+i })} data={{ item: 'c_'+i }}>click to save here</MenuItem>
        })}
        </SubMenu>
      </ContextMenu>     
      
      </div>
      
    );
  }
}