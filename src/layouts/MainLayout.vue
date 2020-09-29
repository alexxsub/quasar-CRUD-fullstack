<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <div class="row no-wrap shadow-1">
      <q-toolbar text-white  class="col-8">
        <q-toolbar-title>
          {{$t('title')}}
        </q-toolbar-title>
       <q-select
        dark
        v-model="lang"
        map-options
        :options="langs"
        />lang
       <q-input
       dark
       dense
       standout
       debounce="500"
       :placeholder="$t('search')"
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
      :label="$t('save')"
      icon="save"
      class="q-mr-sm text-white"
      @click="btnSave"/>
    </q-toolbar>
    <edit-phone @edited="onEdited"></edit-phone>
    </q-drawer>

    <q-page-container>
   <!--   <router-view /> -->
    <my-table
    :columns="i18ncolumns"
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
  DELETE_PHONE,
  PHONE_ADDED_SUBSCRIPTION,
  PHONE_DELETED_SUBSCRIPTION,
  PHONE_UPDATED_SUBSCRIPTION
} from 'src/queries'
import bus from '../event-bus'
export default {
  name: 'MainLayout',
  components: { EditPhone, MyTable },
  data () {
    return {
      drawerOpen: false,
      search: '',
      lang: this.$i18n.locale,
      langs: [
        {
          label: 'Русский',
          value: 'ru'
        },
        {
          label: 'English',
          value: 'en-us'
        },
        {
          label: 'Français',
          value: 'fr'
        },
        {
          label: 'Deutsche',
          value: 'de'
        }
      ],
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
      }
    }
  },
  watch: {
    drawerOpen (val) {
      if (!val) this.resetEditedItem()
    },
    lang (lang) {
      this.$i18n.locale = lang.value
      import('quasar/lang/' + lang.value).then(language => {
        this.$q.lang.set(language.default)
      })
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
    editRecord (row) {
      this.editedItem = Object.assign({}, row)
      this.drawerOpen = true
    },
    deleteRecord (id) {
      this.$q.dialog({
        title: this.$t('warning'),
        message: this.$t('deleterecord'),
        focus: 'cancel',
        ok: this.$t('yes'),
        cancel: this.$t('no')
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
              message: this.$t('recorddeleted'),
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
            ? this.$t('recordadded')
            : this.$t('recordupdated')
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
      }
    })
  },
  apollo: {
    Phones: {
      query: ALL_PHONES_QUERY,
      subscribeToMore: [{
        document: PHONE_ADDED_SUBSCRIPTION,
        updateQuery: (previousData, { subscriptionData }) => {
          return {
            Phones: [...previousData.Phones, subscriptionData.data.addedPhone]
          }
        }
      },
      {
        document: PHONE_DELETED_SUBSCRIPTION,
        updateQuery: (previousData, { subscriptionData }) => {
          const id = subscriptionData.data.deletedPhone.id
          const index = previousData.Phones.findIndex(el => el.id === id)
          if (index !== -1) {
            previousData.Phones.splice(index, 1)
          }
          return {
            Phones: [...previousData.Phones]
          }
        }
      },
      {
        document: PHONE_UPDATED_SUBSCRIPTION,
        updateQuery: (previousData, { subscriptionData }) => {
          const id = subscriptionData.data.updatedPhone.id
          const res = previousData.Phones.map(el => {
            if (el.id === id) return subscriptionData.data.updatedPhone
          })
          return {
            Phones: [...res]
          }
        }
      }
      ]
    }
  },
  computed: {
    i18ncolumns () {
      // for i18n translate on-fly
      const columns = [
        // description columns
        {
          name: 'phone', // key
          label: this.$t('phone'), // head label of column
          align: 'left',
          field: row => row.phone, // field in DB, simple like <field: 'phone'>
          format: val => `${val}`, // change value
          sortable: true, // sortable
          style: 'width: 40%'
        },
        {
          label: this.$t('name'),
          align: 'left',
          sortable: true,
          field: 'name',
          name: 'name',
          style: 'width: 40%'
        },
        {
          name: 'actions',
          label: '',
          field: 'actions',
          style: 'width: 20%'
        }
      ]
      return columns
    },
    formTitle () {
      return this.editedItem.id === ''
        ? this.$t('addrecord')
        : this.$t('updaterecord')
    }
  },
  created () {
    bus.$on('editRecord', this.editRecord)
    bus.$on('deleteRecord', this.deleteRecord)
  }
}
// https://forum.quasar-framework.org/topic/3996/how-to-use-data-from-apollo-client-as-data-source-of-qtable
</script>
<style>
</style>
