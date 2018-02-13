import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { save, timer } from '../keyFunctions'

@inject('cellStore')
@observer
export default class Cell extends React.Component {
    
    handleKeys = (event, channel_index, cell_index) => {
        if(event.ctrlKey && event.keyCode === 13) {
            event.preventDefault();
            timer();
        }
        else if(event.keyCode === 13) {
            if(!this.props.cellStore.isSelected) {
                this.props.cellStore.updateSelectState(true);
                this.props.cellStore.selectCell(channel_index, cell_index);
                this.nameInput.readOnly = true;
            }
            else {
                this.props.cellStore.updateSelectState(false);
                document.getElementById('cell'+this.props.cellStore.current_cell[0]+
                                                this.props.cellStore.current_cell[1]).focus();
                this.props.cellStore.selectCell(channel_index, cell_index);
                this.nameInput.readOnly = false;
            }
            event.preventDefault();
        }
        // copy cells
        else if(event.key === 'c' && event.shiftKey) {
            if(this.props.cellStore.isSelected){
                event.preventDefault();
                this.props.cellStore.copyCells();
            } 
        }
        // paste cells
        else if(event.key === 'v' && event.shiftKey) {
            if(this.props.cellStore.isSelected) {
                event.preventDefault();
                this.props.cellStore.pasteCells();
            }
        }
        // shift + left-up-right-down
        else if(event.keyCode === 37 && event.shiftKey) {
            this.props.cellStore.selectCellOnDirection('left');
            if(this.props.cellStore.isSelected) event.preventDefault();
        }
        else if(event.keyCode === 38 && event.shiftKey){
            this.props.cellStore.selectCellOnDirection('up');
            if(this.props.cellStore.isSelected) event.preventDefault();
        }
        else if(event.keyCode === 39 && event.shiftKey){
            this.props.cellStore.selectCellOnDirection('right');
            if(this.props.cellStore.isSelected) event.preventDefault();
        }
        else if(event.keyCode === 40 && event.shiftKey){
            this.props.cellStore.selectCellOnDirection('down');
            if(this.props.cellStore.isSelected) event.preventDefault();   
        }
        // left-up-right-down
        else if(event.keyCode === 37) {
            this.props.cellStore.navigateCell('left');
            if(this.props.cellStore.isSelected) event.preventDefault();
        }
        else if(event.keyCode === 38){
            this.props.cellStore.navigateCell('up');
            if(this.props.cellStore.isSelected) event.preventDefault();
        }
        else if(event.keyCode === 39){
            this.props.cellStore.navigateCell('right');
            if(this.props.cellStore.isSelected) event.preventDefault();
        }
        else if(event.keyCode === 40){
            this.props.cellStore.navigateCell('down');   
            if(this.props.cellStore.isSelected) event.preventDefault();
        }
        // global save
        else if(event.key === 's' && event.ctrlKey) {
            save();
            event.preventDefault();
        }
    }

    render() {
        console.log('RENDER CELL');

        const item = this.props.item;
        const value = this.props.value;
        const cell_index = this.props.index;
        const channel_index = this.props.channel_index;

        var className = "GridItem";
        if(this.props.cellStore.isCellActive(item.name, cell_index)){
            className += ' active';
        }
        className += (cell_index % 2 === 0) ? ' even' : ' odd'; 
        if(this.props.cellStore.isCellSelected(channel_index, cell_index)) {
            className += ' selected';
        }
        if(this.props.cellStore.isCellHighlighted(channel_index, cell_index)) {
            className += ' highlighted';
        }
        return (<div>
            <textarea id={'cell'+channel_index+cell_index}
                ref={(input) => { this.nameInput = input; }}
                className={className +" draggableCancel"} type="text"
                placeholder={cell_index % 2 === 1 ? _.toString(cell_index+1) : ''}
                value={value}
                onChange={() => 
                    (this.props.cellStore.updateCell(item.name, cell_index, this.nameInput.value))}
                onKeyDown={(event) => (this.handleKeys(event, channel_index, cell_index))}
                onClick={() => {
                    this.props.cellStore.updateSelectState(false);
                    this.nameInput.focus();
                }}/>
            </div>);
    }
}