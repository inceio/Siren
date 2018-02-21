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

    @observable global_array = []



    @action updateGlobals(channels,transformer , modifier){
        this.global_mod.channels = channels;
        this.global_mod.transformer = transformer;
        this.global_mod.modifier = modifier;
    }

    @action saveGlobals(){
        this.global_array.push(this.global_mod);
    }

    @action overwriteGlobals(index){
        this.global_array[index].channels = this.global_mod.channels;
        this.global_array[index].transformer = this.global_mod.transformer;
        this.global_array[index].modifier = this.global_mod.modifier;
    }

    @action loadGlobals(index){
        this.global_mod.channels = this.global_array[index].channels;
        this.global_mod.transformer = this.global_array[index].transformer;
        this.global_mod.modifier = this.global_array[index].modifier;
    }

    @action updatePatterns(channels, transformer,modifier) {

        console.log("UPDATE PATTERNS:", channels, transformer, modifier);
        const ctx = this;
        let histpat = [];
        let gbchan = channels.split(" ");
        
        let activePatternsLen =  historyStore.latestPatterns.length - 1 ;
        let activePatterns =  historyStore.latestPatterns;
        if (gbchan === undefined ||gbchan[0] === undefined || gbchan[0] === ' ' || gbchan[0] ==='0' ){
            console.log("Global All channels");
            for (let i = 0; i < activePatternsLen; i++) {
                if(activePatterns[i][activePatternsLen] !== undefined && activePatterns[i][activePatternsLen].pattern !== ''){
                    let patternbody = activePatterns[i][activePatternsLen].pattern.substring(_.indexOf(activePatterns[i][activePatternsLen].pattern, "$")+1);
                    let patname = activePatterns[i][activePatternsLen].pattern.substring(0,_.indexOf(activePatterns[i][activePatternsLen].pattern, "$")+1 );
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
                if(activePatterns[j][activePatternsLen] !== undefined && activePatterns[j][activePatternsLen].pattern !== ''){
                    let patternbody = activePatterns[j][activePatternsLen].pattern.substring(_.indexOf(activePatterns[j][activePatternsLen].pattern, "$")+1);
                    let patname = activePatterns[j][activePatternsLen].pattern.substring(0,_.indexOf(activePatterns[j][activePatternsLen].pattern, "$")+1 );
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