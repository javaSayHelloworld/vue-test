<template>
  <div>
    <el-steps :space="250" :active="0" finish-status="success" :center="true">
      <el-step title="录入渠道信息"></el-step>
      <el-step title="选择渠道人员"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-row>
      <el-col :span="10" :offset="6">
        <el-form :model="channel" :rules="rules" ref="channel" label-width="180px" label-position="right">
          <el-form-item label="渠道名称" prop="name" >
            <el-input v-model="channel.name"></el-input>
          </el-form-item>
          <el-form-item label="渠道代码" prop="code" >
            <el-input v-model="channel.code"></el-input>
          </el-form-item>
          <el-form-item label="派单策略" required>
            <el-col :span="12">
              <el-form-item prop="status">
                <el-select v-model="channel.status" placeholder="请选择派单策略">
                  <el-option label="开放策略" value="0"></el-option>
                  <el-option label="半封闭策略" value="1"></el-option>
                  <el-option label="封闭策略" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="timeout">
                <el-input placeholder="渠道超时时间" v-model="channel.timeout" :number="true" ><template slot="append">秒</template></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="推送人数" prop="pushedNum">
            <el-input v-model.number="channel.pushedNum"><template slot="append">人/轮</template></el-input>
          </el-form-item>
          <el-form-item label="抢单时间" prop="visibleTime" >
            <el-input v-model.number="channel.visibleTime"><template slot="append">秒</template></el-input>
          </el-form-item>
          <el-form-item label="最大会话数" prop="maxSessionNum" >
            <el-input v-model.number="channel.maxSessionNum"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row >
      <el-col :span="4" :offset="8">
        <el-button type="primary" @click="nextStep()">下一步</el-button>
      </el-col>
      <el-col :span="4">
        <router-link to="/" tag="el-button">返 回</router-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        rules: {
          name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
          code: [{ required: true, message: '请输入渠道代码', trigger: 'blur' }],
          status: [{ required: true, message: '请选择派单策略', trigger: 'blur' }],
          pushedNum: [{ required: true, type: 'integer', message: '请输入整数', trigger: 'blur' }],
          timeout: [{ required: true, type: 'integer', message: '请输入整数', trigger: 'blur' }],
          visibleTime: [{ required: true, type: 'integer', message: '请输入整数', trigger: 'blur' }],
          maxSessionNum: [{ required: true, type: 'integer', message: '请输入整数', trigger: 'blur' }]
        }
      }
    },
    computed: mapGetters({
      channel: 'channel'
    }),
    methods: {
      nextStep () {
        let obj = this.channel
        this.$store.commit('SET_CHANNEL', {channel: obj})
        this.$router.push({ path: '/channel/user' })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.post('/admin/channel/save', this.channel)
              .then(function (response) {
                console.log('创建成功！')
              })
              .catch(function (response) {
                console.log('获取营业部信息出错')
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
