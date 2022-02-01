<template>
  <v-card
    outlined
    elevation="24"
    class="mx-auto my-12"
    max-width="auto"
    color="primary"
  >
    <v-data-table
      :headers="headers"
      :items="getSpecificItem()"
      :items-per-page="5"
      :header-props="{ sortIcon: null }"
      class="elevation-1"
    >
      <template v-slot:item.fave="{ item }">
        <v-btn-toggle>
          <a @click="onFaveBtn(item)">
            <v-icon size="20px" :color='item.fave ? "yellow" : "white"'
              >mdi-star</v-icon
            >
          </a>
        </v-btn-toggle>
      </template>
      <template v-slot:item.handler="{ item }">
        <a @click="onEditBtn(item)">
          <v-icon size="20px" color="green">mdi-pencil</v-icon>
        </a>
        <a @click="onDeleteBtn(item)">
          <v-icon size="20px" color="red">mdi-delete</v-icon>
        </a>
      </template>
    </v-data-table>
    <DialogBox
      :filter="frmWhtBtn"
      :passContact="tempData"
      :visible="showDialogBox"
      @close="showDialogBox=false"
    />
  </v-card>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import DialogBox from '@/components/Dialog/AddUpdate';
import _ from 'lodash';
import moment from 'moment';

  export default {
    props: ['filter', 'sortedData'],
    data () {
      return {
        headers: [
          {
            align: 'center',
          },
          { text: 'Favorites', value: 'fave'},
          { text: 'First Name', value: 'f_name' },
          { text: 'Last Name', value: 'l_name' },
          { text: 'Phone Number', value: 'p_number' },
          { text: 'Created At', value: 'createdTime' },
          { text: 'Action', value: 'handler' },

        ],
        tempData: {},
        showDialogBox: false,
        frmWhtBtn: 'edit'

      }
    },
    components: {
      DialogBox
    },
    computed: {
      ...mapGetters(['getPhoneBook', 'getFavePhoneBook'])
    },
    mounted() {
      
    },
    methods: {
      ...mapActions(['deleteToPhonebook', 'favoriteToPhonebook']),
      onEditBtn(data) {
        this.tempData = data;
        this.showDialogBox = true;
      },
      onDeleteBtn(data) {
        this.deleteToPhonebook(data.id)
      },
      onFaveBtn(data){
        data.fave = data.fave ? false : true
        this.favoriteToPhonebook(data)
        return data.fave
      },
      getSpecificItem() {
        if (this.filter === 'favorite') {
          let data = _.sortBy(this.getFavePhoneBook, function(obj) { return new moment(obj.getFavePhoneBook); }).reverse();
          return data
        }else {
          //sort data from date decending
          if(this.sortedData !== null) {
            let data = _.sortBy(this.sortedData, function(obj) { return new moment(obj.createdTime); }).reverse();
            return data
          } else {
            let data = _.sortBy(this.getPhoneBook, function(obj) { return new moment(obj.createdTime); }).reverse();
            return data
          }
          
        }
      }
    },
    watch: {

    }
  }
</script>