<template>
  <q-layout>
    <q-page-container>
      <q-card class="my-card">
        <q-card-section class="my-card-section">
          <div class="q-pa-md" style="max-width: 400px">
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
      accept: false
    }
  },
  methods: {
    onSubmit () {
      this.simulateSubmit(true)
      return new Promise((resolve, reject) => {
        this.$axios
          .post('https://localhost:5001/api/auth', this.credentials)
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
    }
  }
}
</script>
<style lang="stylus">
.my-card
  background url('../assets/images/logo.jpg');
  width 100%
  height 400px

.my-card-section
  width 400px
  position $relative
  left 50%
  top 70%
  margin-left -200px
  margin-top -50px
  background-color #A6B3BE
</style>
