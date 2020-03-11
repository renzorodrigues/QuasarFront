<template>
  <q-layout>
    <q-page-container>
      <q-card class="my-card-login">
        <q-card-section class="my-card-section-login">
          <div class="q-pa-md my-div-card-login" style="max-width: 400px">
            <q-form
              @submit.prevent="onSubmit"
              @reset="onReset"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="credentials.email"
                label="E-mail"
                hint="Digite seu e-mail"
                lazy-rules
                :rules="[ val => val && val.length > 0 && val.includes('@') || 'Digite seu e-mail']"
              />

              <q-input
                filled
                type="password"
                v-model="credentials.password"
                label="Senha"
                hint="Digite sua senha"
                lazy-rules
                :rules="[
                  val => val && val !== '' || 'Digite sua senha'
                ]"
              />
              <div>
                <q-btn
                  label="Login"
                  type="submit"
                  color="primary"
                  :loading="submitting"
                >
                  <template v-slot:loading>
                    <q-spinner-pie />
                  </template>
                </q-btn>
                <q-btn label="Limpar" type="reset" color="primary" flat class="q-ml-sm" />
              </div>
            </q-form>
          </div>
          <!--
          <div class="q-pa-md text-right">
            <q-btn class="q-mr-md"
              flat
              size="sm">Esqueceu a senha?
            </q-btn>
            <q-btn
                label="Registrar"
                type="button"
                color="green"
                size="sm"
                @click="register"
              >
           </q-btn>
          </div>
          -->
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LoginPage',
  data () {
    return {
      submitting: false,
      credentials: {
        email: '',
        password: ''
      },
      token: undefined,
      accept: false,
      urlString: 'https://localhost:5001/api/auth/' // 'https://psykoreportapi.herokuapp.com/api/auth'
    }
  },
  methods: {
    onSubmit () {
      this.simulateSubmit(true)
      return new Promise((resolve, reject) => {
        this.$axios
          .post(this.urlString, this.credentials)
          .then((response) => {
            if (response) {
              localStorage.setItem('token', response.data)
              this.$router.push('/')
              resolve(response)
            }
            this.simulateSubmit(false)
            this.$q.notify({
              position: 'top-right',
              color: 'green',
              icon: 'done',
              message: 'LOGADO COM SUCESSO!'
            })
          })
          .catch((err) => {
            if (err.response.status === 401) {
              this.$q.notify({
                color: 'orange',
                icon: 'warning',
                message: 'E-MAIL NÃO EXISTENTE OU SENHA INCORRETA'
              })
            } else {
              this.$q.notify({
                color: 'red',
                icon: 'error',
                message: 'NÃO FOI POSSÍVEL CONECTAR'
              })
            }
            this.simulateSubmit(false)
            reject(err)
            throw new Error(err)
          })
      })
    },
    onReset () {
      this.credentials.email = ''
      this.credentials.password = ''
    },
    simulateSubmit (loading) {
      this.submitting = loading
    },
    register () {
      this.$router.replace('/register')
    }
  }
}
</script>
<style lang="stylus">
.my-card-login
  background url('../assets/images/logo.jpg');
  width 100%
  height 400px

.my-div-card-login
    background-color #FFFFFF

.my-card-section-login
  width 400px
  left 50%
  top 300px
  margin-left -200px
  margin-top -100px
</style>
