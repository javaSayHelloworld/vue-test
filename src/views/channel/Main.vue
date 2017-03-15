<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>参数设置</el-breadcrumb-item>
      <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>渠道管理</h3>
    <div class="el-row is-align-middle el-row--flex" style="padding:20px 0;">
      <button type="button" class="el-button el-button-danger is-plain" @click='handleAdd'> 新增</button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="right" inline class="demo-table-expand">
            <el-form-item label="渠道超时时间：">
              <span>{{ props.row.timeout }}秒</span>
            </el-form-item>
            <el-form-item label="推送人数：">
              <span>{{ props.row.pushedNum }}人/轮</span>
            </el-form-item>
            <el-form-item label="抢单时间：">
              <span>{{ props.row.visibleTime }}秒</span>
            </el-form-item>
            <el-form-item label="最大会话数：">
              <span>{{ props.row.maxSessionNum }}</span>
            </el-form-item>
            <el-form-item label="按营业部自动加入：">
              <span>{{ props.row.orgName }}</span>
            </el-form-item>
            <el-form-item label="按岗位自动加入：">
              <span>{{ props.row.autoJoinByUserType | formatUserType }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="code"
        label="代码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="180"
        :formatter="formatStatus">
      </el-table-column>
      <el-table-column
        prop="users.length"
        label="渠道人数"
        width="180">
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="180">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="small"
            @click="handleManage(scope.$index, scope.row)">管理渠道人员</el-button>
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<style>
  .demo-table-expand {
    font-size: 0;
    width: 800px;
    text-align: center;
    margin:0 auto
  }
  .demo-table-expand label {
    width: 150px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 45%;
  }
</style>
<script>
  import { mapGetters } from 'vuex'

  export default {
    beforeMount () {
      this.$store.dispatch('getAllChannels').then(() => { },
       () => { this.$message.error('渠道数据加载失败！') })
    },
    computed: mapGetters({
      tableData: 'allChannels',
      statusArr: 'statusArr',
      userTypes: 'userTypes'
    }),
    filters: {
      formatUserType: function (value) {
        let userTypes = [{ value: '1', label: '营销人员' }, { value: '2', label: '投资顾问' }, {
          value: '3', label: '总部客服' }, { value: '4', label: '柜台专员' }, { value: '9', label: '客服专员' }]
        if (value === null) return ''
        else return userTypes.find((n) => n.value === value).label
      }
    },
    methods: {
      formatStatus (row, column) {
        return this.statusArr[row.status]
      },
      handleAdd () {
        this.$router.push({ path: '/channel/add' })
      },
      handleManage (index, row) {
        this.$store.commit('SET_CHANNEL', {channel: row})
        this.$router.push({ path: '/channel/user' })
      },
      handleEdit (index, row) {
        this.$store.commit('SET_CHANNEL', {channel: row})
        this.$router.push({ path: '/channel/add' })
      },
      handleDelete (index, row) {
        this.$confirm('是否删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('removeChannel', {index, row}).then(() => {
            this.$message({ type: 'success', message: '删除成功!' })
          }, () => {
            this.$message({ type: 'error', message: '删除出错!' })
          })
        })
      }
    }
  }
</script>
