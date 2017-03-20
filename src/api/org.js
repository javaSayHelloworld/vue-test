import axios from 'axios'

export default {
  getOrgs () {
    return axios.get('/admin/org/list')
  }
}
