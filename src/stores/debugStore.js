import { observable, action, computed } from 'mobx';
import io from 'socket.io-client';
import _ from 'lodash';

class DebugStore 
{
    sc_log = io('http://localhost:4002/');    

    @observable msg = '';
    
    constructor() {
        const ctx = this;
        this.sc_log.on('connect', (reason) => {
            
        });
        this.sc_log.on('disconnect', action((reason) => {
            
        }));
        this.sc_log.on("/scdebuglog", action((data) => {
            console.log(data.msg);
            this.updateLog(data.msg);
        }))
    }
@action updateLog(msg){
    var console_len = 20;
    this.msg = _.concat(this.msg,msg);
    if(this.msg.length > console_len){
        this.msg = _.drop(this.msg, console_len);
    }
    //this.msg = msg;
}
@computed get debugLogMessage(){
    return this.msg;
}
    
}
export default new DebugStore();
