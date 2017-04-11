<template>
  <div>
    <el-steps :space="250" :active="0" finish-status="success" :center="true">
      <el-step v-for='(title, index) in titles' :key='index' :title="title"></el-step>
    </el-steps>
    <el-row>
      <el-col :span="10" :offset="6">
        <el-form :model="channel" :rules="rules" ref="channel" label-width="180px" label-position="right">
          <el-form-item label="渠道名称" prop="name">
            <el-input v-model.trim="channel.name"></el-input>
          </el-form-item>
          <el-form-item label="渠道代码" prop="code">
            <el-input v-model.trim="channel.code"></el-input>
          </el-form-item>
          <el-form-item label="派单策略">
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
                <el-input :disabled="openStrategy" placeholder="渠道超时时间" v-model.number="channel.timeout" ><template slot="append">秒</template></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="推送人数" prop="pushedNum">
            <el-input :disabled="openStrategy" v-model.number="channel.pushedNum"><template slot="append">人/轮</template></el-input>
          </el-form-item>
          <el-form-item label="抢单时间" prop="visibleTime">
            <el-input :disabled="openStrategy" v-model.number="channel.visibleTime"><template slot="append">秒</template></el-input>
          </el-form-item>
          <el-form-item label="最大会话数" prop="maxSessionNum">
            <el-input :disabled="openStrategy" v-model.number="channel.maxSessionNum"></el-input>
          </el-form-item>
          <el-form-item label="自动加入">
            <el-col :span="15">
              <el-select :disabled="openStrategy" v-model="channel.autoJoinByOrg" filterable placeholder="按所属营业部" clearable>
                <el-option v-for="item in orgs" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="9">
              <el-select :disabled="openStrategy" v-model="channel.autoJoinByUserType" filterable placeholder="按岗位" clearable>
                <el-option v-for="item in userTypes" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item v-show="openStrategy" style="font-family: Microsoft YaHei">
            * 默认全部客服人员
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row >
      <el-col :span="3" :offset="9">
        <el-button type="primary" @click="nextStep('channel')">下一步</el-button>
      </el-col>
      <el-col :span="3">
        <router-link to="/" tag="el-button">返  回</router-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    created () {
      this.$store.dispatch('getAllOrgs')
    },
    data () {
      var checkCode = (rule, code, callback) => {
        this.$store.dispatch('checkChannelCode', { code }).then(
          (result) => {
            if (result === false) {
              callback(new Error('渠道代码已存在'))
            } else {
              callback()
            }
          }
        )
      }
      let integerNum = { type: 'integer', required: true, message: '请输入整数', trigger: 'blur' }
      return {
        hello: 'hello!',
        rules: {
          name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
          code: [
            { required: true, pattern: /^[a-z]+$/, message: '请输入英文字符', trigger: 'blur' },
            { validator: checkCode, trigger: 'blur' }
          ],
          status: [{ required: true, message: '请选择派单策略', trigger: 'blur' }],
          pushedNum: [integerNum],
          timeout: [integerNum],
          visibleTime: [integerNum],
          maxSessionNum: [integerNum]
        }
      }
    },
    computed: {
      ...mapGetters([
        'channel',
        'orgs',
        'userTypes',
        'titles'
      ]),
      openStrategy: function () {
        return this.channel.status === '0'
      }
    },
    methods: {
      nextStep (formName) {
        let vm = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            vm.$confirm('确定提交?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 确定添加渠道
              let obj = vm.channel
              vm.$store.commit('SET_CHANNEL', {channel: obj})
              vm.$store.dispatch('saveChannel').then(() => {
                if (vm.openStrategy) {  //  开放策略,跳转结果页面
                  vm.$router.push({ name: 'channelResult' })
                } else {          // 非开放策略，跳转选人页面
                  vm.$router.push({ name: 'channelSecond' })
                }
              }).catch(() => {
                vm.$message.error('新增渠道出错')
              })
            }).catch(
              () => { this.$message.warning('取消操作') }
            )
            // let obj = this.channel
            // this.$store.commit('SET_CHANNEL', {channel: obj})
            // if (this.openStrategy) {  //  开放策略，直接提交
            //   this.$store.dispatch('saveChannel').then(
            //   () => { this.$router.push({ name: 'channelResult' }) },
            //   () => { this.$message.error('新增渠道出错') })
            // } else {  // 非开放策略进入选人
            //   this.$router.push({ name: 'channelSecond' })
            // }
          }
        })
      }
    }
  }
</script>
