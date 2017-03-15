<template>
  <div>
    <el-steps :space="250" :active="1" finish-status="success" :center=true>
      <el-step title="录入渠道信息"></el-step>
      <el-step title="选择渠道人员"></el-step>
      <el-step title="完成"></el-step>
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
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="userTable" :data="tableData" border style="width: 100%"
      @selection-change="handleSelectionChange">
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
    let that = this
    this.$ajax.get('/admin/user/list/' + this.startNum + '/' + this.pageSize)
      .then(function (response) {
        that.tableData = response.data.list
        that.total = response.data.total
        that.$nextTick(function () {
          that.tableData.forEach(row => {
            if (that.channel.users.has(row.id + '')) {
              this.$refs.userTable.toggleRowSelection(row, true)
            }
          })
        })
      })
      .catch(function (response) {
        console.log(response)
      })

    this.$ajax.get('/admin/org/list')
      .then(function (response) {
        that.orgs = response.data
      })
      .catch(function (response) {
        console.log('获取营业部信息出错')
      })
  },
  data () {
    return {
      tableData: [],
      currentSelection: [],
      startNum: 1,
      pageSize: 10,
      total: 10,
      orgs: [],
      userTypes: [{
        value: '1',
        label: '营销人员'
      }, {
        value: '2',
        label: '投资顾问'
      }, {
        value: '3',
        label: '总部客服'
      }, {
        value: '4',
        label: '柜台专员'
      }, {
        value: '9',
        label: '客服专员'
      }],
      formInline: {
        orgID: null,
        userType: null
      }
    }
  },
  computed: mapGetters({
    channel: 'channel'
  }),
  methods: {
    back () {
      this.$router.go(-1)
    },
    nextStep () {
      let obj = {
        all: this.tableData,
        selected: this.currentSelection
      }
      this.$store.commit('ADD_CHANNEL_USER', obj)
      this.$store.dispatch('addChannel').then(() => { this.$router.push({ path: '/channel/result' }) })
    },
    handleSelectionChange (val) {
      this.currentSelection = val
    },
    handleCurrentChange (val) {
      this.startNum = val
      let obj = {
        all: this.tableData,
        selected: this.currentSelection
      }
      this.$store.commit('ADD_CHANNEL_USER', obj)
      this.onSearch()
    },
    onSearch () {
      let that = this
      this.$ajax.post('/admin/user/list/' + this.startNum + '/' + this.pageSize, this.formInline)
        .then(function (response) {
          that.tableData = response.data.list
          that.total = response.data.total
          that.$nextTick(function () {
            this.tableData.forEach(row => {
              if (that.channel.users.has(row.id + '')) {
                this.$refs.userTable.toggleRowSelection(row, true)
              }
            })
          })
        })
        .catch(function (response) {
          console.log(response)
        })
    }
  }
}
</script>
