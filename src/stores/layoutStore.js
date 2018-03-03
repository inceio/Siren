import { observable, action, computed} from 'mobx';
import _ from 'lodash';

// nodejs connections
import request from '../utils/request'

class LayoutStore 
{
  isLoading;
  @observable layouts;
  @observable customs;
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
  @action loadCustom(layouts) {
    
  };
  @action saveCustom(layouts) {
    
  };
  @action overrideCustom(layouts) {
    
  };
  
  @computed get visibleLayouts() {
    return this.layouts.filter(l => l.isVisible === true);
  };
  @computed get allLayouts() {
    return this.layouts;
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
      //this.save();
    }
  };

  @action matrixFullscreen() {
    
    if(this.layouts !== undefined) {
      let found = false;
      _.forEach(this.layouts, function(item, i) {
        if (item.i === 'matrix') {
          this.layouts[i].y = 0;
          this.layouts[i].x = 0;
          this.layouts[i].w = 24;
          this.layouts[i].h = 20;
          this.layouts[i].isVisible = true;
          found = true;
        }
        else {
          this.layouts[i].isVisible = false;
        }
      });

      if (!found) {
        this.layouts = _.concat(this.layouts, {i: 'matrix', x: 0, y: 0, w: 24, h: 20, minW: 5, isVisible: true});
      }
    }
  }

  load() {

    //load customs
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
    //save customs
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
                    {i: 'globals', x: 6, y: 16, w: 5, h: 4, minW: 4, isVisible: false},
                    {i: 'console', x: 11, y: 16, w: 5, h: 4, minW: 2, isVisible: true},
                    {i: 'debugconsole', x: 8, y: 21, w: 7, h: 13, minW: 7, isVisible: true},
                    {i: 'paths', x: 0, y: 21, w: 7, h: 13, minW: 7, isVisible: true},
                    {i: 'canvas', x: 0, y: 21, w: 7, h: 13, minW: 7, isVisible: true}];
  };
}

export default new LayoutStore();
