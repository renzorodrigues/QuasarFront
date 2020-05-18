(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"56b4":function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=this,i=t.$createElement,n=t._self._c||i;return n("q-layout",[n("q-page-container",[n("q-card",{staticClass:"my-card"},[n("q-card-section",{staticClass:"my-card-section"},[n("div",{staticClass:"q-pa-md my-div-card",staticStyle:{"max-width":"400px"}},[n("q-form",{staticClass:"q-gutter-md",on:{submit:function(e){return e.preventDefault(),t.onSubmit(e)},reset:t.onReset}},[n("q-input",{attrs:{filled:"",label:"Nome",hint:"Digite seu nome completo","lazy-rules":"",rules:[function(e){return e&&e.length>0||"Digite seu nome completo"}]},model:{value:t.credentials.name,callback:function(e){t.$set(t.credentials,"name",e)},expression:"credentials.name"}}),n("q-input",{attrs:{filled:"",label:"E-mail",hint:"Digite seu e-mail","lazy-rules":"",rules:[function(e){return e&&e.length>0&&e.includes("@")||"Digite seu e-mail"}]},model:{value:t.credentials.email,callback:function(e){t.$set(t.credentials,"email",e)},expression:"credentials.email"}}),n("q-input",{attrs:{filled:"",label:"Senha",type:t.isPwd?"password":"text",hint:"Digite sua senha","lazy-rules":"",rules:[function(e){return e&&e.length>=5||"A senha deve conter pelo menos 5 caracteres"}]},scopedSlots:t._u([{key:"append",fn:function(){return[n("q-icon",{staticClass:"cursor-pointer",attrs:{name:t.isPwd?"visibility_off":"visibility"},on:{click:function(e){t.isPwd=!t.isPwd}}})]},proxy:!0}]),model:{value:t.credentials.password,callback:function(e){t.$set(t.credentials,"password",e)},expression:"credentials.password"}}),n("q-input",{attrs:{filled:"",label:"Confirme Senha",type:t.isConfirmedPwd?"password":"text",hint:"Confirme sua senha","lazy-rules":"",rules:[function(t){return t&&t.length>=5&&t===e.credentials.password||"A senhas não conferem"}]},scopedSlots:t._u([{key:"append",fn:function(){return[n("q-icon",{staticClass:"cursor-pointer",attrs:{name:t.isConfirmedPwd?"visibility_off":"visibility"},on:{click:function(e){t.isConfirmedPwd=!t.isConfirmedPwd}}})]},proxy:!0}]),model:{value:t.confirmPassword,callback:function(e){t.confirmPassword=e},expression:"confirmPassword"}}),n("div",[n("q-btn",{attrs:{label:"Registrar",type:"submit",color:"green",loading:t.submitting},scopedSlots:t._u([{key:"loading",fn:function(){return[n("q-spinner-pie")]},proxy:!0}])}),n("q-btn",{staticClass:"q-ml-sm",attrs:{label:"Limpar",type:"reset",color:"primary",flat:""}})],1)],1)],1),n("div",{staticClass:"q-mb-sm text-right"},[n("q-btn",{attrs:{label:"Voltar",color:"blue",size:"sm",icon:"arrow_back"},on:{click:t.backToLogin}})],1)])],1)],1)],1)},s=[],a=(i("7f7f"),i("a481"),{name:"LoginPage",data:function(){return{submitting:!1,isPwd:!0,isConfirmedPwd:!0,confirmPassword:"",credentials:{email:"",password:""},accept:!1,urlString:"https://localhost:5001/api/auth/register/"}},methods:{onSubmit:function(){var e=this;if(this.simulateSubmit(!0),this.credentials.password!==this.confirmPassword)return this.$q.notify({color:"orange",icon:"warning",message:"SENHAS NÃO CONFEREM"}),void this.simulateSubmit(!1);this.$axios.post(this.urlString,this.credentials).then((function(t){e.$q.notify({color:"green",icon:"done",message:"CADASTRADO COM SUCESSO"}),e.simulateSubmit(!1),e.$router.replace("/login")})).catch((function(t){if(409===t.response.status)throw e.$q.notify({color:"orange",icon:"warning",message:"E-MAIL JÁ CADASTRADO"}),e.simulateSubmit(!1),new Error(t);throw e.$q.notify({color:"orange",icon:"warning",message:"FALHA AO TENTAR REALIZAR CADASTRO"}),e.simulateSubmit(!1),new Error(t)}))},onReset:function(){this.credentials.name="",this.credentials.email="",this.credentials.password="",this.confirmPassword=""},simulateSubmit:function(e){this.submitting=e},backToLogin:function(){this.$router.replace("/login")}}}),r=a,o=(i("7625"),i("2877")),l=i("eebe"),c=i.n(l),u=i("4d5a"),d=i("09e3"),m=i("f09f"),f=i("a370"),p=i("0378"),h=i("27f9"),b=i("0016"),g=i("9c40"),w=i("163c"),y=Object(o["a"])(r,n,s,!1,null,null,null);t["default"]=y.exports;c()(y,"components",{QLayout:u["a"],QPageContainer:d["a"],QCard:m["a"],QCardSection:f["a"],QForm:p["a"],QInput:h["a"],QIcon:b["a"],QBtn:g["a"],QSpinnerPie:w["a"]})},7625:function(e,t,i){"use strict";var n=i("a690"),s=i.n(n);s.a},a690:function(e,t,i){}}]);