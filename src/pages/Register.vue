<template>
  <q-layout>
    <q-page-container>
      <q-card class="my-card">
        <q-card-section class="my-card-section">
          <div class="q-pa-md my-div-card" style="max-width: 400px">
            <q-form
              @submit.prevent="onSubmit"
              @reset="onReset"
              class="q-gutter-md"
            >

              <q-input
                filled
                v-model="credentials.name"
                label="Nome"
                hint="Digite seu nome completo"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Digite seu nome completo']"
              />

              <q-input
                filled
                v-model="credentials.email"
                label="E-mail"
                hint="Digite seu e-mail"
                lazy-rules
                :rules="[ val => val && val.length > 0 && val.includes('@') || 'Digite seu e-mail']"
              />

              <q-input
                v-model="credentials.password"
                filled
                label="Senha"
                :type="isPwd ? 'password' : 'text'"
                hint="Digite sua senha"
                lazy-rules
                :rules="[ val => val && val.length >= 5 || 'A senha deve conter pelo menos 5 caracteres']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-input
                v-model="confirmPassword"
                filled
                label="Confirme Senha"
                :type="isConfirmedPwd ? 'password' : 'text'"
                hint='Confirme sua senha'
                lazy-rules
                :rules="[ val => val && val.length >= 5 && val === this.credentials.password || 'A senhas não conferem']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isConfirmedPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isConfirmedPwd = !isConfirmedPwd"
                  />
                </template>
              </q-input>
              <div>
                <q-btn
                  label="Registrar"
                  type="submit"
                  color="green"
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
          <div class="q-mb-sm text-right">
            <q-btn
              label="Voltar"
              color="blue"
              size="sm"
              icon="arrow_back"
              @click="backToLogin"
            >
            </q-btn>
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
      isPwd: true,
      isConfirmedPwd: true,
      confirmPassword: '',
      credentials: {
        email: '',
        password: ''
      },
      accept: false,
      urlString: 'https://localhost:5001/api/auth/register/' // 'https://psykoreportapi.herokuapp.com/api/auth/register/'
    }
  },
  methods: {
    onSubmit () {
      this.simulateSubmit(true)
      if (this.credentials.password !== this.confirmPassword) {
        this.$q.notify({
          color: 'orange',
          icon: 'warning',
          message: 'SENHAS NÃO CONFEREM'
        })
        this.simulateSubmit(false)
        return
      }
      this.$axios
        .post(this.urlString, this.credentials)
        .then((response) => {
          this.$q.notify({
            color: 'green',
            icon: 'done',
            message: 'CADASTRADO COM SUCESSO'
          })
          this.simulateSubmit(false)
          this.$router.replace('/login')
        })
        .catch((err) => {
          if (err.response.status === 409) {
            this.$q.notify({
              color: 'orange',
              icon: 'warning',
              message: 'E-MAIL JÁ CADASTRADO'
            })
            this.simulateSubmit(false)
            throw new Error(err)
          }
          this.$q.notify({
            color: 'orange',
            icon: 'warning',
            message: 'FALHA AO TENTAR REALIZAR CADASTRO'
          })
          this.simulateSubmit(false)
          throw new Error(err)
        })
    },
    onReset () {
      this.credentials.name = ''
      this.credentials.email = ''
      this.credentials.password = ''
      this.confirmPassword = ''
    },
    simulateSubmit (loading) {
      this.submitting = loading
    },
    backToLogin () {
      this.$router.replace('/login')
    }
  }
}
</script>
<style lang="stylus">
.my-card
  background url('../assets/images/logo.jpg');
  width 100%
  height 400px

.my-div-card
    background-color #FFFFFF

.my-card-section
  width 400px
  left 50%
  top 200px
  margin-left -200px
  margin-top -100px
</style>
