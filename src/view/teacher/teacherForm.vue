<template>
  <div class="teacher-form">
    <h2 v-show="view">查看教师信息</h2>
    <h2 v-show="updateForm">编辑教师信息</h2>
    <h2 v-show="addForm">新增教师</h2>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="教师工号" prop="tid">
        <el-input type="number" v-model="ruleForm.tid" autocomplete="off" :readonly="view"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input type="text" v-model="ruleForm.name" autocomplete="off" :readonly="view"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input v-if="view" v-model="ruleForm.gender" readonly></el-input>
        <el-select v-else v-model="ruleForm.gender">
          <el-option
            v-for="(option, pos) in ruleOption.gender"
            :key="`${option.value}-${pos}`"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学院" prop="college">
        <el-input v-if="view" v-model="ruleForm.college" readonly></el-input>
        <el-select v-else v-model="ruleForm.college">
          <el-option
            v-for="(option, pos) in ruleOption.college"
            :key="`${option.value}-${pos}`"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="!view">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {addTeacher, updateTeacher} from "@/api/teacherApi";
import {Msg} from "@/tools/message";
import Validator from "@/tools/validator";

export default {
  name: "teacherForm",
  props: {
    teacher: {
      type: Object,
    },
    update: {
      type: Boolean,
      default: false,
    },
    add: {
      type: Boolean,
      default: false,
    },
  },
  inject: ["closeDialogRefreshTable"],
  data() {
    let validateTid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('教师工号不能为空'));
      }
      if (/^[0-9]$/.test(value)) {
        return callback(new Error("教师工号应全为数字"));
      }
      if (!(Validator.validateYYYYmmDD(value.substring(0, 8)) && value.length === 10)) {
        return callback(new Error("教师工号应为10位, 并以日期开头"));
      } else {
        callback();
      }
    }
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'));
      }
      if (!/^[^\x00-\xff]{2,8}$|^[a-zA-Z]+\s?[a-zA-Z]+$/.test(value)) {
        return callback(new Error("请正确输入姓名"));
      } else {
        callback();
      }
    }
    let validateCollege = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('学院不能为空'));
      }
      if (!/^[^\x00-\xff]{2,20}$/.test(value)) {
        return callback(new Error('学院名应为中文'));
      } else {
        callback();
      }
    }
    return {
      updateForm: this.$props.update,
      addForm: this.$props.add,
      ruleForm: {
        tid: this.teacher.tid,
        name: this.teacher.name,
        gender: this.teacher.gender === undefined ? '男' : this.teacher.gender,
        college: this.teacher.college,
      },
      ruleOption: {
        gender: [
          {value: '男', label: "男"},
          {value: '女', label: "女"},
        ],
        college: [
          {value: '03', label: '计算机科学与工程学院',},
          {value: '08', label: '管理学院',},
          {value: '10', label: '药学与生物工程学院',},
          {value: '23', label: '两江人工智能学院',},
        ],
      },
      rules: {
        tid: [
          {validator: validateTid, trigger: 'blur'}
        ],
        name: [
          {validator: validateName, trigger: ['blur', 'change']}
        ],
        college: [
          // {validator: validateCollege, trigger: ['blur', 'change']}
        ],
      }
    };
  },
  computed: {
    view() {
      return !this.updateForm && !this.addForm;
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          if (this.update && !this.add) {
            updateTeacher(this.ruleForm).then(res => {
              this.processData(res);
            }).catch(err => Msg.error(err));
          } else {
            addTeacher(this.ruleForm).then(res => {
              this.processData(res);
            }).catch(err => Msg.error(err));
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    processData(res) {
      if (res.status === 200) {
        Msg.success(res.message);
      } else if (res.status === 201) {
        Msg.info(res.message);
      } else {
        Msg.error(res.message);
      }
      this.closeDialogRefreshTable(true);
    }
  },
}
</script>

<style scoped>
.teacher-form {
  width: 350px;
}

.teacher-form h2 {
  line-height: 30px;
  margin-top: -80px;
  margin-bottom: 20px;
  margin-left: 40px;
  text-align: center;
  align-items: center;
}

/deep/ .el-input input::-webkit-outer-spin-button,
/deep/ .el-input input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

/deep/ .el-input input[type="number"] {
  -moz-appearance: textfield;
}

/deep/ .el-input .el-input__inner {
  line-height: 1px !important;
}
</style>
