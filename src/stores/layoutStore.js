import { observable, action, computed} from 'mobx';
import _ from 'lodash';

// nodejs connections
import request from '../utils/request'

class LayoutStore 
{
  isLoading;
  @observable layouts;

  constructor() {
    this.layouts = [];
    this.isLoading = true;
    this.load();
  }

  @action showLayout(specifier) {
    this.layouts.forEach(l => {if(l.i === specifier) l.isVisible = true;});
  };
  @action hideLayout(specifier) {
    this.layouts.forEach(l => {if(l.i === specifier) l.isVisible = false;});
  };
  
  @computed get visibleLayouts() {
    return this.layouts.filter(l => l.isVisible === true);
  };

  @action gridParameters(specifier) {
    let item = this.layouts.filter(l => l.i === specifier)[0];
    return {x: item.x, y: item.y, h: item.h, w: item.w, minW: item.minW, isVisible: item.isVisible}
  };

  @action onLayoutChange(layout) {
    if (!this.isLoading) {
      let hidden_items = _.differenceBy(this.layouts, layout, 'i');
      
      // Invisible Layouts
      _.forEach(hidden_items, (i) => { i['isVisible'] = false; });

      // Visible Layouts
      _.forEach(layout,       (i) => { i['isVisible'] = true; });
      
      this.layouts = _.concat(layout, hidden_items);
      this.save();
    }
  };

  load() {
    const ctx = this;
    console.log(" ## LOADING LAYOUTS...");
    ctx.isLoading = true;
    request.get('http://localhost:3001/layouts')
          .then(action((response) => { 
            if ( response.data.layouts ) {
              ctx.layouts = response.data.layouts;
              console.log(" ## Layouts loaded: ", this.layouts);
            }
            ctx.isLoading = false;
          })).catch(function (error) {
            console.error(" ## LayoutStore errors: ", error);
            ctx.isLoading = false;
          });
  };

  save() {
    request.post('http://localhost:3001/layouts', { 'layouts': this.layouts })
          .then((response) => {
            if (response.status === 200) console.log(" ## Layout saved.");
            else                         console.log(" ## Layout save failed.");
          }).catch(function (error) {
            console.error(" ## LayoutStore errors: ", error);
          });
  };

  @action reset() {
    this.layouts = [{i: "scenes", x: 0, y: 0, w: 3, h: 20, minW: 3, isVisible: true},
                    {i: 'matrix', x: 3, y: 0, w: 13, h: 13, minW: 5, isVisible: true},
                    {i: 'patterns', x: 16, y: 0, w: 8, h: 20, minW: 3, isVisible: true},
                    {i: 'pattern_history', x: 3, y: 13, w: 13, h: 3, minW: 3, isVisible: true},
                    {i: 'channel_add', x: 3, y: 16, w: 3, h: 4, minW: 2, isVisible: true},
                    {i: 'globals', x: 6, y: 16, w: 5, h: 4, minW: 4, isVisible: false},
                    {i: 'console', x: 11, y: 16, w: 5, h: 4, minW: 2, isVisible: true},
                    {i: 'debugconsole', x: 8, y: 21, w: 7, h: 13, minW: 7, isVisible: true},
                    {i: 'paths', x: 0, y: 21, w: 7, h: 13, minW: 7, isVisible: true},
                    {i: 'canvas', x: 0, y: 21, w: 7, h: 13, minW: 7, isVisible: true}];
  };
}

export default new LayoutStore();
