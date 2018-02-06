import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

@inject('sceneStore')
@observer
export default class Scene extends React.Component {
       renderScene(item, i) {
        
        const class_name = this.props.sceneStore.isActive(item) ? "SceneItem-active" : "SceneItem";
        return (
            <div key={"s_"+i} className={ class_name+ " draggableCancel"}>
                <div>    
                    {<button onClick={() => (this.props.sceneStore.deleteScene(item))}>{'X'}</button>}
                    {<button onClick={() => (this.props.sceneStore.changeActiveScene(item))}>{item}</button>}
                </div>
            </div>
        )
    }

    render() {
        console.log("RENDER SCENE.JS");
        
        return (<div>
            <input className={'Input draggableCancel'} id={"new_scene_input"}
                    placeholder={'New Scene Name'}/>
            <div style={{display: 'inline-flex', justifyContent: 'space-between'}}>
                {<button className={'Button draggableCancel'} 
                        onClick={() => (this.props.sceneStore.addScene(document.getElementById('new_scene_input').value))}>Add </button>}
                {<button className={'Button draggableCancel'} 
                        onClick={() => (this.props.sceneStore.duplicateScene(document.getElementById('new_scene_input').value))}>Dup.</button>}
                <button className={'Button draggableCancel'} 
                        onClick={() => (this.props.sceneStore.clearActiveGrid())}>Clear</button>
                <button className={'Button draggableCancel'} style={{ background: 'rgba(120, 120, 120, 0.4)', width: '100%'}}
                        onClick={() => (this.props.sceneStore.save())}>SAVE</button>
            </div>
            <div className={'AllScenes'}>
                <div>
                    {_.map(this.props.sceneStore.scene_list, this.renderScene.bind(this))}
                </div>
            </div>
        </div>
        );
  }
}
