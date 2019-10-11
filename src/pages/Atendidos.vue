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
    <modal-dialog-form
      ref="modalAttended"
      @refreshDataTable="getAttendeds()"
      :data="attended"
    />
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
import modalDialogForm from '../components/ModalDialogForm'
export default {
  name: 'AtendidosPage',
  components: {
    'modal-dialog-form': modalDialogForm
  },
  data () {
    return {
      attendeds: [],
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
      modalAttended: false,
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
      ]
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
          console.log(this.attendeds)
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.$q.notify({
            color: 'amber',
            icon: 'warning',
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
            console.log(err)
            this.loading = false
            throw new Error(err)
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
    openModalRegister () {
      this.$refs.modalAttended.showDialog()
    },
    openModalEdit (obj) {
      this.$refs.modalAttended.fillForm(obj)
      this.$refs.modalAttended.showDialog()
    },
    selectedRowsLabel (numberOfRows) {
      return numberOfRows > 1 ? numberOfRows + ' linhas selecionadas' : numberOfRows + 'linha selecionada'
    }
  }
}
</script>
