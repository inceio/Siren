import { observable, action, computed} from 'mobx';
import _ from 'lodash';
// nodejs connections
import request from '../utils/request'

class HistoryStore 
{
    @observable channels = []


    @action updateHistory(pattern,cid){
        console.log("HISTORY UPDATE");

        if(this.channels[cid] === undefined)
            this.channels.push(pattern);
        else
            this.channels[cid] = pattern;
        
    }
    
}
export default new HistoryStore();
