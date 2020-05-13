<template>
  <div>
    <el-form ref="form" :model="playlist" label-width="80px">
      <el-form-item label="广告名称">
        <el-input v-model="playlist.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="playlist.note"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchById, update } from '@/api/playlist'
export default {
  data() {
    return {
      playlist: {}
    }
  },
  created() {
    console.log('$route.params.id======= '+this.$route.params.id)
    fetchById(this.$route.params.id).then((res) => {
      this.playlist = res.data
    })
  },
  methods: {
    onSubmit() {
      update(this.$route.params.id,this.playlist).then((res) => {
        if(res.code === 200) {
          this.$message({
            message: '更新成功！',
            type: 'success'
          })
        }else {
          this.$message.error('更新失败！')
        }
        this.$router.push('/playlist/list')
      })
    },
    onCancel(){
      this.$router.push('/playlist/list')
    }
  }
}
</script>

<style lang='stylus' scoped>

</style>
