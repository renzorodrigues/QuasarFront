<template>
  <div class="q-pa-md">
    <q-btn color="light-blue" icon="person_add" label="CADASTRAR" @click="openModalRegister()" />
    <div class="q-pa-md">
      <q-table
        title="Atendidos"
        :data="attendeds"
        :columns="columns"
        row-key="registrationNumber"
        selection="multiple"
        :loading="loading"
        loading-label="Carregando..."
        no-data-label="Sem dados disponíveis"
        :selected-rows-label="selectedRowsLabel"
        :selected.sync="selected"
        :filter="filter"
        @request="getAttendedsBySearch()"
      >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Nome ou Matrícula" @input="getAttendedsBySearch">
          <template v-slot:append>
            <q-icon name="search" />
            <q-btn color="negative" flat round delete icon="delete" @click="deleteConfirm()" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox color="primary" v-model="props.selected" />
          </q-td>
          <q-td key="registrationNumber" :props="props">
            {{ props.row.registrationNumber }}
          </q-td>
          <q-td key="name" :props="props">
              {{ props.row.name }}
          </q-td>
          <q-td key="birthDate" :props="props">
              {{ props.row.birthDate }}
          </q-td>
          <q-td key="registrationDate" :props="props">
              {{ props.row.registrationDate }}
          </q-td>
          <q-td key="gender" :props="props">
              {{ props.row.gender }}
          </q-td>
          <q-td key="edit" :props="props">
              <q-btn round color="orange" size="sm" icon="edit" @click="openModalEdit(props.row)" />
          </q-td>
          <q-td key="report" :props="props">
              <q-btn round color="primary" size="sm" icon="assignment" />
          </q-td>
        </q-tr>
      </template>
      </q-table>
    </div>
    <q-dialog v-model="modalRegister" persistent>
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
            <q-btn flat label="Cancelar" color="primary" size="12px" @click="resetModalRegister()" v-close-popup />
            <q-btn label="Gravar" color="light-blue" size="12px" icon-right="send" @click="postAttended()" />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
    <q-dialog v-model="modalEdit">
      <div class="q-pa-md" style="width: 600px">
        <q-card>
          <q-card-section>
            <q-input
              v-model="editedAttended.name"
              label="Nome Completo"
              :error="$v.editedAttended.name.$error"
            />
            <q-input
              v-model="editedAttended.registrationNumber"
              label="Matrícula"
              maxlength="10"
              :error="$v.editedAttended.registrationNumber.$error"
              :disable="true"
            />
            <q-datetime-picker
              v-model="editedAttended.birthDate"
              label="Data Nascimento"
              :error="$v.editedAttended.birthDate.$error"
              auto-update-value
              lang="pt-BR">
            </q-datetime-picker>
            <q-datetime-picker
              v-model="editedAttended.registrationDate"
              :error="$v.editedAttended.registrationDate.$error"
              label="Data Matrícula"
              auto-update-value
              lang="pt-BR">
            </q-datetime-picker>
            <q-field label="Sexo" borderless>
              <q-option-group
                class="q-pt-sm"
                v-model="editedAttended.gender"
                :options="genderOptions"
                inline
              />
            </q-field>
            <div class="row justify-between">
              <div class="q-pr-sm col-6">
                <q-input
                  type="tel"
                  mask="(##)####-####"
                  v-model="editedAttended.contact.telephoneNumber"
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
                  v-model="editedAttended.contact.mobileNumber"
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
              v-model="editedAttended.contact.email"
              label="E-mail"
              :error="$v.editedAttended.contact.email.$error"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
            <div class="q-gutter-md">
              <q-input
                v-model="editedAttended.tutor.name"
                label="Nome do Responsável"
              >
              </q-input>
              <q-select v-model="editedAttended.tutor.tutorType" :options="tutorTypeOptions" label="Grau de Parentesco do Responsável" />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" size="12px" v-close-popup />
            <q-btn label="Editar" color="orange" size="12px" icon-right="send" @click="putAttended()" />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
    <q-dialog v-model="modalConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="notification_important" color="primary" text-color="white" />
          <span class="q-ml-sm" v-if="this.selected.length > 1">Tem certeza que deseja excluir os atendidos?</span>
          <span class="q-ml-sm" v-if="this.selected.length === 1">Tem certeza que deseja excluir o atendido?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Não" color="primary" v-close-popup />
          <q-btn label="Sim" color="primary" @click="deleteAttendeds()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { required, integer, maxLength, email } from 'vuelidate/lib/validators'
