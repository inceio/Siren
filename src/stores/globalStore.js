import { observable, action, computed} from 'mobx';
import _ from 'lodash';
// nodejs connections
import request from '../utils/request'
import historyStore from './historyStore';  

class GlobalStore 
{
    @observable global_mod = [{channels : '',
                              transformer : '',
                               modifier : '',
                               param:''
                             }]

    @observable global_channels = ''
    @observable global_transformer = ''
    @observable global_modifier = ''
    @observable global_param = ''
    @observable active_index = 0;

    
    constructor() {
       //this.load();
      }

    @action updateGlobals(index){
        this.global_channels = this.global_mod[index].channels;
        this.global_transformer = this.global_mod[index].transformer;
        this.global_modifier = this.global_mod[index].modifier;
        this.global_param = this.global_mod[index].param;
        console.log(index);
        console.log(this.global_mod[index].channels);
    }

    @action updateTransformer(transformer){
        this.global_transformer = transformer;
    }

    @action updateModifier(modifier){
        this.global_modifier = modifier;
    }
    @action updateParam(param){
        this.global_param = param;
    }
    @action updateChannels(channels){
        this.global_channels  = channels;
    }

    @action saveGlobals(){
        let gobj = {channels: this.global_channels,
                    transform: this.global_transform,
                    modifier:this.global_modifier,
                    param:this.global_param,
                    };
        this.global_mod.push(gobj);
        console.log("Saved Array", this.global_mod);
        this.save();
    }

    @action overwriteGlobals(index){
        this.global_mod[index].channels = this.global_mod.channels;
        this.global_mod[index].transformer = this.global_mod.transformer;
        this.global_mod[index].modifier = this.global_mod.modifier;
        this.global_mod[index].param = this.global_mod.param;
    }

    @action loadGlobals(index){
        this.active_index = index;
        this.global_channels = this.global_mod[index].channels;
        this.global_transformer = this.global_mod[index].transformer;
        this.global_modifier = this.global_mod[index].modifier;
        this.global_param = this.global_mod[index].param;
    }
    isActive(globalindex){
        return this.active_index === globalindex;
    }
    
    @computed get getGlobals(){
        return this.global_mod;   
    }
    @computed get getChannels(){
        return this.global_channels;   
    }
    @computed get getTransform(){
        return this.global_transform;   
    }
    @computed get getModifier(){
        return this.global_modifier;   
    }
    @computed get getParam(){
        return this.global_param;   
    }
    @action updatePatterns() {

        const ctx = this;
        let histpat = [];
        let channels = this.global_channels;
        let transformer = this.global_transformer;
        let modifier = this.global_modifier;
        let gbchan = channels.split(" ");

        console.log("UPDATE PATTERNS:", channels, transformer, modifier);

        if (gbchan !== undefined && gbchan.length > 0){
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
                    if(chan !== undefined){
                        let i = parseInt(chan, 10) - 1;
                        if(i!== undefined){
                            console.log("Global individual channel");
                            if(activePatterns[j][activePatternsLen] !== -1 && activePatterns[j][activePatternsLen].pattern !== ''){
                                let patternbody = activePatterns[j][activePatternsLen].pattern.substring(_.indexOf(activePatterns[j][activePatternsLen].pattern, "$")+1);
                                let patname = activePatterns[j][activePatternsLen].pattern.substring(0,_.indexOf(activePatterns[j][activePatternsLen].pattern, "$")+1 );
                                let pattern = patname + transformer + patternbody + modifier;
                                console.log(pattern);
                                ctx.submitGHC(pattern);
                            }
                        
                        }
                    }       
                });
            }
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


    load() {
        request.get('http://localhost:3001/globals_load')
              .then(action((response) => { 
                if ( response.data.global_mod !== undefined) {
                    this.global_mod    = response.data.global_mod;
                    console.log(" ## Globals loaded: ",this.global_mod);
                }
              })).catch(function (error) {
                    console.error(" ## GlobalStore errors: ", error);
              });
      };
      
      save() {
        request.post('http://localhost:3001/globals_save', { 'globals':    this.global_mod})
                .then((response) => {
                    console.log(" ## Globals Saved");
                }).catch(function (error) {
                    console.error(" ## GlobalStore errors: ", error);
                });
      };
}

export default new GlobalStore();