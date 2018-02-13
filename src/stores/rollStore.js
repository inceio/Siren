import { observable, action, computed } from 'mobx';
import io from 'socket.io-client';

class RollStore 
{
    sc_log = io('http://localhost:4002/');    

    @observable value = [];

    constructor() {
        const ctx = this;
        this.sc_log.on('connect', (reason) => {
            console.log("Port 4002 Connected: ", reason);
        });
        this.sc_log.on('disconnect', action((reason) => {
            console.log("Port 4002 Disconnected: ", reason);
        }));
        this.sc_log.on("/sclog", action((data) => {
            // console.log(data.trigger);
            ctx.value = data.trigger;

            // PROCESS AND STORE DATA HERE
        }))
    }

}

export default new RollStore();
