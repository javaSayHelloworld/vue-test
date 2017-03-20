import axios from 'axios'

export default {
  getUsers (pageNo, pageSize) {
    return axios.get('/admin/user/list/' + pageNo + '/' + pageSize)
  }
}
