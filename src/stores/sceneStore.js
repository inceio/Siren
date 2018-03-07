import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import patternStore from './patternStore';
import channelStore from './channelStore';
import cellStore from './cellStore';

// nodejs connections
import request from '../utils/request'

class SceneStore 
{
    @observable active_scene = 'default';
    @observable scene_list = ['default'];

    constructor() {
        this.load();
    }

    isActive(name) {
        return this.active_scene === name;  
    }

    @computed get activeScene() {
        return this.active_scene;
    }
    @action changeActiveScene(name) {
        this.active_scene = name;
        cellStore.updateSelectState(false);
    }

    @action clearActiveGrid() {
        _.forEach(channelStore.getActiveChannels, (c) => {channelStore.clearChannel(c.name);});
    }

    @action addScene(name) {
        if(name !== '') {
            if(_.indexOf(this.scene_list, name) < 0) {
                this.scene_list.push(name);
                console.log(" ## \""+name+"\" added.");
            }
            else {
                alert(name+ " already exists.");
            }
        }
        else {
            alert("Please enter a scene name.");
        }
    }

    @action deleteScene(name) {
        if(name !== '' && name !== 'default') {
            // Delete from patterns list
            patternStore.deleteAllPatternsInScene(name);

            // Delete from channels list
            channelStore.deleteAllChannelsInScene(name);

            // Delete from scenelist
            this.scene_list =  _.remove(this.scene_list,  (n) => {
                return n !== name;
            });
        }
    }

    @action duplicateScene(name) {
        if(name !== '') {
            if(_.find(this.scene_list, name) === undefined) {
                this.scene_list.push(name);
                patternStore.duplicatePatterns(this.active_scene, name);
                channelStore.duplicateChannels(this.active_scene, name);
                console.log(" ## \""+this.active_scene+"\" duplicated in \""+name+"\".");
            }
            else {
                alert(name+ " already exists.");
            }
        }
        else {
            alert("Please enter a scene name.");
        }
    }

    load() {
        console.log(" ## LOADING SCENES...");
        request.get('http://localhost:3001/scenes')
              .then(action((response) => { 
                if ( response.data.scenes && response.data.patterns && 
                     response.data.channels && response.data.active_s) {
                    this.scene_list = response.data.scenes;
                    this.active_scene = response.data.active_s;
                    patternStore.loadPatterns(response.data.patterns);
                    channelStore.loadChannels(response.data.channels);
                    console.log(" ## Scenes loaded: ", this.scene_list);
                }
              })).catch(function (error) {
                    console.error(" ## SceneStore errors: ", error);
              });
    };
    
    save() {
        request.post('http://localhost:3001/scenes', { 'scenes': this.scene_list, 
                                                       'active_s': this.active_scene, 
                                                       'patterns': patternStore.patterns,
                                                       'channels': channelStore.channels })
                .then((response) => {
                    console.log(" ## Scene save response: ", response);
                }).catch(function (error) {
                    console.error(" ## SceneStore errors: ", error);
                });
    };

    
}

export default new SceneStore();
