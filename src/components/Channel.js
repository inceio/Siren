import React from 'react';
import { inject, observer } from 'mobx-react';
import Draggable from 'react-draggable';
import Cell from './Cell'
import _ from 'lodash';
@inject('channelStore')
@observer
class ChannelHeader extends React.Component {
  
  render() {
    console.log('RENDER CHANNEL HEADER');
    const item = this.props.value;

    return (
        <div className={"ChannelItemHeader " + item.type }>
            <div className={"ChannelItemHeader-middle"}>
                <div className={"ChannelItemHeader-titleDiv"}>
                    <input ref={(input_name) => { this.nameInputName = input_name; }}
                        title={"Channel Name ("+item.name+")"}
                        className={"ChannelItemHeader-title ChannelItemHeader-text draggableCancel"}
                        placeholder={" name "}  
                        value={item.name}
                        onChange={() => 
                            (this.props.channelStore.changeChannelName(item.name, this.nameInputName.value))}
                        onClick={() => 
                            this.nameInputName.focus()}/>
                    <div className={"ChannelItemHeader-middle"}>
                        <input ref={(input_type) => { this.nameInputType = input_type; }}
                            title={"Type ("+item.type+")"}
                            className={"ChannelItemHeader-text draggableCancel"}
                            placeholder={" type "}  
                            value={item.type}
                            onChange={() => 
                                (this.props.channelStore.changeChannelType(item.name, this.nameInputType.value))}
                            onClick={() => 
                                this.nameInputType.focus()}/>
                        {this.props.channelStore.getChannelType(item.name) === "Tidal" && 
                        <input ref={(input_transition) => { this.nameInputTrans = input_transition; }}
                            title={"Tidal Transition " + (item.transition === '' ? "NONE": "("+item.transition+")")}
                            className={"ChannelItemHeader-text draggableCancel"}
                            placeholder={" transition "}  
                            value={item.transition}
                            onChange={() => 
                                (this.props.channelStore.changeChannelTransition(item.name, this.nameInputTrans.value))}
                            onClick={() => 
                                this.nameInputTrans.focus()}/>}
                    </div>
                </div>
                <div className={"ChannelItemHeader-time"}>
                    <input ref={(input_rate) => { this.nameInputRate = input_rate; }}
                        title={"Rate"}
                        className={"ChannelItemHeader-text draggableCancel"}
                        style={{width: '20%'}}
                        placeholder={" rate "}  
                        value={item.rate}
                        onChange={() => 
                            (this.props.channelStore.changeChannelRate(item.name, this.nameInputRate.value))}
                        onClick={() => 
                            this.nameInputRate.focus()}/>
                    <button className={"Button "+ item.gate} title={item.gate ? 'Pause': 'Play'}
                        onClick={() => (this.props.channelStore.toggleGate(item.name))}>{item.gate ? '●': '○'}</button>
                    <button className={"Button"} title={'Reset'}
                        onClick={() => (this.props.channelStore.resetTime(item.name))}>🡅</button>
                </div>
            </div>
            <div className={"ChannelItemHeaderButtons"}>
                <button className={"Button"} title={'Delete'} onClick={() => 
                    this.props.channelStore.deleteChannel(item.name)}>X</button>
                <button className={"Button "+ item.solo} title={'Solo'} onClick={() => 
                    this.props.channelStore.toggleSolo(item.name)}>S</button>
                <button className={"Button "+ item.mute} title={'Mute'}
                    onClick={() => 
                    this.props.channelStore.toggleMute(item.name)}>M</button>
                <button className={"Button "+ item.loop} title={'Loop'} onClick={() => 
                    this.props.channelStore.toggleLoop(item.name)}>⭯</button>
            </div>
        </div>
    );
  }
}

@inject('channelStore')
@observer
class Channel extends React.Component {
  
  render() {
    console.log('RENDER CHANNEL');
    const { item, index } = this.props;

    let channelClass = "ChannelItem";
    if ((!item.loop) || ( item.mute) || (this.props.channelStore.soloEnabled && !item.solo)) {
      channelClass += " disabled";
    }
    return (<div className={channelClass}>
        <ChannelHeader key={item.scene+"_"+item.name} value={item}/>
        {item.cells.map((c, i) => {
           return <Cell key={i} item={item} channel_index={index} index={i} value={c}/>
        })}
        <div className={'ChannelItemSteps'}>
            <button className={"Button"}
                    title={"Add Step"}
                    onClick={() => (this.props.channelStore.addStep(item.name))}> + </button>
            <button className={"Button"}
                    title={"Remove Step"}
                    onClick={() => (this.props.channelStore.removeStep(item.name))}> - </button>
        </div>
    </div>);
  }
}

@inject('channelStore')
@observer
export default class Grid extends React.Component {
    onDragStop = (event, position) => {
        const ctx = this;
        console.log(position);
        let y =  _.toInteger(position.layerY/40)*40;
        this.props.channelStore.seekTimer(y);
        
    }
    
  render() {
    console.log('RENDER GRID');
    let pos;
    const ctx = this;
    return (
      <div className={'AllChannels draggableCancel PanelAdjuster'}>
            
      <Draggable position={pos} axis="y" bounds="parent" grid={[40, 40]} onStop={this.onDragStop.bind(this,pos)}>
        <div className="Timeline">
        </div>
      </Draggable>
        {this.props.channelStore.getActiveChannels
            .map((t, i) => {
                return <Channel key={t.scene+"_"+t.name} item={t} index={i}/>;
            })}
      </div>
    );
  }
}