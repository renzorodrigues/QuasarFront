<template>
  <q-layout>
    <q-page-container>
      <q-card class="my-card">
        <q-card-section class="my-card-section">
          <div class="q-pa-md" style="max-width: 400px">
            <q-form
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="credential.email"
                label="E-mail"
                hint="Digite seu e-mail"
                lazy-rules
                :rules="[ val => val && val.length > 0 && val.includes('@') || 'Digite seu e-mail']"
              />

              <q-input
                filled
                type="password"
                v-model="credential.password"
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
      credential: {
        email: '',
        password: ''
      },
      accept: false
    }
  },
  methods: {
    onSubmit () {
      this.simulateSubmit(true)
      console.log(this.credential)
      this.$axios
        .post('https://localhost:5001/api/auth', this.credential)
        .then((response) => {
          console.log(response)
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
          throw new Error(err)
        })
    },
    onReset () {
      this.credential.email = ''
      this.credential.password = ''
    },
    simulateSubmit (loading) {
      this.submitting = loading
    }
  }
}
</script>
<style lang="stylus">
.my-card
  background-color #011727
  width 100%
  height 400px

.my-card-section
  width 400px
  position $relative
  left 50%
  top 80%
  margin-left -200px
  margin-top -50px
  background-color #A6B3BE
</style>
