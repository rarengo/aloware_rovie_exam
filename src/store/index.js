import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default () => {
  const store = new Vuex.Store({
    modules: {},
    state: {
      PhoneBook: [
        {
          id: 1,
          fave: true,
          f_name: "Rovie",
          l_name: "Arengo",
          p_number: "+12024522222",
          createdTime: "01/25/2022"
        },
        {
          id: 3,
          fave: false,
          f_name: "Tests",
          l_name: "Te",
          p_number: "+12024561414",
          createdTime: "01/22/2022"
        },
        {
          id: 5,
          fave: false,
          f_name: "Test",
          l_name: "Man",
          p_number: "+12024561414",
          createdTime: "01/21/2022"
        },
        {
          id: 2,
          fave: false,
          f_name: "Kamotest",
          l_name: "Uwu",
          p_number: "+12024561414",
          createdTime: "01/30/2022"
        }
      ]
    },
    getters: {
      getPhoneBook: (state) => state.PhoneBook,
      getFavePhoneBook: (state) => {
        return state.PhoneBook.filter( PhoneBook => {
          return PhoneBook.fave === true
        })
      },
      getTotal: (state) => state.PhoneBook.length,
      getHighestID: (state) => {
        let ids = state.PhoneBook.map(obj => {
          return obj.id
        })
        let max = Math.max(...ids)
        return max
      }
    },
    actions: {
      addToPhonebook: ({commit}, data) => commit("ADD_PHONEBOOK", data),
      updateToPhonebook: ({commit}, data) => commit("UPDATE_PHONEBOOK", data),
      deleteToPhonebook:  ({commit}, data) => commit("DELETE_PHONEBOOK", data),
      favoriteToPhonebook:  ({commit}, data) => commit("UPDATE_FAVORITE", data)
    },
    mutations: {
      ADD_PHONEBOOK(state, data) {
        state.PhoneBook.push(data)
      },
      UPDATE_PHONEBOOK(state,data) {
        let objIndex = state.PhoneBook.findIndex((obj => obj.id == data.id))
        state.PhoneBook[objIndex].fave = data.fave
        state.PhoneBook[objIndex].f_name = data.f_name
        state.PhoneBook[objIndex].l_name = data.l_name
        state.PhoneBook[objIndex].p_number = data.p_number
      },
      DELETE_PHONEBOOK(state,data) {
        let objIndex = state.PhoneBook.findIndex((obj => obj.id == data.id))
        state.PhoneBook.splice(objIndex, 1)
      },
      UPDATE_FAVORITE(state,data) {
        let objIndex = state.PhoneBook.findIndex((obj => obj.id == data.id))
        state.PhoneBook[objIndex].fave = data.fave
      }
    },
    plugins: [
      createPersistedState({
        key: "contacts",
        storage: window.localStorage    
      })
    ]
  })
  return store
}