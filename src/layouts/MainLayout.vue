<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <div class="row no-wrap shadow-1">
      <q-toolbar text-white  class="col-8">
        <q-toolbar-title>
          Телефонный справочник
        </q-toolbar-title>

       <q-input
       dark
       dense
       standout
       debounce="500"
        placeholder="Поиск"
        hide-bottom-space
       v-model="search"
       input-class="text-right"
       class="q-ml-md">
          <template v-slot:append>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>
      <q-space />
      </q-toolbar>
      <q-toolbar class="col-4">
        <q-space />
        <q-fab
          padding="xs"
          color="primary"
          v-model = "drawerOpen"
          @click="addItem"
          icon="add"
        />
      </q-toolbar>
      </div>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      :width="500"
      side="right"
      bordered
      overlay
      content-class="bg-grey-1"
    >
     <q-toolbar class="bg-grey-2">
      <q-toolbar-title>{{formTitle}}</q-toolbar-title>
      <q-btn dense
      color="secondary"
      label="Сохранить"
      icon="save"
      class="q-mr-sm text-white"
      @click="btnSave"/>
    </q-toolbar>
    <edit-phone @edited="onEdited"></edit-phone>
    </q-drawer>

    <q-page-container>
   <!--   <router-view /> -->
    <my-table
    :columns="columns"
    :data="Phones"
    :filter="search"
    ></my-table>
    </q-page-container>
  </q-layout>
</template>

<script>
import EditPhone from 'components/EditPhone.vue'
import MyTable from 'components/MyTable'
import {
  ALL_PHONES_QUERY,
  MODIFY_PHONE,
  DELETE_PHONE
} from 'src/queries'
import bus from '../event-bus'
export default {
  name: 'MainLayout',
  components: { EditPhone, MyTable },
  data () {
    return {
      drawerOpen: false,
      search: '',
      editedItem: {
        id: '',
        phone: '',
        name: '',
        address: ''
      },
      defaultItem: {
        id: '',
        phone: '',
        name: '',
        address: ''
      },
      columns: [
        // description columns
        {
          name: 'phone', // key
          label: 'Телефон', // head label of column
          align: 'left',
          field: row => row.phone, // field in DB, simple like <field: 'phone'>
          format: val => `${val}`, // change value
          sortable: true // sortable
        },
        {
          label: 'Имя',
          align: 'left',
          sortable: true,
          field: 'name',
          name: 'name'
        },
        {
          name: 'actions',
          label: '',
          field: 'actions'
        }
      ]
    }
  },

  methods: {
    resetEditedItem () {
      this.editedItem = Object.assign({}, this.defaultItem)
      bus.$emit('resetRecord', this.defaultItem)
    },
    onEdited (item) {
      this.editedItem = Object.assign({}, item)
    },
    addItem () {
      this.resetEditedItem()
    },
    editRecord (row) {
      this.editedItem = Object.assign({}, row)
      this.drawerOpen = true
    },
    deleteRecord (id) {
      this.$q.dialog({
        title: 'Внимание!',
        message: 'Удалить запись?',
        focus: 'cancel',
        ok: 'Да, я уверен',
        cancel: 'Нет, не нужно'
      }).onOk(() => {
        this.$apollo.mutate({
          mutation: DELETE_PHONE,
          variables: {
            id
          },
          refetchQueries: [
            {
              query: ALL_PHONES_QUERY
            }
          ]
        })
          .then(data => {
            this.$q.notify({
              message: 'Запись удалена',
              color: 'positive',
              icon: 'done'

            })
          })
          .catch(error => {
            this.$q.notify({
              message: error.message,
              color: 'negative',
              icon: 'error'
            })
          })
      })
    },
    btnSave () {
      const input = {
        input: this.editedItem
      }
      this.$apollo
        .mutate({
          mutation: MODIFY_PHONE,
          variables: input,
          refetchQueries: [
            {
              query: ALL_PHONES_QUERY
            }
          ]
        })
        .then(data => {
          this.drawerOpen = false
          const message = this.editedItem.id === ''
            ? 'Запись добавлена'
            : 'Запись изменена'
          this.editedItem = this.defaultItem
          this.$q.notify({
            message,
            color: 'positive',
            icon: 'done'

          })
        })
        .catch(error => {
          this.$q.notify({
            message: error.message,
            color: 'negative',
            icon: 'error'
          })
        })
    }
  },
  mounted () {
    // close dialog pressing 'esc'
    document.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        this.drawerOpen = false
        this.resetEditedItem()
      }
    })
  },
  apollo: {
    Phones: {
      query: ALL_PHONES_QUERY
    }
  },
  computed: {
    formTitle () {
      return this.editedItem.id === ''
        ? 'Добавить запись'
        : 'Исправить запись'
    }
  },
  created () {
    bus.$on('editRecord', this.editRecord)
    bus.$on('deleteRecord', this.deleteRecord)
  }
}
</script>
