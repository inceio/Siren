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
        this.load();
    }

    // getters
    @computed get getGlobals(){
        return this.global_mod;   
    }
    @computed get getChannels(){
        return this.global_channels;   
    }
    @computed get getTransform(){
        return this.global_transformer;   
    }
    @computed get getModifier(){
        return this.global_modifier;   
    }
    @computed get getParam(){
        return this.global_param;   
    }

    // setters
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

    // @action loadGlobals(index){
    //     this.active_index = index;
    //     this.global_channels = this.global_mod[index].channels;
    //     this.global_transformer = this.global_mod[index].transformer;
    //     this.global_modifier = this.global_mod[index].modifier;
    //     this.global_param = this.global_mod[index].param;
    // }
    @action updateGlobals(globalObj, index){
        if(globalObj !== undefined) {
            this.active_index = index;
            this.global_channels = globalObj.channels;
            this.global_transformer = globalObj.transformer;
            this.global_modifier = globalObj.modifier;
            this.global_param = globalObj.param;
        }
    }

    isActive(globalindex){
        return this.active_index === globalindex;
    }

    @action saveGlobals(){
        let gobj = {channels: this.global_channels,
                    transformer: this.global_transformer,
                    modifier: this.global_modifier,
                    param: this.global_param,
                    };
        this.global_mod.push(gobj);
        this.active_index = this.global_mod.length - 1;
        this.save();
    }

    @action updatePatterns() {

        const ctx = this;
        let histpat = [];
        let channels = this.global_channels;
        let transformer = this.global_transformer;
        let modifier = this.global_modifier;
        let gbchan = channels.split(" ");

        let activePatternsLen =  historyStore.latestPatterns.length - 1 ;
        let activePatterns =  historyStore.latestPatterns;
        
        console.log("GLOBAL UPDATE PATTERNS:", channels, transformer, modifier,activePatterns,activePatternsLen);
        if (gbchan !== undefined && gbchan.length > 0 && activePatterns !== undefined && activePatternsLen > 0){
            if (gbchan === undefined ||gbchan[0] === undefined || gbchan[0] === ' ' || gbchan[0] ==='0' ){
                console.log("Global All channels");
                for (let i = 0; i < activePatternsLen; i++) {
                    let curPat = _.last(activePatterns[i]);
                    if(curPat !== undefined && curPat.pattern !== ''){
                        let patternbody = curPat.pattern.substring(_.indexOf(curPat.pattern, "$")+1);
                        let patname = curPat.pattern.substring(0,_.indexOf(curPat.pattern, "$")+1 );
                        let pattern = patname + transformer + patternbody + modifier;
                        console.log(pattern);
                        ctx.submitGHC(pattern);
                    }
                }
            }
            else {
                for(let j = 0; j < gbchan.length; j++){
                    if(activePatterns[j] !== undefined){
                        console.log("Global individual channel");
                        if(activePatterns[j][0] !== undefined){
                            let curPat = _.last(activePatterns[j]);
                            if(curPat !== undefined && curPat.pattern !== ''){
                                let patternbody = curPat.pattern.substring(_.indexOf(curPat.pattern, "$")+1);
                                let patname = curPat.pattern.substring(0,_.indexOf(curPat.pattern, "$")+1 );
                                let pattern = patname + transformer + patternbody + modifier;
                                console.log(pattern);
                                ctx.submitGHC(pattern);
                            }
                        }
                    }       
                }
            }
        }
        if(this.global_param!== undefined) ctx.submitGHC(this.global_param);
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
                if ( response.data.globals !== undefined) {
                    this.global_mod = response.data.globals;
                    console.log(" ## Globals loaded: ", this.globals);
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