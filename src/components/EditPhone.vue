<template>
 <div class="q-pa-md" style="max-width: 500px">
              <q-input
                       square
                       clearable
                       v-model="editedItem.phone"
                       lazy-rules
                       :rules="[]"
                       @change = "onChange"
                       label="Телефон">
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
               <q-input
                       square
                       clearable
                       v-model="editedItem.name"
                       lazy-rules
                       :rules="[]"
                       @change = "onChange"
                       label="Имя">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                       square
                       clearable
                       v-model="editedItem.address"
                       lazy-rules
                       :rules="[]"
                       @change = "onChange"
                       type="text"
                       autogrow
                       label="Адрес">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

</div>
</template>

<script>
import bus from '../event-bus'
export default {
  name: 'EditPhone',
  data () {
    return {
      editedItem: {
        id: '',
        phone: '',
        name: '',
        address: ''
      }
    }
  },
  methods: {
    onChange () {
      this.$emit('edited', this.editedItem)
    },
    setEditedItem (item) {
      this.editedItem.phone = item.phone
      this.editedItem.name = item.name
      this.editedItem.address = item.address
    }
  },
  created () {
    // fire onClick record of table
    bus.$on('editRecord', this.setEditedItem)
  }
}
</script>
