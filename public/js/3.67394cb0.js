(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{"013f":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-layout",[i("q-page-container",[i("q-card",{staticClass:"my-card-login"},[i("q-card-section",{staticClass:"my-card-section-login"},[i("div",{staticClass:"q-pa-md my-div-card-login",staticStyle:{"max-width":"400px"}},[i("q-form",{staticClass:"q-gutter-md",on:{submit:function(e){return e.preventDefault(),t.onSubmit(e)},reset:t.onReset}},[i("q-input",{attrs:{filled:"",label:"E-mail",hint:"Digite seu e-mail","lazy-rules":"",rules:[function(t){return t&&t.length>0&&t.includes("@")||"Digite seu e-mail"}]},model:{value:t.credentials.email,callback:function(e){t.$set(t.credentials,"email",e)},expression:"credentials.email"}}),i("q-input",{attrs:{filled:"",type:"password",label:"Senha",hint:"Digite sua senha","lazy-rules":"",rules:[function(t){return t&&""!==t||"Digite sua senha"}]},model:{value:t.credentials.password,callback:function(e){t.$set(t.credentials,"password",e)},expression:"credentials.password"}}),i("div",[i("q-btn",{attrs:{label:"Login",type:"submit",color:"primary",loading:t.submitting},scopedSlots:t._u([{key:"loading",fn:function(){return[i("q-spinner-pie")]},proxy:!0}])}),i("q-btn",{staticClass:"q-ml-sm",attrs:{label:"Limpar",type:"reset",color:"primary",flat:""}})],1)],1)],1)])],1)],1)],1)},a=[],s=(i("a481"),i("551c"),i("06db"),{name:"LoginPage",data:function(){return{submitting:!1,credentials:{email:"",password:""},token:void 0,accept:!1,urlString:"https://psykoreportapi.herokuapp.com/api/auth"}},methods:{onSubmit:function(){var t=this;return this.simulateSubmit(!0),new Promise((function(e,i){t.$axios.post(t.urlString,t.credentials).then((function(i){i&&(localStorage.setItem("token",i.data),t.$router.push("/"),e(i)),t.simulateSubmit(!1),t.$q.notify({position:"top-right",color:"green",icon:"done",message:"LOGADO COM SUCESSO!"})})).catch((function(e){throw 401===e.response.status?t.$q.notify({color:"orange",icon:"warning",message:"E-MAIL NÃO EXISTENTE OU SENHA INCORRETA"}):t.$q.notify({color:"red",icon:"error",message:"NÃO FOI POSSÍVEL CONECTAR"}),t.simulateSubmit(!1),i(e),new Error(e)}))}))},onReset:function(){this.credentials.email="",this.credentials.password=""},simulateSubmit:function(t){this.submitting=t},register:function(){this.$router.replace("/register")}}}),r=s,o=(i("1139"),i("2877")),l=i("eebe"),c=i.n(l),u=i("4d5a"),d=i("09e3"),m=i("f09f"),p=i("a370"),f=i("0378"),g=i("27f9"),b=i("9c40"),h=i("163c"),S=Object(o["a"])(r,n,a,!1,null,null,null);e["default"]=S.exports;c()(S,"components",{QLayout:u["a"],QPageContainer:d["a"],QCard:m["a"],QCardSection:p["a"],QForm:f["a"],QInput:g["a"],QBtn:b["a"],QSpinnerPie:h["a"]})},"0a42":function(t,e,i){},1139:function(t,e,i){"use strict";var n=i("0a42"),a=i.n(n);a.a}}]);