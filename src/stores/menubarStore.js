import { observable, action, computed } from 'mobx';
// import _ from 'lodash';

// nodejs connections
import request from '../utils/request'

class MenubarStore 
{
    // 0 = inactive
    // 1 = ready
    // 2 = running
    @observable server_info = 0;

    @computed get getActive() {
        return this.server_info;  
    }

    @action stopServer() {
        this.server_info = 1;
        request.get('http://localhost:3001/quit')
            .then(action((response) => {
                if (response.status === 200) 
                {
                    this.server_info = 0;
                    console.log(" ## Server stopped.");
                }
                else {
                    this.server_info = 0;
                    console.log(" ## Server quit failed.");
                }                        
            })).catch(action((error) => {
                this.server_info = 0;                
                console.error(" ## Server errors: ", error);
            }));
    }

    @action bootServer(config) {
        this.server_info = 1;
        request.post('http://localhost:3001/init', { 'b_config': config })
            .then(action((response) => {
                if (response.status === 200) 
                {
                    this.server_info = 2;
                    console.log(" ## Server booted.");
                }
                else {
                    this.server_info = 0;
                    console.log(" ## Server boot failed.");
                }                        
            })).catch(action((error) => {
                this.server_info = 0;                
                console.error(" ## Server errors: ", error);
            }));
    }


    
}

export default new MenubarStore();
