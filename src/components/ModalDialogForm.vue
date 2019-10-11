<template>
  <q-dialog v-model="modal" persistent>
      <div class="q-pa-md" style="width: 600px">
        <q-card>
          <q-card-section>
            <q-input
              v-model="attended.name"
              label="Nome Completo"
              :error="$v.attended.name.$error"
            />
            <q-input
              v-model="attended.registrationNumber"
              label="Matrícula"
              maxlength="10"
              :error="$v.attended.registrationNumber.$error"
            />
            <div class="row justify-between">
              <div class="q-pr-sm col-6">
                <q-datetime-picker
                  v-model="attended.birthDate"
                  label="Data Nascimento"
                  auto-update-value
                  :error="$v.attended.birthDate.$error"
                  lang="pt-BR">
                </q-datetime-picker>
              </div>
              <div class="q-pl-sm col-6">
                <q-datetime-picker
                  v-model="attended.registrationDate"
                  label="Data Matrícula"
                  auto-update-value
                  :error="$v.attended.registrationDate.$error"
                  lang="pt-BR">
                </q-datetime-picker>
              </div>
            </div>
            <q-field
              label="Sexo"
              borderless
              :error="$v.attended.gender.$error"
            >
              <q-option-group
                class="q-mt-md"
                v-model="attended.gender"
                :options="genderOptions"
                inline
              />
            </q-field>
            <div class="row justify-between">
              <div class="q-pr-sm col-6">
                <q-input
                  type="tel"
                  mask="(##)####-####"
                  v-model="attended.contact.telephoneNumber"
                  label="Telefone Fixo"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_phone" />
                  </template>
                </q-input>
              </div>
              <div class="q-pl-sm col-6">
                <q-input
                  clear-icon="telephone"
                  type="tel"
                  mask="(##)#####-####"
                  v-model="attended.contact.mobileNumber"
                  label="Celular"
                >
                  <template v-slot:prepend>
                    <q-icon name="smartphone" />
                  </template>
                </q-input>
              </div>
            </div>
            <q-input
              type="email"
              v-model="attended.contact.email"
              label="E-mail"
              :error="$v.attended.contact.email.$error"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
            <div class="q-gutter-md">
              <q-input
                v-model="attended.tutor.name"
                label="Nome do Responsável"
              >
              </q-input>
              <q-select v-model="attended.tutor.tutorType" :options="tutorTypeOptions" label="Grau de Parentesco do Responsável" />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" size="12px" @click="resetModalRegister()" v-close-popup/>
            <q-btn label="Gravar" color="light-blue" size="12px" icon-right="send" @click="createOrEdit()" />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
</template>

