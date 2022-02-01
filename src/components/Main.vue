<template>
  <v-container class="darkgrey">
    <v-row no-gutters justify="space-around">
      <v-col>
        <v-btn block color="secondary" large @click="onClick('favorite')"
          >Favorite</v-btn
        >
      </v-col>
      <v-col>
        <v-btn block color="secondary" large @click="onClick('default')"
          >Default</v-btn
        >
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-col>
        <v-btn block color="secondary" large @click="onClick('add')"
          >Add</v-btn
        >
      </v-col>
      <v-col>
        <v-text-field block
          label="Search"
          solo
          v-model.trim="search"
          @input="onSearch()"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedSearch"
          :items="searchKeys"
          value="value"
          text="text"
          hide-details
          dense
          flat
          placeholder="Please Select"
          @change="onSelected(selectedSearch)"
        >
        </v-select>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <PhoneTable :sortedData="temporaryData" :filter="frmWhtBtn" />
      <DialogBox
        :filter="frmWhtBtn"
        :visible="showDialogBox"
        @close="showDialogBox=false"
      />
    </v-row>
  </v-container>
</template>


<script>
import PhoneTable from '@/components/Tables/Phonebook.vue'
import DialogBox from '@/components/Dialog/AddUpdate'

export default {
  name: 'Main',
  data () {
    return {
      showDialogBox: false,
      frmWhtBtn: '',
      temporaryData: null,
      dataPhonebook: this.$store.state.PhoneBook,
      search: '',
      selectedSearch: null,
      searchKeys: [
          { text: 'First Name', value: 'f_name' },
          { text: 'Last Name', value: 'l_name' },
          { text: 'Phone Number', value: 'p_number' }
      ],
      
    }
  },
  components: {
    PhoneTable,
    DialogBox
  },
  methods: {
   onSelected(value) {
    this.selectedSearch = value
   },
   onSearch() {
     this.temporaryData = this.dataPhonebook.filter(obj => obj[this.selectedSearch].toLowerCase().includes(this.search.toLowerCase()))
   },
   onClick(content) {
     this.frmWhtBtn = content
      if(content === 'add') {
        this.showDialogBox=true
      }
      if(content === 'default'){
        this.temporaryData = null
        this.search = ''
      }
     }
   }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  max-width: 700px;
}
</style>
