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
          @click="addItem"
          icon="add"
        />
      </q-toolbar>
      </div>
    </q-header>

    <q-drawer
      v-model="DrawerOpen"
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
    <edit-phone :item = "editedItem"></edit-phone>
    </q-drawer>

    <q-page-container>
   <!--   <router-view /> -->
    <my-table
    :columns="columns"
    :data="Phones"
    ></my-table>
    </q-page-container>
  </q-layout>
</template>

<script>
import EditPhone from 'components/EditPhone.vue'
import MyTable from 'components/MyTable'
import {
  ALL_PHONES_QUERY,
  ADD_PHONE_MUTATION
  // DELETE_PHONE_MUTATION,
  // UPDATE_PHONE_MUTATION
} from 'src/queries'
import bus from '../event-bus'
export default {
  name: 'MainLayout',
  components: { EditPhone, MyTable },
  data () {
    return {
      DrawerOpen: false,
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
        // описания заголовков столбцов
        {
          name: 'phone', // поле в базе
          required: true, // обязательное
          label: 'Телефон', // название в интерфейсе
          align: 'left', // выравнивание
          field: row => row.phone, // пример вывода из поля таблицы
          format: val => `${val}`, // пример форматирования значения
          sortable: true // сортировка
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
    addItem () {
      this.editedItem = this.defaultItem
      this.DrawerOpen = true
    },
    editRecord (row) {
      this.editedItem = row
      this.DrawerOpen = true
    },
    btnSave () {
      const input = {
        input: this.editedItem
      }

      this.$apollo
        .mutate({
          mutation: ADD_PHONE_MUTATION,
          variables: input,
          refetchQueries: [
            {
              query: ALL_PHONES_QUERY
            }
          ]
        })
        .catch(error => {
          this.$q.notify({
            message: error.message,
            color: 'negative',
            icon: 'error'
          })
          return false
        })

      this.DrawerOpen = false
      const message = this.editedItem.id === ''
        ? 'Запись добавлена'
        : 'Запись изменена'
      this.editedItem = this.defaultItem
      this.$q.notify({
        message,
        color: 'positive',
        icon: 'done'
      })
    }
  },
  mounted () {
    // close dialog pressing 'esc'
    document.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        this.DrawerOpen = false
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
        ? 'Добавить телефон'
        : 'Исправить телефон'
    }
  },
  created () {
    bus.$on('editRecord', this.editRecord)
  }
}
</script>
