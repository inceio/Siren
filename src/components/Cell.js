import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

// import channelStore from '../stores/channelStore'

@inject('channelStore')
@observer
export default class Cell extends React.Component {
    
    render() {
        console.log('RENDER CELL');

        const item = this.props.item;
        const value = this.props.value;
        const index = this.props.index;

        var className = "GridItem";
        if(this.props.channelStore.isCellActive(item.name, index)){
          className += ' active';
        }
        className += (index % 2 === 0) ? ' even' : ' odd'; 
        if(this.props.channelStore.isCellSelected(item.name, index)) {
          className += ' selected';
        }

        return (<div>
            <textarea ref={(input) => { this.nameInput = input; }}
                className={className +" draggableCancel"} type="text"
                value={value}
                onChange={() => 
                    (this.props.channelStore.updateCell(item.name, index, this.nameInput.value))}
                placeholder={index % 2 === 1 ? _.toString(index+1) : ''}
                onClick={() => 
                    this.nameInput.focus()}/>
            </div>);
    }
}
