import { observable, action, computed } from 'mobx';
// import _ from 'lodash';
import io from 'socket.io-client';

import channelStore from './channelStore'
import menubarStore from './menubarStore'

// nodejs connections
import request from '../utils/request'

class PulseStore 
{
    @observable pulse_info = false;
    @observable pulse ={ bpm: 120,
                        beat: '',
                        phase: ''}

    link_pulse = io('http://localhost:4001/');

    constructor() {
        const ctx = this;
        this.link_pulse.on('connect', (reason) => {
            console.log("Port 4001 Connected: ", reason);
        });
        this.link_pulse.on('disconnect', action((reason) => {
            console.log("Port 4001 Disconnected: ", reason);
            
            ctx.setActive(false);
            menubarStore.server_info = 0;
        }));
        this.link_pulse.on("pulse", data => {

            //console.log(data.bpm, data.beat, data.phase);
            
            ctx.pulse.bpm = data.bpm;
            ctx.pulse.beat = data.beat;
            ctx.pulse.phase = data.phase;

            channelStore.updateAll();

            ctx.setActive(true);
        })
    }
 
    @action setActive(value) {
        this.pulse_info = value;
    }

    @computed get isActive() {
        return this.pulse_info;  
    }

    @action startPulse() {
        const ctx = this;
        console.log("Start Pulse");
        request.post('http://localhost:3001/pulse')
            .then((response) => {
            if (response.status === 200) {
                console.log(" ## Pulse started.");
                ctx.setActive(true);
            }
            else{ 
                console.log(" ## Pulse failed.");
                ctx.setActive(false);
            }
            }).catch(function (error) {
                console.error(" ## Server errors: ", error);
            });
    }

    @action stopPulse() {
        const ctx = this;
        request.post('http://localhost:3001/pulseStop')
        .then((response) => {
            if (response.status === 200) {
                console.log(" ## Pulse stopped.");
                ctx.setActive(false);
            }
            else{ 
                console.log(" ## Pulse can't be stopped.");
            }
            }).catch(function (error) {
                console.error(" ## Server errors: ", error);
            });
    }



    
}

export default new PulseStore();
