import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import da from 'element-ui/src/locale/lang/da'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      console.log('username:'+username + '    password:'+password)
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        // console.log('token:'+getToken())
        resolve()
      }).catch(error => {
        console.log('error:'+error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {

    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        const { message } = response
        console.log('getInfo success data:' + data)
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { username, icon } = data
        console.log('getInfo success name:' + username)
        console.log('getInfo success avatar:' + icon)
        console.log('getInfo success message:' + message)
        commit('SET_NAME', username)
        commit('SET_AVATAR', icon)
        resolve(data)
      }).catch(error => {
        console.log('getInfo：error')
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

