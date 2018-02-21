import React from 'react';
import { inject, observer } from 'mobx-react';
// CSS Imports
import '../styles/_comp.css';
import '../styles/Layout.css';
import '../styles/App.css';
import '../styles/Home.css';

@inject('globalStore')
@observer
export default class Globals extends React.Component {
    
render() {
  console.log("RENDER GLOBALS.JS");
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
  return (<div className={'Globals PanelAdjuster draggableCancel'}>
      <p> Sequencer: ⌥ + Enter, ⇧ + Enter</p>
      <div className={'GlobalParamsInputs'}>
        <div className={'GlobalSequencer'}>
          <MaskedInput mask={maskedInputDurations}
            className={"Input draggableCancel"}
            key={'globalsq'}
            onKeyUp={globalStore.handleGlobalSequence}
            onChange={globalStore.handleGlobalsqDuration}
            value={globalsq}
            placeholder={"Sequencer ( "+maskedInputDurations+")"}/>
        </div>
      </div>
     </div>
    )
  }
}      

// <p>Execute: ⌃ + Enter</p>
//       <div className={"GlobalParamsInputsII"}>
//         <div className={"GlobalParamsInputs"}>
//           <div>
//             <MaskedInput mask={maskedInputPatterns}
//               className={"Input draggableCancel"}
//               key={'globalchannel'}
//               onKeyUp={ctx.handleUpdatePatterns.bind(ctx)}
//               onChange={ctx.handleGlobalChannels.bind(ctx)}
//               value={globalChannels}
//               placeholder={"Channels ( "+maskedInputPatterns+")"}/>
//             <input className={"Input draggableCancel"} key={'globaltransform'} onKeyUp={ctx.handleUpdatePatterns.bind(ctx)} onChange={ctx.handleGlobalTransformations.bind(ctx)} value={globalTransformations} placeholder={"Transformation"}/>
//             <input className={"Input draggableCancel"} key={'globalcommand'} onKeyUp={ctx.handleUpdatePatterns.bind(ctx)} onChange={ctx.handleGlobalCommands.bind(ctx)} value={globalCommands} placeholder={"Commands"} />
//           </div>
//           <button className={"Button draggableCancel"} onClick={ctx.record.bind(ctx)}>Rec</button>
//         </div>
//       </div>
//       <p>{"(Select) click,  (save) ⇧ + click, (delete) ⌥ + click"}</p>
//       <div className={'StoredGlobalParams'}>
//         {_.map(storedGlobals, (c, i) => {
//           return <button key={i} id={i} className={"Button " + pressed[i] + " draggableCancel"} onClick={ctx.clicked.bind(ctx)}>{i}</button>
//         })}
//       </div>
//     </div>
//   </div>);
// }