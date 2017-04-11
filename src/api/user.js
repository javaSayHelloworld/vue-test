import axios from 'axios'

export default {
  getUsers ({ pageNo, pageSize }) {
    return axios.get('/admin/user/list/' + pageNo + '/' + pageSize)
  },
  getQualifiedUsers ({pageNo, pageSize, form}) {
    return axios.post('/admin/user/list/' + pageNo + '/' + pageSize, form)
  }
}
