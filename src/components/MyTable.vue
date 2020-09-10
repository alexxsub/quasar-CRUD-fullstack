<template>
<q-layout view="lhh LpR lff" container style="height: 1080px" class="shadow-1 rounded-borders">
     <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :pagination.sync="pagination"

      :loading="loading"
      no-data-label="Нет данных."
      no-results-label = "Нет результатов для отображения."
    >
    <template v-slot:body="props">
    <q-tr :props="props">
         <q-td key="phone" :props="props">
             <a href="#" @click="editItem(props.row)"> {{ props.row.phone }}</a>
        </q-td>
         <q-td key="name" :props="props">
              {{ props.row.name }}
        </q-td>
         <q-td key="actions" :props="props">
              <q-btn size="sm" color="red" round icon="delete" @click="deleteItem(props.row)"></q-btn>
            </q-td>
         </q-tr>
    </template>

    </q-table>
     <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="md">
      </q-pagination>
     </div>
  </q-layout>
</template>

<script>
import bus from '../event-bus'
export default {
  name: 'MyTable',
  data () {
    return {
      loading: false,
      editedItem: {
        id: '',
        phone: '',
        name: '',
        address: ''
      },
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: 10,
        rowsNumber: 20
      }
    }
  },
  computed: {
    rowsNumber () {
      return this.data.length
    },
    pagesNumber () {
      return Math.ceil(this.data.length / this.pagination.rowsPerPage)
    }
  },
  methods: {
    editItem (row) {
      this.editedItem.id = row.id
      this.editedItem.phone = row.phone
      this.editedItem.name = row.name
      this.editedItem.address = row.address

      bus.$emit('editRecord', this.editedItem)
    },
    deleteItem (row) {
      bus.$emit('deleteRecord', row.id)
    }
  },

  props: {

    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }

  }
}
</script>