<script>
import { required, integer, maxLength, email } from 'vuelidate/lib/validators'
import moment from 'moment'
export default {
  name: 'modal-dialog-form',
  events: ['acabei'],
  props: {
    data: {}
  },
  data () {
    return {
      modal: false,
      attendedFromSource: undefined,
      attended: this.data,
      genderOptions: [
        { label: 'Masculino', value: 'male', color: 'light-blue' },
        { label: 'Feminino', value: 'female', color: 'pink-4' }
      ],
      tutorTypeOptions: [
        { label: 'Pai', value: 'father' },
        { label: 'Mãe', value: 'mother' },
        { label: 'Avô', value: 'grandfather' },
        { label: 'Avó', value: 'grandmother' },
        { label: 'Tio', value: 'uncle' },
        { label: 'Tia', value: 'aunt' },
        { label: 'Outro', value: 'other' }
      ]
    }
  },
  mounted () {
    console.log(this.data)
  },
  validations: {
    attended: {
      name: { required },
      registrationNumber: { required, integer, maxLength: maxLength(11) },
      birthDate: { required, between: value => value > '1900-01-01T00:00:00' && value <= new Date().toISOString() },
      registrationDate: { required, between: value => value > '1900-01-01T00:00:00' && value <= new Date().toISOString() },
      gender: { required },
      contact: {
        email: { email }
      }
    }
  },
  methods: {
    fillForm (obj) {
      this.attendedFromSource = obj

      this.attended = Object.assign(this.attended, obj)
      console.log(this.attended)
      this.attended.birthDate = moment(obj.birthDate, 'DD/MM/YYYY').format('MM-DD-YYYY')
      this.attended.registrationDate = moment(obj.registrationDate, 'DD/MM/YYYY').format('MM-DD-YYYY')
      this.attended.gender = obj.gender === 'Masculino' ? 'male' : 'female'
      this.attended.tutor.tutorType = this.tutorTypeEnumToStr(obj.tutor.tutorType)
    },
    postAttended () {
      this.$v.attended.$touch()
      if (!this.$v.attended.$error) {
        this.$q.loading.show({
          delay: 200,
          spinner: 'QSpinnerPie'
        })
        this.hideDialog()
        this.attended.tutor.tutorType = this.attended.tutor.tutorType.value
        this.$axios
          .post('https://localhost:5001/api/attendeds', this.attended)
          .then((response) => {
            this.$q.notify({
              color: 'green',
              icon: 'done',
              message: 'CADASTRADO COM SUCESSO!'
            })
            this.$emit('refreshDataTable')
            this.$q.loading.hide()
            this.resetModalRegister()
          })
          .catch((err) => {
            this.$q.loading.hide()
            console.log('errstatus: ', err.response.status)
            if (err.response.status === 422) {
              this.$q.notify({
                color: 'red',
                icon: 'warning',
                message: 'MATRÍCULA ' + this.attended.registrationNumber + ' JÁ VINCULADA PARA UM ATENDIDO'
              })
            }
            this.$q.loading.hide()
            throw new Error(err)
          })
      } else {
        this.$q.loading.hide()
        this.$q.notify({
          color: 'red',
          icon: 'warning',
          message: 'PREENCHA OS CAMPOS CORRETAMENTE'
        })
      }
    },
    putAttended () {
      this.$v.attended.$touch()
      if (!this.$v.attended.$error) {
        this.$q.loading.show({
          delay: 200,
          spinner: 'QSpinnerPie'
        })
        this.hideDialog()
        this.attended.tutor.tutorType = this.attended.tutor.tutorType.value
        this.$axios
          .put('https://localhost:5001/api/attendeds/' + this.attended.id + '/', this.attended)
          .then((response) => {
            this.$q.notify({
              color: 'green',
              icon: 'done',
              message: 'EDITADO COM SUCESSO!'
            })
            this.$emit('refreshDataTable')
            this.$q.loading.hide()
          })
          .catch((err) => {
            this.$q.loading.hide()
            throw new Error(err)
          })
      } else {
        this.$q.loading.hide()
        this.$q.notify({
          color: 'red',
          icon: 'warning',
          message: 'PREENCHA OS CAMPOS CORRETAMENTE'
        })
      }
    },
    resetModalRegister () {
      this.attended.name = undefined
      this.attended.registrationNumber = null
      this.attended.birthDate = undefined
      this.attended.registrationDate = undefined
      this.attended.gender = undefined
      this.attended.contact.telephoneNumber = undefined
      this.attended.contact.mobileNumber = undefined
      this.attended.contact.email = undefined
      this.attended.tutor.name = undefined
      this.attended.tutor.tutorType = undefined
      this.$v.$reset()
    },
    showDialog () {
      this.modal = true
    },
    hideDialog () {
      this.modal = false
    },
    tutorTypeEnumToStr (tutorType) {
      switch (tutorType) {
        case 0:
          return 'Pai'
        case 1:
          return 'Mãe'
        case 2:
          return 'Avô'
        case 3:
          return 'Avó'
        case 4:
          return 'Tio'
        case 5:
          return 'Tia'
        case 6:
          return 'Outro'
      }
    },
    createOrEdit () {
      this.attendedFromSource === undefined ? this.postAttended() : this.putAttended()
    }
  }
}
</script>
