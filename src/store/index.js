import { createStore } from "vuex"

const store = createStore({
    state: {
        isDarkMode: false,
        isMobile: false,
    },

    mutations: {
        uploadDarkMode(state, { isDarkMode }) {
            state.isDarkMode = isDarkMode
        },
        uploadIsMobile(state, { isMobile }) {
            state.isMobile = isMobile
        }
    },

    actions: {
        switchDarkMode({ commit }, isDarkMode) {
            commit('uploadDarkMode', { isDarkMode })
        },
        switchIsMobile({ commit }, isMobile) {
            commit('uploadIsMobile', { isMobile })
        }
    }

})

export default store