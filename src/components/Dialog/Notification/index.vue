<template>
  <v-snackbar top outlined multiLine v-model="isShow"
              :color="color" :timeout="Number(timeout)"
              max-width="500" @click.native="tryHide">
    <div class="d-flex">
      <v-icon large class="mr-4" :color="color" v-if="icon">{{ icon }}</v-icon>
      <div class="font-weight-bold content">{{ text }}</div>
    </div>
    <template v-slot:action="{ attrs }" v-if="showCloseBtn">
      <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="hide"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export const TYPE_SUCCESS = 'success';
export const TYPE_ERROR = 'error';
export const TYPE_WARN = 'warn';

export default {
  name: "Notification",
  props: ['text', 'type', 'show'],
  data() {
    return {
      icon: '',
      color: TYPE_SUCCESS,
      timeout: '5000'
    }
  },
  watch: {
    type: function () {
      switch (this.type) {
        case TYPE_SUCCESS:
          this.icon = 'mdi-checkbox-marked-circle-outline';
          this.color = 'success';
          this.timeout = '5000';
          break;
        case TYPE_ERROR:
          this.icon = 'mdi-alert-octagon-outline';
          this.color = 'error';
          this.timeout = '0';
          break;
        case TYPE_WARN:
          this.icon = 'mdi-alert-outline';
          this.color = 'warning';
          this.timeout = '0';
          break;
        default:
          this.icon = '';
          this.color = 'success'
          this.timeout = '5000';
      }
    },
  },
  methods: {
    tryHide() {
      this.type === TYPE_SUCCESS && this.hide();
    },
    hide() {
      this.$emit('update:show', false);
    },
  },
  computed: {
    showCloseBtn() {
      return this.type === TYPE_ERROR || this.type === TYPE_WARN;
    },
    isShow: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit('update:show', value);
      }
    }
  }
}

</script>

<style scoped>
.content {
  font-size: medium;
}
</style>