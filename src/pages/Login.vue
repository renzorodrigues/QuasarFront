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
                v-model="login.email"
                label="E-mail"
                hint="Digite seu e-mail"
                lazy-rules
                :rules="[ val => val && val.length > 0 && val.includes('@') || 'Digite seu e-mail']"
              />

              <q-input
                filled
                type="password"
                v-model="login.password"
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
      login: {
        email: '',
        password: ''
      },
      accept: false
    }
  },
  methods: {
    onSubmit () {
      this.simulateSubmit(true)
      console.log(this.login)
      this.$axios
        .post('https://localhost:5001/api/login', this.login)
        .then((response) => {
          console.log(response)
          this.simulateSubmit(false)
        })
    },
    onReset () {
      this.login.email = ''
      this.login.password = ''
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
