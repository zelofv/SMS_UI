<template>
  <div class="classes-form">
    <h2 v-show="view">查看班级信息</h2>
    <h2 v-show="updateForm">编辑班级信息</h2>
    <h2 v-show="addForm">新增班级</h2>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item label="年级" prop="grade">
        <el-input type="number" v-model="ruleForm.grade" :readonly="view"
                  oninput="if(value>99)value=99;if(value.length>3)value=value.slice(0,3);if(value<0)value=1"></el-input>
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
      <el-form-item label="专业" prop="major">
        <el-input v-if="view" v-model="ruleForm.major" readonly></el-input>
        <el-select v-else v-model="ruleForm.major">
          <el-option
            v-for="(option, pos) in ruleOption.major"
            :key="`${option.value}-${pos}`"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班号" prop="code">
        <el-input type="number" style="width: 50px;" v-model="ruleForm.code" autocomplete="off"
                  oninput="if(value>9)value=9;if(value.length>1)value=value.slice(0,1);if(value<0)value=1"
                  :readonly="view"></el-input>
        班
      </el-form-item>
      <el-form-item label="班主任" prop="manager">
        <el-input v-if="view" v-model="ruleForm.manager" readonly></el-input>
        <el-select v-else v-model="ruleForm.manager" filterable>
          <el-option
            v-for="(option, pos) in ruleOption.manager"
            :key="`${option.value}-${pos}`"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级代号" prop="cid">
        <el-input type="text" v-model="cid" readonly></el-input>
      </el-form-item>
      <el-form-item v-show="!view">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {addClass, updateClass} from "@/api/classesApi";
import {Msg} from "@/tools/message";
import {getAllTeacher} from "@/api/teacherApi";

export default {
  name: "classesForm",
  props: {
    classes: {
      type: Object,
      default: {
        name: "",
        grade: "",
        college: "",
        code: "",
        major: "",
        manager: "",
      },
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
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('班级名不能为空'));
      }
      if (!/^[^\x00-\xff]{2,8}$|^[a-zA-Z]+\s?[a-zA-Z]+$/.test(value)) {
        return callback(new Error("请正确输入班级名"));
      } else {
        callback();
      }
    }
    return {
      updateForm: this.$props.update,
      addForm: this.$props.add,
      // ruleForm: {
      //   name: this.classes.name,
      //   grade: parseInt(this.classes.grade),
      //   college: !this.updateForm && !this.addForm ? this.classes.college :
      //     this.$store.state.collegeReverseMap[this.classes.college],
      //   code: this.classes.cid.toString().substring(7),
      //   major: !this.updateForm && !this.addForm ?
      //     this.$store.state.majorMap[this.classes.cid.toString().substring(3, 7)]
      //     : this.classes.cid.toString().substring(3, 7),
      //   manager: this.classes.manager,
      // },
      ruleForm: {
        name: "",
        grade: "",
        college: "",
        code: "",
        major: "",
        manager: "",
      },
      ruleOption: {
        manager: [],
        college: [
          {value: '03', label: '计算机科学与工程学院',},
          {value: '08', label: '管理学院',},
          {value: '10', label: '药学与生物工程学院',},
          {value: '23', label: '两江人工智能学院',},
        ],
        major: [],
      },
      rules: {
        cid: [
          // {required: true, trigger: 'blur'}
        ],
        name: [
          {validator: validateName, trigger: ['blur', 'change']}
        ],
        college: [
          // {required: true, trigger: ['blur', 'change']}
        ],
      }
    }
      ;
  },
  watch: {
    'ruleForm.college': {
      // 此处监听variable变量，当期有变化时执行
      handler(item1, item2) {
        // item1为新值，item2为旧值
        this.parseMajorOption(item1);
        if (item1 !== item2 && item2 !== undefined && item2 !== '') {
          // console.log(item2)
          this.ruleForm.major = '';
        }
      },
      immediate: true,
    },
    deep: true,
  },
  computed: {
    cid() {
      return this.view ? this.classes.cid : '1'
        + (this.ruleForm.grade.length === 1 ? "0" + this.ruleForm.grade : this.ruleForm.grade.toString().substring(0, 2))
        + this.ruleForm.major + (this.ruleForm.code.length === 1 ? '0' : '') + this.ruleForm.code.toString().substring(0, 1);
    },
    view() {
      return !this.updateForm && !this.addForm;
    },
  },
  methods: {
    parseMajorOption(college) {
      switch (college) {
        case '03':
          this.ruleOption.major = [{value: "0302", label: "计算机"}];
          break;
        case '08':
          this.ruleOption.major = [{value: "0802", label: "管理"}];
          break;
        case '10':
          this.ruleOption.major = [{value: "1002", label: "药学与生物医学"}];
          break;
        case '23':
          this.ruleOption.major = [
            {value: "2301", label: "大数据"},
            {value: "2302", label: "软件工程"},
            {value: "2304", label: "智科"},
            {value: "2305", label: "人工智能"},
          ];
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          let params = {
            cid: this.cid,
            name: this.$store.state.majorMap[this.ruleForm.major] + this.ruleForm.code + '班',
            college: this.$store.state.collegeMap[this.ruleForm.college],
            tid: this.ruleForm.manager,
          }
          if (this.update && !this.add) {
            updateClass(params).then(res => {
              this.processData(res);
            }).catch(err => Msg.error(err));
          } else {
            addClass(params).then(res => {
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
  mounted() {
    if (!this.add) {
      this.ruleForm = {
        name: this.classes.name,
        grade: parseInt(this.classes.grade),
        college: !this.updateForm && !this.addForm ? this.classes.college :
          this.$store.state.collegeReverseMap[this.classes.college],
        code: this.classes.cid.toString().substring(7),
        major: !this.updateForm && !this.addForm ?
          this.$store.state.majorMap[this.classes.cid.toString().substring(3, 7)]
          : this.classes.cid.toString().substring(3, 7),
        manager: this.classes.manager,
      }
    }
    if (!this.view) {
      // this.parseMajorOption();
      getAllTeacher().then(res => {
        if (res.status === 200) {
          return res.data;
        } else {
          Msg.error(res.message);
        }
      }).then(data => {
        let teachers = [];
        for (let teacher of data.teacher) {
          let option = {
            value: teacher.tid,
            label: teacher.name + '-' + teacher.tid,
          }
          teachers.push(option);
        }
        this.ruleOption.manager = teachers;
      }).catch(err => Msg.error(err));
    }
  }
}
</script>

<style scoped>
.classes-form {
  width: 350px;
}

.classes-form h2 {
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
