import React from 'react';
import { inject, observer } from 'mobx-react';
// import _ from 'lodash';

// import channelStore from '../stores/channelStore'

@inject('rollStore')
@observer
export default class Canvas extends React.Component {
    
    render() {
        console.log('RENDER CANVAS');

        return (<div>{this.props.rollStore.value}</div>);
    }
}
