<template>

  <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
           style="width: 400px; margin:50px;">
    <el-form-item label="Type" prop="type">
      <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
    </el-form-item>
    <el-form-item label="Date" prop="starTime">
      <el-date-picker v-model="temp.startTime" type="datetime" placeholder="Please pick a date"/>
    </el-form-item>
    <el-form-item label="Name" prop="name">
      <el-input v-model="temp.name"/>
    </el-form-item>
    <el-form-item label="Status">
      <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
      </el-select>
    </el-form-item>
    <el-form-item label="Note">
      <el-input v-model="temp.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input"/>
    </el-form-item>

    <el-button type="primary" @click="onSubmit">
      确认
    </el-button>
    <el-button @click="onCancel">
      取消
    </el-button>

  </el-form>

</template>

<script>
  import { create } from '@/api/playlist'

  const calendarTypeOptions = [
    { key: 0, display_name: 'type1' },
    { key: 1, display_name: 'type2' },
    { key: 2, display_name: 'type3' }
  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: [0, 1, 2],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          startTime: new Date(),
          name: '',
          note: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: true,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    methods: {
      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'author111'
            console.log('temp-----' + this.temp)
            create(this.temp).then((res) => {
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
          }
        })
      },
      onCancel() {
        this.$router.push('/playlist/list')
      }
    }
  }

</script>

<style scoped>

</style>
