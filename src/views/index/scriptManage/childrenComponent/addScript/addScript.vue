<!--
 * @Description: 描述
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2020-04-12 14:15:17
 * @LastEditors: 吴文周
 * @LastEditTime: 2020-05-16 14:10:44
 -->
<template>
  <el-dialog
    :visible="proVisible"
    width="60%"
    :title="title"
    :before-close="close"
    v-if="proVisible"
  >
    <el-form
      :model="proForm"
      :rules="proRules"
      ref="proForm"
      label-width="100px"
      label-position="left"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="脚本名称" prop="scriptName">
            <el-input
              v-model="proForm.scriptName"
              placeholder="请输入脚本名称"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="脚本类型" prop="scriptType">
            <el-select
              v-model="proForm.scriptType"
            >
            <el-option value='self' label="自定义脚本"></el-option>
            <el-option value='system' label="脚本模板"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="脚本内容" prop="scriptContent">
        <el-input
          type="textarea"
          :rows="5"
          v-model="proForm.scriptContent"
          placeholder="请输入脚本内容"
        ></el-input>
      </el-form-item>
      <el-row type="flex" justify="end">
        <el-form-item>
          <el-button type="primary" @click="confirm">确认</el-button>
          <el-button type="info" @click="close">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { insertScript, updateScript } from '@/api/scriptApi.js'
export default {
  name: 'addScript',
  props: ['itemObj', 'type'],
  data() {
    return {
      proVisible: false,
      title: '',
      proForm: {
        scriptName: '',
        scriptType:'',
        scriptContent: ''
      },
      proRules: {
        scriptName: [
          { required: true, message: '请输入脚本名称', trigger: 'blur' }
        ],
        scriptType: [
          { required: true, message: '请选择脚本类型', trigger: 'blur' }
        ],
        scriptContent: [
          { required: true, message: '请输入脚本内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show() {
      this.title = this.$props.type == 'modify' ? '修改脚本' : '新增脚本'
      if (this.$props.type == 'modify') {
        this.proForm = this.$props.itemObj
      } else {
        this.proForm = {
          scriptName: '',
          scriptContent: '',
          scriptType:''
        }
      }
      this.proVisible = true
    },
    close() {
      this.$refs.proForm.resetFields()
      this.proVisible = false
    },
    /**
     * @name: confirm
     * @description: 弹窗确认
     * @param {type}: 默认参数
     * @return {type}: 默认类型
     */
    confirm() {
      this.$refs.proForm.validate(valid => {
        if (valid) {
          if (this.$props.type == 'add') {
            insertScript(this.proForm).then(() => {
              this.$message({
                type: 'success',
                message: '新增成功！'
              })
              this.proVisible = false
              this.$emit('getList',this.proForm.scriptType)
            })
          } else {
            updateScript(this.proForm).then(() => {
              this.$message({
                type: 'success',
                message: '修改成功！'
              })
              this.proVisible = false
              this.$emit('getList',this.proForm.scriptType)
            })
          }
        } else {
          return
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog {
  margin-top: 5vh !important;
  margin-bottom: 0;
  background-color: #303641;
  .el-dialog__header {
    border-bottom: 1px solid #4f5467;
    .el-dialog__title {
      color: #ced4da;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
    .el-form-item__label {
      color: #ced4da;
    }
    .el-input__inner {
      background-color: #353c48;
      border: none;
      color: #ced4da;
    }
    .el-textarea__inner {
      background-color: #353c48;
      border: none;
      color: #ced4da;
    }
    .el-radio__inner {
      background-color: #272c36;
      border: 1px #adb5bd solid;
      outline: none;
    }
    .is-checked {
      .el-radio__inner {
        background-color: #fb9678;
        border: 1px solid #fb9678;
      }
      .el-radio__label {
        color: #fb9678;
      }
    }
  }
}
</style>
