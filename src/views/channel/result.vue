<template>
  <div style="width: 802px; text-align:center; margin:0 auto">
    <el-steps :space="250" :active="2" finish-status="success" :center=true>
      <el-step title="录入渠道信息"></el-step>
      <el-step title="选择渠道人员"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-table :show-header=false :data="tableData" border>
      <el-table-column prop="key1" width="200">
      </el-table-column>
      <el-table-column prop="value1" width="200">
      </el-table-column>
      <el-table-column prop="key2" width="200">
      </el-table-column>
      <el-table-column prop="value2" width="200">
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="finish()" style="margin-top: 20px">完 成</el-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    tableData: 'result',
    channel: 'channel'
  }),
  methods: {
    finish () {
      let channelID = this.channel.id
      this.$store.dispatch('synXmpp', {channelID: channelID}).then(
        () => { console.log('完成：渠道自动同步成功！') },
        () => { console.log('完成：渠道自动同步失败！') }
      )
      this.$store.dispatch('resetChannel')
      this.$router.push({ name: 'channelMain' })
    }
  }
}
</script>
