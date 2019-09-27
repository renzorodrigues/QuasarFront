<template>
  <div class="q-pa-md">
    <q-btn color="primary" icon="person_add" label="CADASTRAR" @click="openModalRegister()" />
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
      >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
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
            <q-datetime-picker
              v-model="attended.birthDate"
              label="Data Nascimento"
              auto-update-value lang>
            </q-datetime-picker>
            <q-datetime-picker
              v-model="attended.registrationDate"
              label="Data Matrícula"
              auto-update-value
              lang="pt-BR">
            </q-datetime-picker>
            <q-field label="Sexo" borderless>
              <q-option-group
                class="q-pt-sm"
                v-model="attended.gender"
                :options="genderOptions"
                color="primary"
                inline
              />
            </q-field>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" size="12px" @click="resetModalRegister()" v-close-popup />
            <q-btn label="Gravar" color="primary" size="12px" icon-right="send" @click="postAttended()" />
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
            />
            <q-datetime-picker
              v-model="editedAttended.birthDate"
              label="Data Nascimento"
              auto-update-value lang>
            </q-datetime-picker>
            <q-datetime-picker
              v-model="editedAttended.registrationDate"
              label="Data Matrícula"
              auto-update-value
              lang="pt-BR">
            </q-datetime-picker>
            <q-field label="Sexo" borderless>
              <q-option-group
                class="q-pt-sm"
                v-model="editedAttended.gender"
                :options="genderOptions"
                color="primary"
                inline
              />
            </q-field>
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
import { required, integer, maxLength } from 'vuelidate/lib/validators'
export default {
  name: 'AtendidosPage',
  data () {
    return {
      attended: {
        name: undefined,
        registrationNumber: null,
        birthDate: undefined,
        registrationDate: undefined,
        gender: undefined
      },
      editedAttended: {
        id: undefined,
        name: undefined,
        registrationNumber: null,
        birthDate: undefined,
        registrationDate: undefined,
        gender: undefined
      },
      genderOptions: [
        { label: 'Masculino', value: 'male' },
        { label: 'Feminino', value: 'female' }
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
      registrationNumber: { required, integer, maxLength: maxLength(11) }
    },
    editedAttended: {
      name: { required },
      registrationNumber: { required, integer, maxLength: maxLength(11) }
    }
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
          console.log(err)
          this.$q.notify({
            color: 'amber',
            icon: 'warning',
            message: 'FALHA AO CARREGAR DADOS'
          })
          this.loading = false
          throw new Error(err)
        })
    },
    postAttended () {
      this.$v.attended.$touch()
      if (!this.$v.attended.$error) {
        this.$q.loading.show({
          delay: 200,
          spinner: 'QSpinnerPie'
        })
        this.$axios
          .post('https://localhost:5001/api/attendeds', this.attended)
          .then((response) => {
            this.$q.notify({
              color: 'green',
              icon: 'done',
              message: 'CADASTRADO COM SUCESSO!'
            })
            this.$q.loading.hide()
            this.closeModalRegister()
            this.resetModalRegister()
            this.getAttendeds()
          })
          .catch((err) => {
            throw new Error(err)
          })
      } else {
        this.$q.notify({
          color: 'red',
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
        this.$axios
          .put('https://localhost:5001/api/attendeds/' + this.editedAttended.id + '/', this.editedAttended)
          .then((response) => {
            this.$q.notify({
              color: 'green',
              icon: 'done',
              message: 'EDITADO COM SUCESSO!'
            })
            this.$q.loading.hide()
            this.closeModalEdit()
            this.getAttendeds()
          })
          .catch((err) => {
            throw new Error(err)
          })
      } else {
        this.$q.notify({
          color: 'red',
          icon: 'warning',
          message: 'PREENCHA OS CAMPOS CORRETAMENTE'
        })
      }
    },
    deleteConfirm () {
      if (this.selected.length < 1) {
        this.$q.notify({
          color: 'red',
          icon: 'warning',
          message: 'NENHUMA LINHA SELECIONADA'
        })
      } else {
        this.modalConfirm = true
      }
    },
    deleteAttendeds () {
      this.selected.forEach(element => {
        console.log(element.id)
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
      this.editedAttended.birthDate = row.birthDate
      this.editedAttended.registrationDate = row.registrationDate
      this.editedAttended.gender = row.gender === 'Masculino' ? 'male' : 'female'
      this.modalEdit = true
    },
    closeModalEdit () {
      this.modalEdit = false
    },
    selectedRowsLabel (numberOfRows) {
      return numberOfRows > 1 ? numberOfRows + ' linhas selecionadas' : numberOfRows + 'linha selecionada'
    }
  }
}
</script>
