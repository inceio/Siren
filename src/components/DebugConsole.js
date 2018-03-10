import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

@inject ('debugStore')
@observer
export default class DebugConsole extends React.Component {
    render() {
        const ctx = this;
        let message = ctx.props.debugStore.debugLogMessage;
        console.log(message);
        if(_.isObject(message)) {
          message = JSON.stringify(message);
        }
        else {
          message = _.toString(message);
        }
        return (<div>
          {message
          }
        </div>)
      }
    
}
