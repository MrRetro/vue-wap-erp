webpackJsonp([39],{"+dth":function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=e("Dd8w"),o=e.n(a),r=e("//Fk"),i=e.n(r),l=e("mvHQ"),d=e.n(l),s=e("FWz8"),A=e("1CjK"),c=e("OT9B"),C=e("3r8y"),f=e("Gtft"),m=e("N6PA"),b={name:"clue-add",extends:C.a,created:function(){var n=this;this.$nextTick(function(){var t=n.$route.params;console.log(t,"ddddd");var e=n.params.clueInfo;console.log("--------11111"),console.log(n.menu);var a=n.menu,o=a.clueAdditionalConfiguration,r=a.gender,i=a.clueShoppingWay;Object(s.d)().then(function(t){console.log(t,"=========================>success1");var a=[];t.forEach(function(n){console.log(n),"create-order"===n.code&&(a=n.fields)}),a.sort(function(n,t){return n.sort-t.sort}),console.log(a,"=========================>data1");var l=a.filter(function(n){return"step1"===n.description}),s=[];l.forEach(function(n){var t={attr:n.attr,type:A.a[n.configsObj.type],title:n.name,text:"",value:null,placeholder:n.configsObj.placeholder,indent:!0,columnWidth:n.columnWidth,selData:{source:[{key:"选项一",value:1},{key:"选项二",value:2}],selectedKey:"下单客户1"}};"vehicleModelId"===t.attr&&(t.singleChoose=!0),e&&"cluePK"===n.attr&&(t.text=e.clueNo,t.value=e.id,t.disable=!0);var a=!1;n.rulesObj&&n.rulesObj.forEach(function(n){"required"===n.type&&(a=!0)});var l=Object(m.a)(n);switch(a&&(t.required=a),l&&(t.rules=l),n.attr){case"vehicleModelId":t.selData.source=o.map(function(n){return{key:n.name,value:n.code}});break;case"gender":t.selData.source=r.map(function(n){return{key:n.name,value:n.code}});break;case"shoppingWay":t.selData.source=i.map(function(n){return{key:n.name,value:n.code}});break;case"appearance":case"interior":t.selData=null}"选择线索"!==n.name&&"cluePK"!==n.attr||e?s.push(t):console.log("111")}),n.form.data=s,console.log(n.form.data,"----------\x3e>>>>>>>>>"),e&&n.selClue(e),n.initData=d()(n.form)}).catch(function(n){console.log(n,"==============================>err")})})},data:function(){return{initData:null,form:{type:"add",customer:{attr:"customerPK",title:"客户主键",text:null},carName:{attr:"carName",title:"成型信息",text:null},data:[]}}},methods:{canGoBack:function(){return!this.params.BACK_ACTION||(this.$RouteUtil.back(this.params.BACK_ACTION),!1)},isEdit:function(){return this.initData!==d()(this.form)},onBtnClick:function(){var n=this;console.log("新建订单1");var t=this.$refs.va.map(function(n){return n.changeV()});i.a.all(t).then(function(t){if(t.every(function(n){return n})){console.log(n.form,"校验成功并提交数据");var e={};n.form.data.forEach(function(t){if("group"!==t.attr){var a="";a=t.value?t.value:0===t.value?0:t.text,console.log(a,"item"),"vehicleModelId"===t.attr&&(n.form.carName.text=t.text),e[t.attr]=a}}),console.log(e,"==>items");var a={};a.name=e.name,a.mobile=e.mobile,a.gender=e.gender,Object(c.b)(a).then(function(t){console.log(t,222);var e=n.form.data;e.forEach(function(n,t){var a="";a=n.value?n.value:0===n.value?0:n.text,console.log(a,"item"),"appearance"===n.attr&&(a="无"===a?null:a&&d()(a)||"",e[t].text=a,e[t].value=a),"interior"===n.attr&&(a="无"===a?null:a&&d()(a)||"",e[t].text=a,e[t].value=a)}),n.form.customer.text=t.id,e.push(n.form.customer),e.push(n.form.carName),console.log(e),t.isExist?n.$RouteUtil.orderAddTwo(o()({},n.params,{info:t,data1:e})):(console.log(e),n.$RouteUtil.orderAddThree(o()({},n.params,{data1:e})))}).catch(function(n){console.log(n,"888")})}})},onCarModel:function(n,t){var e=this;console.log(n,"2233344");var a=n.data.innerColors,o=n.data.outerColors;this.form.data.forEach(function(n,r){"appearance"===n.attr&&(t||(e.form.data[r].text=null,e.form.data[r].value=null),o?(e.form.data[r].selData=o,e.form.data[r].disable=!1,e.form.data[r].text=null):(e.form.data[r].selData=null,e.form.data[r].disable=!0,e.form.data[r].text="无")),"interior"===n.attr&&(t||(e.form.data[r].text=null,e.form.data[r].value=null),a?(e.form.data[r].selData=a,e.form.data[r].disable=!1,e.form.data[r].text=null):(e.form.data[r].selData=null,e.form.data[r].disable=!0,e.form.data[r].text="无"))}),console.log(this.form,"2233355")},selClue:function(n){var t=this;console.log(n," 123 "),this.form.data.forEach(function(e,a){if("vehicleModelId"===e.attr&&(t.form.data[a].text=n.carName,t.form.data[a].value=n.vehicleModelId),"appearance"===e.attr){var o=JSON.parse(n.appearance);t.form.data[a].text=o&&o.name,t.form.data[a].value=o||null}if("interior"===e.attr){var r=JSON.parse(n.interior),i=r&&r.colors&&r.colors[0].name;r.colors&&r.colors[1]&&(i+="/"+r.colors[1].name),t.form.data[a].text=i,t.form.data[a].value=r||null}"name"===e.attr&&(t.form.data[a].text=n.name,t.form.data[a].value=n.name),"mobile"===e.attr&&(t.form.data[a].text=n.mobile,t.form.data[a].value=n.mobile),"gender"===e.attr&&(t.form.data[a].text=n.gender.name,t.form.data[a].value=n.gender.code),"shoppingWay"===e.attr&&(t.form.data[a].text=n.shoppingWay.name,t.form.data[a].value=n.shoppingWay.code)}),n.vehicleModelId&&getModelDetail(n.vehicleModelId).then(function(n){console.log(n,"res1"),t.onCarModel({data:n},!0)}).catch(function(n){return console.log(n)})}},activated:function(){f.a.setRight()}},u=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"container"},[e("div",{staticClass:"input-box2"},[e("cube-scroll",[e("div",{staticClass:"content"},[n._l(n.form.data,function(t,a){return["customerId"===t.attr?e("div",{key:"index"+a,staticClass:"id-box"},n._l(n.form.info,function(t,a){return e("div",{key:"index2"+a,staticClass:"in-box",class:{self:50===t.columnWidth}},[e("yi-input",n._b({ref:"info",refInFor:!0,attrs:{value:t.value,indent:!0,selData:t.selData||null,clearMR:50===t.columnWidth,disable:!0},on:{"update:value":function(e){n.$set(t,"value",e)}},model:{value:t.text,callback:function(e){n.$set(t,"text",e)},expression:"item1.text"}},"yi-input",t,!1))],1)})):"groupHeader"===t.type?e("div",{key:"index"+a,staticClass:"section-title section-margin-top"},[n._v("\n            "+n._s(t.title)+"\n          ")]):e("div",{key:"index"+a,staticClass:"in-box",class:{self:50===t.columnWidth}},[e("yi-input",n._b({ref:t.rules.required?"va":null,refInFor:!0,attrs:{value:t.value,indent:!0,selData:t.selData||null,clearMR:50===t.columnWidth},on:{"update:value":function(e){n.$set(t,"value",e)},"update:selData":function(e){n.$set(t,"selData || null",e)},onCarModel:n.onCarModel,selClue:n.selClue},model:{value:t.text,callback:function(e){n.$set(t,"text",e)},expression:"item.text"}},"yi-input",t,!1))],1)]}),n._v(" "),e("div",{staticClass:"space-box"})],2)])],1),n._v(" "),e("yi-btn-box",{attrs:{name:"下一步"},on:{onBtnClick:n.onBtnClick}})],1)};u._withStripped=!0;var p={render:u,staticRenderFns:[]},v=p;var x=!1;var B=e("VU/8")(b,v,!1,function(n){x||e("gzdx")},"data-v-4879d69d",null);B.options.__file="src/modules/order/add/StepOne/index.vue";t.default=B.exports},"0i7K":function(n,t,e){(n.exports=e("FZ+f")(!0)).push([n.i,'\n.scroll-box[data-v-4879d69d] {\n  -webkit-overflow-scrolling: touch;\n  overflow-y: auto;\n}\n.app-init[data-v-4879d69d] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n}\n.flex-center[data-v-4879d69d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.full-parent[data-v-4879d69d] {\n  width: 100%;\n  height: 100%;\n}\n.slide-go-leave[data-v-4879d69d] {\n  -webkit-transform: translate3d(0, 0, 0);\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.slide-go-enter-active[data-v-4879d69d],\n.slide-go-leave-active[data-v-4879d69d],\n.slide-back-enter-active[data-v-4879d69d],\n.slide-back-leave-active[data-v-4879d69d] {\n  -webkit-transition: transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n  -webkit-transition: -webkit-transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n  transition: -webkit-transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n  transition: transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n  transition: transform 0.2s cubic-bezier(0.55, 0, 0.1, 1), -webkit-transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n}\n.slide-go-leave-to[data-v-4879d69d] {\n  -webkit-transform: translate3d(-100%, 0, 0);\n  -webkit-transform: translate3d(-100%, 0, 0);\n  transform: translate3d(-100%, 0, 0);\n}\n.slide-go-enter[data-v-4879d69d] {\n  -webkit-transform: translate3d(100%, 0, 0);\n  -webkit-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n}\n.slide-go-enter-to[data-v-4879d69d] {\n  -webkit-transform: translate3d(0%, 0, 0);\n  -webkit-transform: translate3d(0%, 0, 0);\n  transform: translate3d(0%, 0, 0);\n}\n.slide-back-leave[data-v-4879d69d] {\n  -webkit-transform: translate3d(0, 0, 0);\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.slide-back-leave-to[data-v-4879d69d] {\n  -webkit-transform: translate3d(100%, 0, 0);\n  -webkit-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n}\n.slide-back-enter[data-v-4879d69d] {\n  -webkit-transform: translate3d(-100%, 0, 0);\n  -webkit-transform: translate3d(-100%, 0, 0);\n  transform: translate3d(-100%, 0, 0);\n}\n.slide-back-enter-to[data-v-4879d69d] {\n  -webkit-transform: translate3d(0%, 0, 0);\n  -webkit-transform: translate3d(0%, 0, 0);\n  transform: translate3d(0%, 0, 0);\n}\n.fade-enter-active[data-v-4879d69d] {\n  -webkit-transition: all 0.5s;\n  transition: all 0.5s;\n}\n.fade-leave-active[data-v-4879d69d] {\n  -webkit-transition: all 0.5s;\n  transition: all 0.5s;\n}\n.fade-enter[data-v-4879d69d],\n.fade-leave-to[data-v-4879d69d] {\n  opacity: 0;\n  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";\n  filter: alpha(opacity=0);\n}\n.md-radio-content[data-v-4879d69d] {\n  font-size: 0.597333333333333rem;\n}\ninput[data-v-4879d69d]::-webkit-input-placeholder {\n  color: #b0b0b0;\n}\n.box-shadow[data-v-4879d69d] {\n  -webkit-box-shadow: 0rem 0.085333333333333rem 0.256rem rgba(0,0,0,0.16);\n  box-shadow: 0rem 0.085333333333333rem 0.256rem rgba(0,0,0,0.16);\n}\n.touch-opacity[data-v-4879d69d]:active {\n  opacity: 0.7;\n  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";\n  filter: alpha(opacity=70);\n}\n.ellipsis[data-v-4879d69d] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.container[data-v-4879d69d] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.container .section-title[data-v-4879d69d] {\n  width: 100%;\n  font-size: 0.682666666666667rem;\n  color: #31363b;\n  text-align: left;\n  margin: 0 0.597333333333333rem;\n  font-family: "PingFang SC";\n  font-weight: 500;\n}\n.container .section-margin-top[data-v-4879d69d] {\n  margin-top: 1.194666666666667rem;\n}\n.container .input-box2[data-v-4879d69d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  height: calc(100% - 50px);\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  overflow-y: auto;\n}\n.container .input-box2 .content[data-v-4879d69d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n.container .input-box2 .content .id-box[data-v-4879d69d] {\n  width: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n.container .input-box2 .content .in-box[data-v-4879d69d] {\n  width: 100%;\n}\n.container .input-box2 .content .self[data-v-4879d69d] {\n  width: 50%;\n}\n.container .input-box2 .content .self:nth-child(even) .input-box[data-v-4879d69d] {\n  margin-right: 0.597333333333333rem;\n}\n.container .p-warm[data-v-4879d69d] {\n  width: 100%;\n  background-color: #fdfcea;\n  height: 1.194666666666667rem;\n  line-height: 1.194666666666667rem;\n  font-size: 0.512rem;\n  color: #ef465b;\n}\n.container .space-box[data-v-4879d69d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 100%;\n  height: 3.328rem;\n}',"",{version:3,sources:["/usr/local/nginx/html/vue-wap-erp/src/modules/order/add/StepOne/index.vue"],names:[],mappings:";AACA;EACE,kCAAkC;EAClC,iBAAiB;CAClB;AACD;EACE,mBAAmB;EACnB,QAAQ;EACR,SAAS;EACT,UAAU;EACV,OAAO;CACR;AACD;EACE,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,0BAA0B;MACtB,uBAAuB;UACnB,oBAAoB;CAC7B;AACD;EACE,YAAY;EACZ,aAAa;CACd;AACD;EACE,wCAAwC;EACxC,wCAAwC;EACxC,gCAAgC;CACjC;AACD;;;;EAIE,iEAAiE;EACjE,yEAAyE;EACzE,iEAAiE;EACjE,yDAAyD;EACzD,+GAA+G;CAChH;AACD;EACE,4CAA4C;EAC5C,4CAA4C;EAC5C,oCAAoC;CACrC;AACD;EACE,2CAA2C;EAC3C,2CAA2C;EAC3C,mCAAmC;CACpC;AACD;EACE,yCAAyC;EACzC,yCAAyC;EACzC,iCAAiC;CAClC;AACD;EACE,wCAAwC;EACxC,wCAAwC;EACxC,gCAAgC;CACjC;AACD;EACE,2CAA2C;EAC3C,2CAA2C;EAC3C,mCAAmC;CACpC;AACD;EACE,4CAA4C;EAC5C,4CAA4C;EAC5C,oCAAoC;CACrC;AACD;EACE,yCAAyC;EACzC,yCAAyC;EACzC,iCAAiC;CAClC;AACD;EACE,6BAA6B;EAC7B,qBAAqB;CACtB;AACD;EACE,6BAA6B;EAC7B,qBAAqB;CACtB;AACD;;EAEE,WAAW;EACX,iEAAiE;EACjE,yBAAyB;CAC1B;AACD;EACE,gCAAgC;CACjC;AACD;EACE,eAAe;CAChB;AACD;EACE,wEAAwE;EACxE,gEAAgE;CACjE;AACD;EACE,aAAa;EACb,kEAAkE;EAClE,0BAA0B;CAC3B;AACD;EACE,iBAAiB;EACjB,wBAAwB;EACxB,oBAAoB;CACrB;AACD;EACE,mBAAmB;EACnB,OAAO;EACP,UAAU;EACV,QAAQ;EACR,SAAS;EACT,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,6BAA6B;EAC7B,8BAA8B;MAC1B,2BAA2B;UACvB,uBAAuB;CAChC;AACD;EACE,YAAY;EACZ,gCAAgC;EAChC,eAAe;EACf,iBAAiB;EACjB,+BAA+B;EAC/B,2BAA2B;EAC3B,iBAAiB;CAClB;AACD;EACE,iCAAiC;CAClC;AACD;EACE,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,0BAA0B;EAC1B,6BAA6B;EAC7B,8BAA8B;MAC1B,2BAA2B;UACvB,uBAAuB;EAC/B,oBAAoB;MAChB,YAAY;UACR,QAAQ;EAChB,iBAAiB;CAClB;AACD;EACE,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,+BAA+B;EAC/B,8BAA8B;MAC1B,wBAAwB;UACpB,oBAAoB;EAC5B,oBAAoB;MAChB,gBAAgB;CACrB;AACD;EACE,YAAY;EACZ,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,+BAA+B;EAC/B,8BAA8B;MAC1B,wBAAwB;UACpB,oBAAoB;EAC5B,oBAAoB;MAChB,gBAAgB;CACrB;AACD;EACE,YAAY;CACb;AACD;EACE,WAAW;CACZ;AACD;EACE,mCAAmC;CACpC;AACD;EACE,YAAY;EACZ,0BAA0B;EAC1B,6BAA6B;EAC7B,kCAAkC;EAClC,oBAAoB;EACpB,eAAe;CAChB;AACD;EACE,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,YAAY;EACZ,iBAAiB;CAClB",file:"index.vue",sourcesContent:['\n.scroll-box[data-v-4879d69d] {\n  -webkit-overflow-scrolling: touch;\n  overflow-y: auto;\n}\n.app-init[data-v-4879d69d] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n}\n.flex-center[data-v-4879d69d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.full-parent[data-v-4879d69d] {\n  width: 100%;\n  height: 100%;\n}\n.slide-go-leave[data-v-4879d69d] {\n  -webkit-transform: translate3d(0, 0, 0);\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.slide-go-enter-active[data-v-4879d69d],\n.slide-go-leave-active[data-v-4879d69d],\n.slide-back-enter-active[data-v-4879d69d],\n.slide-back-leave-active[data-v-4879d69d] {\n  -webkit-transition: transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n  -webkit-transition: -webkit-transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n  transition: -webkit-transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n  transition: transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n  transition: transform 0.2s cubic-bezier(0.55, 0, 0.1, 1), -webkit-transform 0.2s cubic-bezier(0.55, 0, 0.1, 1);\n}\n.slide-go-leave-to[data-v-4879d69d] {\n  -webkit-transform: translate3d(-100%, 0, 0);\n  -webkit-transform: translate3d(-100%, 0, 0);\n  transform: translate3d(-100%, 0, 0);\n}\n.slide-go-enter[data-v-4879d69d] {\n  -webkit-transform: translate3d(100%, 0, 0);\n  -webkit-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n}\n.slide-go-enter-to[data-v-4879d69d] {\n  -webkit-transform: translate3d(0%, 0, 0);\n  -webkit-transform: translate3d(0%, 0, 0);\n  transform: translate3d(0%, 0, 0);\n}\n.slide-back-leave[data-v-4879d69d] {\n  -webkit-transform: translate3d(0, 0, 0);\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.slide-back-leave-to[data-v-4879d69d] {\n  -webkit-transform: translate3d(100%, 0, 0);\n  -webkit-transform: translate3d(100%, 0, 0);\n  transform: translate3d(100%, 0, 0);\n}\n.slide-back-enter[data-v-4879d69d] {\n  -webkit-transform: translate3d(-100%, 0, 0);\n  -webkit-transform: translate3d(-100%, 0, 0);\n  transform: translate3d(-100%, 0, 0);\n}\n.slide-back-enter-to[data-v-4879d69d] {\n  -webkit-transform: translate3d(0%, 0, 0);\n  -webkit-transform: translate3d(0%, 0, 0);\n  transform: translate3d(0%, 0, 0);\n}\n.fade-enter-active[data-v-4879d69d] {\n  -webkit-transition: all 0.5s;\n  transition: all 0.5s;\n}\n.fade-leave-active[data-v-4879d69d] {\n  -webkit-transition: all 0.5s;\n  transition: all 0.5s;\n}\n.fade-enter[data-v-4879d69d],\n.fade-leave-to[data-v-4879d69d] {\n  opacity: 0;\n  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";\n  filter: alpha(opacity=0);\n}\n.md-radio-content[data-v-4879d69d] {\n  font-size: 0.597333333333333rem;\n}\ninput[data-v-4879d69d]::-webkit-input-placeholder {\n  color: #b0b0b0;\n}\n.box-shadow[data-v-4879d69d] {\n  -webkit-box-shadow: 0rem 0.085333333333333rem 0.256rem rgba(0,0,0,0.16);\n  box-shadow: 0rem 0.085333333333333rem 0.256rem rgba(0,0,0,0.16);\n}\n.touch-opacity[data-v-4879d69d]:active {\n  opacity: 0.7;\n  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";\n  filter: alpha(opacity=70);\n}\n.ellipsis[data-v-4879d69d] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.container[data-v-4879d69d] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.container .section-title[data-v-4879d69d] {\n  width: 100%;\n  font-size: 0.682666666666667rem;\n  color: #31363b;\n  text-align: left;\n  margin: 0 0.597333333333333rem;\n  font-family: "PingFang SC";\n  font-weight: 500;\n}\n.container .section-margin-top[data-v-4879d69d] {\n  margin-top: 1.194666666666667rem;\n}\n.container .input-box2[data-v-4879d69d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  height: calc(100% - 50px);\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  overflow-y: auto;\n}\n.container .input-box2 .content[data-v-4879d69d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n.container .input-box2 .content .id-box[data-v-4879d69d] {\n  width: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n.container .input-box2 .content .in-box[data-v-4879d69d] {\n  width: 100%;\n}\n.container .input-box2 .content .self[data-v-4879d69d] {\n  width: 50%;\n}\n.container .input-box2 .content .self:nth-child(even) .input-box[data-v-4879d69d] {\n  margin-right: 0.597333333333333rem;\n}\n.container .p-warm[data-v-4879d69d] {\n  width: 100%;\n  background-color: #fdfcea;\n  height: 1.194666666666667rem;\n  line-height: 1.194666666666667rem;\n  font-size: 0.512rem;\n  color: #ef465b;\n}\n.container .space-box[data-v-4879d69d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 100%;\n  height: 3.328rem;\n}'],sourceRoot:""}])},gzdx:function(n,t,e){var a=e("0i7K");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);e("rjj0")("310105dc",a,!1,{})}});