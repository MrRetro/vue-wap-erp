webpackJsonp([39],{"6CHf":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={props:{name:{type:String},label:{type:String},disabled:{type:Boolean,default:!1},value:String,type:{type:String,default:"text",validate:function(e){return-1!==["text","url","email","password","search"].indexOf(e)}}},methods:{updateValue:function(e){this.$emit("input",e.target.value)}}},i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"form__input"},[e.label?a("label",{staticClass:"form__label"},[e._v(e._s(e.label))]):e._e(),e._v(" "),a("input",{staticClass:"input",attrs:{type:e.type,disabled:e.disabled},domProps:{value:e.value},on:{input:e.updateValue,change:e.updateValue}})])};i._withStripped=!0;var n={render:i,staticRenderFns:[]},l=n;var s=a("VU/8")(r,l,!1,null,null,null);s.options.__file="src\\modules\\home\\Text.vue";var o={components:{TextInput:s.exports},data:function(){return{email:""}},methods:{validateBeforeSubmit:function(){this.$validator.validateAll().then(function(e){e?alert("Form Submitted!"):alert("Correct them errors!")})}}},u=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("input",{directives:[{name:"validate",rawName:"v-validate",value:"required|email",expression:"'required|email'"}],attrs:{name:"name",type:"text"}}),e._v(" "),a("span",[e._v(e._s(e.errors.first("name")))]),e._v(" "),a("br"),a("br"),e._v(" "),a("text-input",{directives:[{name:"validate",rawName:"v-validate",value:"required|email",expression:"'required|email'"}],attrs:{name:"email",label:"Email Address",type:"email"},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}}),e._v(" "),a("span",[e._v(e._s(e.errors.first("email")))]),e._v(" "),a("p",{staticClass:"btn",on:{click:e.validateBeforeSubmit}},[e._v("确认提交")])],1)};u._withStripped=!0;var d={render:u,staticRenderFns:[]},p=d;var v=!1;var m=a("VU/8")(o,p,!1,function(e){v||a("dflV")},"data-v-35d94614",null);m.options.__file="src\\modules\\home\\form.vue";t.default=m.exports},R0i0:function(e,t,a){(e.exports=a("FZ+f")(!0)).push([e.i,"\ninput[data-v-35d94614]{\r\n  border: 1px solid;\n}\r\n","",{version:3,sources:["D:/Work/myGithub/vue-wap-erp/src/modules/home/form.vue"],names:[],mappings:";AACA;EACE,kBAAkB;CACnB",file:"form.vue",sourcesContent:["\ninput[data-v-35d94614]{\r\n  border: 1px solid;\n}\r\n"],sourceRoot:""}])},dflV:function(e,t,a){var r=a("R0i0");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a("rjj0")("2ff02e8e",r,!1,{})}});