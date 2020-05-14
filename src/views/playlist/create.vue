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

    <el-upload
      class="avatar-uploader"
      action=""
      :http-request="fileUploadRequest"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

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
  import oss from '../../utils/aliOss'
  import DateUtils from '../../utils/DateUtils'

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
    props:['imageName'],
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
        imageUrl: '',
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
          status: 'published',
          pic: ''
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
            this.temp.pic = this.imageUrl
            console.log('temp-----' + this.temp)
            create(this.temp).then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: '更新成功！',
                  type: 'success'
                })
              } else {
                this.$message.error('更新失败！')
              }
              this.$router.push('/playlist/list')

            })
          }
        })
      },
      onCancel() {
        this.$router.push('/playlist/list')
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      async fileUploadRequest(option) {
        oss.ossUploadFile(option).then(res => {
          console.info(res.fileUrl)
          this.imageUrl = 'https://mallmytest.oss-cn-beijing.aliyuncs.com/'+res.fileUrl
          console.info(this.imageUrl)
        }).catch(error => {
          console.info('error----'+error)
        })
      },
    }
  }

</script>

<style scoped>

  .avatar-uploader .el-upload {
    border: 1px dashed #7b7e7b;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
