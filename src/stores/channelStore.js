import { observable, action, computed} from 'mobx';
import _ from 'lodash';

import pulseStore from './pulseStore';  
import sceneStore from './sceneStore';  
import patternStore from './patternStore';  
import historyStore from './historyStore';  
import globalStore from './globalStore';

import request from '../utils/request'

class ChannelStore 
{
    @observable channels = [{
        scene: 'default',
        name: 'd1',
        type: 'Tidal',
        steps: 8,
        cells: _.fill(Array(8), ''),
        transition: '',
        rate: 8,
        gate: false,
        solo: false,
        mute: false,
        // TODO: Fix LOOP
        loop: true, executed: false,
        selected: false,
        time: 0,
        cid: 0
    }];
    @observable soloEnabled = false;
    
    @action updateChannel(index, type, value){
        let activeChannels = this.getActiveChannels;
        switch (type) {
            case 's':
            if(activeChannels[index]!== undefined) activeChannels[index].solo = value;
                break;
            case 'm':
            if(activeChannels[index]!== undefined) activeChannels[index].mute = value;
                break;
            case 'r':
            if(activeChannels[index]!== undefined) activeChannels[index].gate = value;
                break;
            default:
                break;
        }
    }
    
    @action clearChannel(name) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            ch.cells = _.fill(Array(ch.steps), '');
        }
    }

    @action resetTime(name) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            ch.time = 0;
        }
    }

    // Update the timer values based on the pulse 
    @action updateAll() {
        _.forEach(_.filter(this.channels, ['scene', sceneStore.active_scene]), (channel, i) => {
            if (channel.gate && pulseStore.pulse.phase % channel.rate === 0) {
                channel.time += 1;
                let current_step = channel.time % channel.steps;
                if(channel.cells[current_step] !== undefined && channel.cells[current_step] !== ''){
                    if((!this.soloEnabled || (this.soloEnabled && channel.solo)) && !channel.mute)
                        this.sendPattern(channel, channel.cells[current_step]);
                }
            }
        });
    }
    sendPattern(channel, step){
        request.post('http://localhost:3001/patternstream', {  'step': step, 
                                                                'patterns': patternStore.patterns,
                                                                'channel': channel,
                                                                'global_mod': globalStore.global_mod })
        .then((response) => {
            console.log(" ## Pattern response: ", response.data.pattern);
            console.log(" ## CID response: ", response.data.cid);
            if (response){
                historyStore.updateHistory(response.data.pattern, response.data.cid, response.data.timestamp);
            }
            
            
        }).catch(function (error) {
            console.error(" ## Pattern errors: ", error);
        });
    }

    @computed get getActiveChannels() {
        return this.channels.filter(c => c.scene === sceneStore.active_scene);
    }

    @action overwriteCell(scene_channel_index, cell_index, value) {
        let activeChannels = this.getActiveChannels;
        if(scene_channel_index < activeChannels.length && 
           cell_index < activeChannels[scene_channel_index].steps) {
            console.log("CHANNEL", scene_channel_index, cell_index, value);
            
            activeChannels[scene_channel_index].cells[cell_index] = value;
        }
    }

    // LOAD AND DUPLICATE
    @action loadChannels(new_channels) {
        this.channels = new_channels;
    }
    @action duplicateChannels(old_scene, new_scene) {
        _.forEach(_.filter(this.channels, ['scene', old_scene]), element => {
            let new_item = _.cloneDeep(element);
                new_item.scene = new_scene
            this.channels.push(new_item);
        });
    }
    
    // EDIT HEADERFIELDS
    @action changeChannelRate(name, rate) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            ch.rate = _.toInteger(rate);
        }
    }
    @action toggleGate(name) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            ch.gate = !ch.gate;
        }
    }
    @action changeChannelName(name, new_name) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        let ch_new = _.find(this.channels, { 'name': new_name, 'scene': sceneStore.active_scene });
        if(ch !== undefined && ch_new === undefined) {
            ch.name = new_name;
        }
    }
    @action changeChannelType(name, new_type) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            ch.type = new_type;
        }
    }
    @action changeChannelTransition(name, transition) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            ch.transition = transition;
        }
    }


    getChannelType = (name) => {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            return ch.type;
        }
    }

    // ADD DELETE
    @action addChannel(name, type, steps, transition) {
        if(_.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene }) === undefined) {
            this.channels.push({
                scene: sceneStore.active_scene,
                name: name,
                type: type,
                steps: steps, rate: 8, time: 0,
                transition: transition,
                cells: _.fill(Array(_.toInteger(steps)), ''),
                gate: false,
                solo: false, mute: false, 
                loop: true, executed: false,
                selected: false,
                cid: this.channels.length
            });
        }
        else {
            alert(name + ' already exists.');
        }
    }
    
    @action deleteChannel(name) {
        this.channels = _.reject(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
    }

    // TOGGLE
    @action toggleMute(name) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            ch.mute = !ch.mute;
        }
    }
    @action toggleSolo(name) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            ch.solo = !ch.solo;
            if(ch.solo) {
                this.soloEnabled = true;
                _.forEach(this.getActiveChannels, (other) => {
                    if(other.name !== ch.name) other.solo = false;
                });
            }
            else    this.soloEnabled = false;
        }
    }
    @action toggleLoop(name) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            ch.loop = !ch.loop;
        }
    }

    // Step Modifiers
    @action addStep(name) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            const temp = ch.time % ch.steps;
            ch.steps += 1;
            ch.time = temp;
            ch.cells.push('');
        }
    }

    @action removeStep(name) {
        let ch = _.find(this.channels, { 'name': name, 'scene': sceneStore.active_scene });
        if(ch !== undefined) {
            const temp = ch.time % ch.steps;
            ch.steps -= 1;
            ch.cells.pop();
            ch.time = temp;
        }
    }
}

export default new ChannelStore();
