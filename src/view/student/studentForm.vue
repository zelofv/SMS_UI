<template>
  <div class="student-form">
    <h2 v-show="view">查看学生信息</h2>
    <h2 v-show="updateForm">编辑学生信息</h2>
    <h2 v-show="addForm">新增学生</h2>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="学号" prop="sid">
        <el-input type="number" v-model="ruleForm.sid" autocomplete="off" :readonly="view"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input type="text" v-model="ruleForm.name" autocomplete="off" :readonly="view"></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-input type="number" v-model="ruleForm.grade" :readonly="view"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input type="number" v-model="ruleForm.age" :readonly="view"></el-input>
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
      <el-form-item label="班级" prop="classNo">
        <el-input type="number" v-model="ruleForm.classNo" :readonly="view"></el-input>
      </el-form-item>
<!--      <el-form-item label="学院" prop="college">-->
<!--        <el-input v-model="ruleForm.college" :readonly="view"></el-input>-->
<!--      </el-form-item>-->
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
import {addStudent, updateStudent} from "@/api/studentApi";
import {Msg} from "@/tools/message";

export default {
  name: "studentForm",
  props: {
    student: {
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
    let checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 0) {
            callback(new Error('必须大于0'));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    // let validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入密码'));
    //   } else {
    //     if (this.ruleForm.checkPass !== '') {
    //       this.$refs.ruleForm.validateField('checkPass');
    //     }
    //     callback();
    //   }
    // };
    // let validatePass2 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请再次输入密码'));
    //   } else if (value !== this.ruleForm.pass) {
    //     callback(new Error('两次输入密码不一致!'));
    //   } else {
    //     callback();
    //   }
    // };
    let validateSid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('学号不能为空'));
      }
      if (!/^1\d{10}$/.test(value)) {
        return callback(new Error("学号应为11位且为1开头"));
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
    let validateClassNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('班级号不能为空'));
      }
      if (!/^1\d{8}$/.test(value)) {
        return callback(new Error('班级号应为9位且为1开头'));
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
        sid: this.student.sid,
        name: this.student.name,
        grade: this.student.grade,
        age: this.student.age,
        gender: this.student.gender === undefined ? '男' : this.student.gender,
        classNo: this.student.classNo,
        college: this.student.college,
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
        sid: [
          {validator: validateSid, trigger: 'blur'}
        ],
        name: [
          {validator: validateName, trigger: ['blur', 'change']}
        ],
        grade: [
          {required: true, message: '年级不能为空'},
          {type: 'number', message: '年级必须为数字值'}
        ],
        age: [
          {validator: checkAge, trigger: 'blur'}
        ],
        classNo: [
          {validator: validateClassNo, trigger: 'blur'}
        ],
        college: [
          // {validator: validateCollege, trigger: ['blur', 'change']}
        ],
      }
    }
      ;
  }
  ,
  computed: {
    view() {
      return !this.updateForm && !this.addForm;
    }
    ,
  }
  ,
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          if (this.update && !this.add) {
            updateStudent(this.ruleForm).then(res => {
              this.processData(res);
            }).catch(err => Msg.error(err));
          } else {
            addStudent(this.ruleForm).then(res => {
              this.processData(res);
            }).catch(err => Msg.error(err));
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
    ,
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
    },

  }
  ,
}
</script>

<style scoped>
.student-form {
  width: 350px;
}

.student-form h2 {
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
