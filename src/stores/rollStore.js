import { observable, action, computed } from 'mobx';
import io from 'socket.io-client';

import menubarStore from './menubarStore'

class RollStore 
{
    sc_log = io('http://localhost:4002/');    

    @observable value;
    @observable resolution = 12;
    @observable cycles = 8;
    @observable play = false;
    @observable reload = false;
    @observable isEditor = false;
    
    constructor() {
        const ctx = this;
        this.sc_log.on('connect', (reason) => {
            console.log("Port 4002 Connected: ", reason);
            menubarStore.server_info = 2;
        });
        this.sc_log.on('disconnect', action((reason) => {
            console.log("Port 4002 Disconnected: ", reason);
            menubarStore.server_info = 0;
        }));
        this.sc_log.on("/sclog", action((data) => {
            // console.log(data.trigger);
            ctx.value = data.trigger;

            // PROCESS AND STORE DATA HERE
        }))
    }

    
    @action updateCycles(c){
        this.cycles = c;
    }
    @action updateResolution(r){
        this.resolution = r;
    }
    @action updateEditor(e){
        this.isEditor = e;
    }
    @action rollStart(r){
        this.play = r;
    }
    @action reloadRoll(r){
        this.reload = r;
    }
    
}

export default new RollStore();
