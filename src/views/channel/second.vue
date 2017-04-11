<template>
  <div>
    <el-steps :space="250" :active="1" finish-status="success" :center=true>
      <el-step v-for='(title, index) in titles' :key='index' :title="title"></el-step>
    </el-steps>

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="formInline.orgID" filterable placeholder="请选择所属营业部" clearable>
          <el-option
            v-for="item in orgs"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.userType" placeholder="请选择服务人员类别" clearable>
          <el-option
            v-for="item in userTypes"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusArr"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="userTable" :data="tableData" border style="width: 100%" @cell-click="toggleSelection"
      @select-all="selectAll">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="name" label="服务人员姓名" width="200">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="所属营业部"
        width="300">
      </el-table-column>
      <el-table-column
        prop="userType"
        label="服务人员类别">
      </el-table-column>
      <el-table-column
        prop="userID"
        label="账号">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="startNum"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="total"
      style="flow:right">
    </el-pagination>

    <el-row style="margin-top:20px;">
      <el-col :span="3" :offset="9">
        <el-button type="primary" @click="back()">上一步</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="nextStep()">下一步</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  beforeMount () {
    let vm = this
    let param = { pageNo: this.startNum, pageSize: this.pageSize }
    this.$store.dispatch('getAllUsers', param).then((response) => {
      vm.afterRequest(response)
    })
    this.$store.dispatch('getAllOrgs')
  },
  data () {
    return {
      tableData: [],
      currentSelection: [],
      initSelected: new Set(),
      initUnselected: new Set(),
      addUsers: new Set(),   // 从 未勾选 -> 勾选 的users,传到后台为add操作
      removeUsers: new Set(), // 从 勾选 -> 未勾选 的users,传到后台为remove操作
      startNum: 1,
      pageSize: 10,
      total: 10,
      formInline: {
        orgID: null,
        userType: null,
        status: null
      },
      statusArr: [{ value: 1, label: '已选择' }, { value: 2, label: '未选择' }]
    }
  },
  computed: {
    ...mapGetters({
      channel: 'channel',
      userTypes: 'userTypes',
      orgs: 'orgs',
      titles: 'titles'
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    clear () {
      this.initSelected.clear()
      this.initUnselected.clear()
      this.addUsers.clear()
      this.removeUsers.clear()
    },
    afterRequest (response) {
      let vm = this
      vm.tableData = response.data.list
      vm.total = response.data.total
      vm.$nextTick(() => {
        vm.tableData.forEach(row => {
          if (vm.channel.users.has(row.id + '')) {
            this.$refs.userTable.toggleRowSelection(row, true)
            this.initSelected.add(row.id)  // 记住表初始的已勾选id
          } else {
            this.initUnselected.add(row.id)  // 记住表初始的未勾选id
          }
        })
      })
    },
    nextStep () {
      let obj = { addUsers: this.addUsers, removeUsers: this.removeUsers }
      this.$store.dispatch('saveUsers', obj)
      .then(() => { this.$router.push({ path: '/channel/result' }) })
      .catch(() => { this.$message.error('保存渠道用户出错') })
    },
    toggleSelection (user, column, cell, event) {
      if (event.srcElement.checked !== undefined) { // 如果点击的是表格选择框
        if (event.srcElement.checked) {  // 选择框：选中
          if (!this.removeUsers.delete(user.id)) this.addUsers.add(user.id)  // 先检查可否回退操作，如无回退就记录
        } else {     // 选择框：没选中
          if (!this.addUsers.delete(user.id)) this.removeUsers.add(user.id)
        }
      }
    },
    selectAll (users) {
      if (users.length === 0) { // 全部未勾选则把初始选择项标记为删除
        this.addUsers.clear()
        this.removeUsers = new Set(this.initSelected)
      } else {                  // 全部勾选则把初始未选择项标记为添加
        this.removeUsers.clear()
        this.addUsers = new Set(this.initUnselected)
      }
    },
    handleCurrentChange (val) {
      // 把当前页的用户选择提交一下服务器
      let vm = this
      let obj = { addUsers: vm.addUsers, removeUsers: vm.removeUsers }
      this.$store.dispatch('saveUsers', obj)
      .then(() => {
        // 翻页操作
        vm.clear()
        vm.startNum = val
        vm.onSearch()
      })
      .catch(() => { this.$message.error('保存渠道用户出错') })
    },
    onSearch () {
      let vm = this
      // this.$ajax.post('/admin/user/list/' + this.startNum + '/' + this.pageSize, this.formInline)
      let param = {pageNo: this.startNum, pageSize: this.pageSize, form: this.formInline}
      this.$store.dispatch('getQualifiedUsers', param)
        .then((response) => {
          vm.afterRequest(response)
        })
        .catch(function (response) {
          console.log(response)
        })
    }
  }
}
</script>
