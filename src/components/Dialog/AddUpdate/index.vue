<template>
  <v-dialog v-model="show" max-width="500">
    <v-card>
      <v-card-title class="font-weight-bold black lighten-2">
        {{filter.toUpperCase()}} TO PHONEBOOK
      </v-card-title>
      <v-card-text class="">
        <v-text-field label="First Name" outlined v-model.trim="dataContacts.f_name" ></v-text-field>
        <v-text-field label="Last Name" outlined v-model.trim="dataContacts.l_name" ></v-text-field>
        <v-text-field label="Phone Number" outlined v-model.trim="dataContacts.p_number" ></v-text-field>
        <v-switch
          v-model="dataContacts.fave"
          label="Set as Favorite"
        ></v-switch>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn class="ma-2" color="primary" @click="onSave()">Save</v-btn>
        <v-btn class="ma-2" color="primary" @click="show=false">Close</v-btn>
      </v-card-actions>
    </v-card>
    <notification :show.sync="notification.show" :type="notification.type" :text="notification.text"/>
  </v-dialog>
</template>

<script>
import Notification, {TYPE_WARN, TYPE_SUCCESS} from "@/components/Dialog/Notification";
import { mapGetters, mapActions} from "vuex";
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import moment from 'moment'
export default {
  props: ['visible','passContact','filter'],
  data() {
    return {
      dataContacts: {},
      dataPhonebook: this.$store.state.PhoneBook,
      notification: {
        show: false,
        type: '',
        text: ''
      },
    }
  },
  components: {
    Notification
  },
  methods: {
    ...mapActions(['addToPhonebook', 'updateToPhonebook']),
    showSuccessMessage(text) {
      this.notification.show = true;
      this.notification.type = TYPE_SUCCESS;
      this.notification.text = text;
    },
    showWarnMessage(text) {
      this.notification.show = true;
      this.notification.type = TYPE_WARN;
      this.notification.text = text;
    },
    getDate() {
      let dateis = new Date()
      return moment(dateis).format('MM/DD/YYYY');
    },
    onSave() {
      //on save when user came from ADD btn
      if(this.filter === 'add') {
      let newID = this.getHighestID + 1
        let newData = {
          id: newID,
          fave: this.dataContacts.fave === undefined ? this.dataContacts.fave = false : this.dataContacts.fave,
          f_name: this.dataContacts.f_name === undefined ? this.dataContacts.f_name = '' : this.dataContacts.f_name.charAt(0).toUpperCase() + this.dataContacts.f_name.slice(1),
          l_name: this.dataContacts.l_name === undefined ? this.dataContacts.l_name = '' : this.dataContacts.l_name.charAt(0).toUpperCase() + this.dataContacts.l_name.slice(1),
          p_number: this.dataContacts.p_number,
          createdTime: this.getDate()
        }
        if (!this.validation(newData)) return
        this.addToPhonebook(newData)
        this.dataContacts = {}
        this.showSuccessMessage('Success Adding')
      }else {
        //on save when user came from EDIT btn
        let updateData = {
          id: this.dataContacts.id,
          fave: this.dataContacts.fave,
          f_name: this.dataContacts.f_name.charAt(0).toUpperCase() + this.dataContacts.f_name.slice(1),
          l_name: this.dataContacts.l_name.charAt(0).toUpperCase() + this.dataContacts.l_name.slice(1),
          p_number: this.dataContacts.p_number,
          createdTime: this.getDate()
        }
        if (!this.validation(updateData)) return
        this.updateToPhonebook(updateData)
        this.showSuccessMessage('Success Updating')
      }
      
    },
    validation(data) {      
      if(data.f_name === '' || data.f_name === undefined) {
        this.showWarnMessage('Please Input First Name')
        return false
      }
      if(data.l_name === '' || data.l_name === undefined) {
        this.showWarnMessage('Please Input Last Name')
        return false
      }
      if(data.p_number === '' || data.p_number === undefined) {
        this.showWarnMessage('Please Input Number')
        return false
      }
      if(isNaN(data.p_number)) {
        this.showWarnMessage('Please Input Number Only \n On Phone Number')
        return false
      }
      //Phone number Verification

      const phoneUtil = PhoneNumberUtil.getInstance();
      const number = phoneUtil.parseAndKeepRawInput(data.p_number, 'US')
      if(phoneUtil.isValidNumber(number) === false) {
        this.showWarnMessage('Please Input Correct Number Format(E164) \n Sample Format 2024561414')
        return false
      } else {
        data.p_number = phoneUtil.format(number, PhoneNumberFormat.E164)
        //check duplicated phone number
        let duplicates = this.dataPhonebook.some(obj => obj.p_number === data.p_number)
        if(duplicates && this.filter == 'add') {
          this.showWarnMessage('Duplicate Phone Number \n Please input a new number')
          return false
        }

      }
      return true
    },
  },
  computed: {
    ...mapGetters(['getHighestID']),
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  },
  watch: {
    visible: function (value) {
      if(value) {
        if(this.passContact) {
          Object.assign(this.dataContacts, this.passContact);
        }
      }else {
        // clear data when closed or hidden
        this.dataContacts = {}
      }
    }
  }
}
</script>
