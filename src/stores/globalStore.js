import { observable, action, computed} from 'mobx';
import _ from 'lodash';
// nodejs connections
import request from '../utils/request'
import historyStore from './historyStore';  

class GlobalStore 
{
    @observable global_mod = {channels : '',
                              transformer : '',
                               modifier : ''
                             }

    @observable global_array = [{}]



    @action updateGlobals(channels,transformer , modifier){
        this.global_mod.channels = channels;
        this.global_mod.transformer = transformer;
        this.global_mod.modifier = modifier;
    }

    @action saveGlobals(){
        this.global_array.push(this.global_mod);
    }

    @action editGlobals(){
        //global_array.push(global_mod);
    }

    @action updatePatterns(channels, transformer,modifier) {

        console.log("UPDATE PATTERNS:", channels, transformer, modifier);
        const ctx = this;
        let histpat = [];
        let gbchan = channels.split(" ");
        if (gbchan === undefined ||gbchan[0] === undefined || gbchan[0] === ' ' || gbchan[0] ==='0' ){
            console.log("Global All channels");
            for (let i = 0; i < historyStore.channels.length; i++) {
                if(historyStore.channels[i] !== undefined && historyStore.channels[i] !== ''){
                    let patternbody = historyStore.channels[i].substring(_.indexOf(historyStore.channels[i], "$")+1);
                    let patname = historyStore.channels[i].substring(0,_.indexOf(historyStore.channels[i], "$")+1 );
                    let pattern = patname + transformer + patternbody + modifier;
                    console.log(pattern);
                    ctx.submitGHC(pattern);
                }
            }
        }
        else {
            _.forEach( gbchan, function(chan, j){
                let i = parseInt(chan, 10) - 1;
                console.log("Global individual channel");
                if(historyStore.channels[i] !== undefined && historyStore.channels[i] !== ''){
                    let patternbody = historyStore.channels[i].substring(_.indexOf(historyStore.channels[i], "$")+1);
                    let patname = historyStore.channels[i].substring(0,_.indexOf(historyStore.channels[i], "$")+1 );
                    let pattern = patname + transformer + patternbody + modifier;
                    console.log(pattern);
                    ctx.submitGHC(pattern);
                }
            });
        }
    }

    submitGHC(expression) {
    request.post('http://localhost:3001/global_ghc', { 'pattern': expression })
      .then((response) => { 
        console.log("RESPONSE GHC");
      }).catch(function (error) {
        console.error("ERROR", error);
      });
    }
}

export default new GlobalStore();