export default {
  name: 'AtendidosPage',
  data () {
    return {
      attended: {
        name: undefined,
        registrationNumber: null,
        birthDate: undefined,
        registrationDate: undefined,
        gender: undefined,
        contact: {
          telephoneNumber: undefined,
          mobileNumber: undefined,
          email: undefined
        },
        tutor: {
          name: undefined,
          tutorType: undefined
        }
      },
      editedAttended: {
        id: undefined,
        name: undefined,
        registrationNumber: null,
        birthDate: undefined,
        registrationDate: undefined,
        gender: undefined,
        contact: {
          telephoneNumber: undefined,
          mobileNumber: undefined,
          email: undefined
        },
        tutor: {
          name: undefined,
          tutorType: undefined
        }
      },
      genderOptions: [
        { label: 'Masculino', value: 'male', color: 'light-blue' },
        { label: 'Feminino', value: 'female', color: 'pink-4' }
      ],
      tutorTypeOptions: [
        'Pai', 'Mãe', 'Avô', 'Avó', 'Tio', 'Tia', 'Outro'
      ],
      modalRegister: false,
      modalEdit: false,
      modalConfirm: false,
      filter: '',
      loading: true,
      selection: 'multiple',
      selected: [],
      columns: [
        { name: 'registrationNumber', label: 'Matrícula', field: 'registrationNumber', sortable: true, align: 'left' },
        { name: 'name', label: 'Nome', field: 'name', sortable: true, align: 'left' },
        { name: 'birthDate', label: 'Data de Nascimento', field: 'birthDate', sortable: true, align: 'left' },
        { name: 'registrationDate', label: 'Data de Matrícula', field: 'registrationDate', sortable: true, align: 'left' },
        { name: 'gender', label: 'Sexo', field: 'gender', sortable: true, align: 'left' },
        { name: 'edit', label: 'Editar', field: 'edit', sortable: true, align: 'left' },
        { name: 'report', label: 'Relatório', field: 'report', sortable: true, align: 'left' }
      ],
      attendeds: []
    }
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
    },
    editedAttended: {
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
  created () {
    this.interceptor()
  },
  mounted () {
    this.getAttendeds()
  },
  methods: {
    getAttendeds () {
      this.loading = true
      this.$axios
        .get('https://localhost:5001/api/attendeds')
        .then((response) => {
          this.attendeds = response.data
          let count = 0
          this.attendeds.forEach(element => {
            this.attendeds[count].birthDate = moment(this.attendeds[count].birthDate).format('DD/MM/YYYY')
            this.attendeds[count].registrationDate = moment(this.attendeds[count].registrationDate).format('DD/MM/YYYY')
            this.attendeds[count].gender = this.attendeds[count].gender === 0 ? 'Masculino' : 'Feminino'
            count++
          })
          this.loading = false
        })
        .catch((err) => {
          this.$q.notify({
            color: 'red',
            icon: 'error',
            message: 'DADOS NÃO CARREGADOS'
          })
          this.loading = false
          throw new Error(err)
        })
    },
    getAttendedsBySearch ({ filter }) {
      this.loading = true
      if (this.filter === '') {
        this.getAttendeds()
      } else {
        this.$axios
          .get('https://localhost:5001/api/attendeds/search', { params: { search: filter = this.filter } })
          .then((response) => {
            this.attendeds = response.data
            let count = 0
            this.attendeds.forEach(element => {
              this.attendeds[count].birthDate = moment(this.attendeds[count].birthDate).format('DD/MM/YYYY')
              this.attendeds[count].registrationDate = moment(this.attendeds[count].registrationDate).format('DD/MM/YYYY')
              this.attendeds[count].gender = this.attendeds[count].gender === 0 ? 'Masculino' : 'Feminino'
              count++
            })
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            throw new Error(err)
          })
      }
    },
    postAttended () {
      this.$v.attended.$touch()
      if (!this.$v.attended.$error) {
        this.$q.loading.show({
          delay: 200,
          spinner: 'QSpinnerPie'
        })
        this.closeModalRegister()
        this.attended.tutor.tutorType = this.attended.tutor.tutorType === undefined ? 'other' : this.tutorTypeStrToEnum(this.attended.tutor.tutorType)
        this.$axios
          .post('https://localhost:5001/api/attendeds', this.attended)
          .then((response) => {
            this.$q.notify({
              color: 'green',
              icon: 'done',
              message: 'CADASTRADO COM SUCESSO!'
            })
            this.$q.loading.hide()
            this.resetModalRegister()
            this.getAttendeds()
          })
          .catch((err) => {
            this.$q.loading.hide()
            if (err.response.status === 409) {
              this.$q.notify({
                color: 'orange',
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
          color: 'orange',
          icon: 'warning',
          message: 'PREENCHA OS CAMPOS CORRETAMENTE'
        })
      }
    },
    putAttended () {
      this.$v.editedAttended.$touch()
      if (!this.$v.editedAttended.$error) {
        this.$q.loading.show({
          delay: 200,
          spinner: 'QSpinnerPie'
        })
        this.closeModalEdit()
        this.editedAttended.tutor.tutorType = this.editedAttended.tutor.tutorType === undefined ? 'other' : this.tutorTypeStrToEnum(this.editedAttended.tutor.tutorType)
        this.$axios
          .put('https://localhost:5001/api/attendeds/' + this.editedAttended.id + '/', this.editedAttended)
          .then((response) => {
            this.$q.notify({
              color: 'green',
              icon: 'done',
              message: 'EDITADO COM SUCESSO!'
            })
            this.$q.loading.hide()
            this.getAttendeds()
          })
          .catch((err) => {
            this.$q.loading.hide()
            throw new Error(err)
          })
      } else {
        this.$q.loading.hide()
        this.$q.notify({
          color: 'orange',
          icon: 'warning',
          message: 'PREENCHA OS CAMPOS CORRETAMENTE'
        })
      }
    },
    deleteConfirm () {
      if (this.selected.length < 1) {
        this.$q.notify({
          color: 'orange',
          icon: 'warning',
          message: 'NENHUMA LINHA SELECIONADA'
        })
      } else {
        this.modalConfirm = true
      }
    },
    deleteAttendeds () {
      this.selected.forEach(element => {
        this.$axios
          .delete('https://localhost:5001/api/attendeds/' + element.id + '/')
          .then((response) => {
            this.$q.notify({
              timeout: 4000,
              color: 'green',
              icon: 'done',
              message: 'ATENDIDO DE MATRÍCULA ' + element.registrationNumber + ' DELETADO COM SUCESSO!'
            })
            this.getAttendeds()
            this.selected = []
          })
          .catch((err) => {
            throw new Error(err)
          })
      })
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
    openModalRegister () {
      this.modalRegister = true
    },
    closeModalRegister () {
      this.modalRegister = false
    },
    openModalEdit (row) {
      this.editedAttended.id = row.id
      this.editedAttended.name = row.name
      this.editedAttended.registrationNumber = row.registrationNumber
      this.editedAttended.birthDate = moment(row.birthDate, 'DD/MM/YYYY').format('MM-DD-YYYY')
      this.editedAttended.registrationDate = moment(row.registrationDate, 'DD/MM/YYYY').format('MM-DD-YYYY')
      this.editedAttended.gender = row.gender === 'Masculino' ? 'male' : 'female'
      this.editedAttended.contact.telephoneNumber = row.contact.telephoneNumber
      this.editedAttended.contact.mobileNumber = row.contact.mobileNumber
      this.editedAttended.contact.email = row.contact.email
      this.editedAttended.tutor.name = row.tutor.name
      this.editedAttended.tutor.tutorType = this.tutorTypeEnumToStr(row.tutor.tutorType)
      this.modalEdit = true
    },
    closeModalEdit () {
      this.modalEdit = false
    },
    selectedRowsLabel (numberOfRows) {
      return numberOfRows > 1 ? numberOfRows + ' linhas selecionadas' : numberOfRows + 'linha selecionada'
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
    tutorTypeStrToEnum (tutorType) {
      switch (tutorType) {
        case 'Pai':
          return 'father'
        case 'Mãe':
          return 'mother'
        case 'Avô':
          return 'grandfather'
        case 'Avó':
          return 'grandmother'
        case 'Tio':
          return 'uncle'
        case 'Tia':
          return 'aunt'
        case 'Outro':
          return 'other'
      }
    },
    interceptor () {
      // Add a request interceptor
      this.$axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        config.headers['Authorization'] = 'Bearer ' + token
        config.headers['X-Requested-With'] = 'XMLHttpRequest'
        config.headers['Expires'] = '-1'
        config.headers['Cache-Control'] = 'no-cache,no-store,must-revalidate,max-age=-1,private'
        // Do something before request is sent
        this.loading = true
        return config
      }, (error) => {
        this.loading = false
        // Do something with request error
        return Promise.reject(error)
      })
      // Add a response interceptor
      this.$axios.interceptors.response.use((response) => {
        // Do something with response data
        return response
      }, (error) => {
        // Do something with response error
        this.loading = false
        return Promise.reject(error)
      })
    }
  }
}
</script>
