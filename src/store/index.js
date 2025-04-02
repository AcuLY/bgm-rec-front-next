import { createStore } from "vuex"

const store = createStore({
    state: {
        isDarkMode: false,
    },

    mutations: {
        uploadDarkMode(state, { isDarkMode }) {
            state.isDarkMode = isDarkMode
        }
    },

    actions: {
        switchDarkMode({ commit }, isDarkMode) {
            commit('uploadDarkMode', { isDarkMode })
        }
    }
})

export default store