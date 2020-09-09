<template>
 <div class="q-pa-md" style="max-width: 500px">
<q-form class="q-gutter-md">
              <q-input
                       square
                       clearable
                       v-model="this.item.phone"
                       lazy-rules
                       :rules="[]"
                       label="Телефон">
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
               <q-input
                       square
                       clearable
                       v-model="this.item.name"
                       lazy-rules
                       :rules="[]"
                       label="Имя">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                       square
                       clearable
                       v-model="this.item.address"
                       lazy-rules
                       :rules="[]"
                       type="text"
                       autogrow
                       label="Адрес">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
</q-form>
</div>
</template>

<script>
export default {
  name: 'EditPhone',
  props: {
    item: {
      type: Object,
      default: function () {
        return { phone: '', name: '', address: '' }
      }
    }
  }
}
</script>
