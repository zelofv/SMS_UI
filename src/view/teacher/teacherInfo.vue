<template>
  <div class="info">
    <div class="search">
      <el-input placeholder="请输入内容"
                v-model="searchParams.value"
                class="input-with-select"
                @keyup.enter.native="searchValidate">
        <el-select v-model="searchParams.key" slot="prepend" placeholder="请选择">
          <el-option :label="option.label" :value="option.value" v-for="option in searchOptions" :key="option.value"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchValidate()"></el-button>
      </el-input>
      <div class="button-box">
        <el-button type="danger" @click="batchDeletion()">批量删除</el-button>
        <el-button type="primary" @click="addInfo()">添加教师</el-button>
      </div>
    </div>
    <proTable ref="proTable" :tableTitle="tableTitle"
              :tableCol="tableCol" :tableData="tableData"
              :operator="operator"
              :firstTableCol="firstTableCol"
              :total="total" :page.sync="queryParams.page"
              :limit.sync="queryParams.pageSize"
              @handleSelectionChange="handleSelectionChange"
              @pagination="getList"/>

    <el-dialog :visible.sync="dialogFormVisible" width="30%" top="10vh"
               :before-close="closeDialogRefreshTable"
               v-el-drag-dialog
               destroy-on-close center>
      <teacher-form v-if="dialogFormVisible" :update="update" :add="add" :teacher="currentTeacher"/>
    </el-dialog>
  </div>
</template>

<script>
import proTable from "@/components/table/pro-table";
import {delTeacher, getAllTeacher, delTeachers, selectTeacher} from "@/api/teacherApi";
import {Msg} from "@/tools/message";
import TeacherForm from "@/view/teacher/teacherForm";
import elDragDialog from "@/directive/el-dragDialog";

export default {
  name: "teacherInfo",
  directives: {elDragDialog},
  components: {
    TeacherForm,
    proTable
  },
  data() {
    return {
      update: false,
      add: false,
      dialogFormVisible: false,
      queryParams: {
        page: 1,
        limit: 10,
      },
      searchParams: {
        key: "name",
        value: "",
      },
      handleSelection: [],
      type: 'success',
      total: 0,
      // element-ui中对table属性的设置
      tableTitle: {
        'stripe': true,
        "highlightCurrentRow": true
      },
      searchOptions: [
        {value: 'name', label: '姓名'},
        {value: 'uid', label: '教师账号'},
        {value: 'tid', label: '教师工号'},
        {value: 'gender', label: '性别'},
        {value: 'college', label: '学院'},
      ],
      // 设置table的列
      tableCol: [
        {prop: 't_no', label: '序号', width: 50},
        {prop: 'tid', label: '教师工号'},
        {prop: 'name', label: '姓名', width: 100},
        {prop: 'uid', label: '教师账号'},
        {prop: 'gender', label: '性别', width: 100},
        {prop: 'college', label: '学院', width: 200},
        {prop: 'manage', label: '管理班级', width: 280},
      ],
      // table的基本操作
      operator: [
        {
          'text': '详情', click: (row, col, cellValue) => {
            return this.getInfo(row)
          },
          disabled: (row, col, cellValue) => {
            return false;
          },
        },
        {
          'text': '删除', click: (row, col, cellValue) => {
            return this.delInfo(row)
          },
          disabled: (row, col, cellValue) => {
            return !(row.manage === null || row.manage === "");
          },
        },
        {
          'text': '编辑', click: (row, col, cellValue) => {
            return this.editInfo(row)
          },
          disabled: (row, col, cellValue) => {
            return false;
          },
        },
      ],
      tableData: [],
      firstTableCol: {
        'select': true,
        'type': 'selection'
      },
      currentTeacher: {},
    }
  },
  methods: {
    addInfo() {
      this.add = true;
      this.dialogFormVisible = true;
      this.currentTeacher = {};
    },
    getInfo(teacher) {
      this.currentTeacher = teacher;
      this.dialogFormVisible = true;
      // 触发父方法
      console.log("获取详情", teacher)
    },
    delInfo(teacher) {
      this.$confirm(`您确定要删除${teacher.tid}-${teacher.name}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      }).then(() => {
        this.delTeacher(teacher.tid);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      // 触发父方法
      console.log("删除信息", teacher)
    },
    editInfo(teacher) {
      this.update = true;
      this.currentTeacher = teacher;
      this.dialogFormVisible = true;
      // 触发父方法
      console.log("编辑信息", teacher)
    },
    handleSelectionChange(list) {
      this.handleSelection = list;
      console.log("监听选择框", list)
    },
    getList(queryParams) {
      console.log("父级方法", queryParams)
      this.search(queryParams);
    },
    render(h, params) {
      return h('span', null, '我是一个render组件')
    },
    getAllTeacher(queryParams) {
      if (!queryParams) {
        queryParams = this.queryParams;
      }
      getAllTeacher(queryParams).then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          Msg.error(res.message);
        }
      }).then((data) => {
        this.tableData = data.teacher;
        this.total = data.count;
      }).catch(err => Msg.error(err));
    },
    delTeacher(tid) {
      // let param = {
      //   sid: sid
      // }
      delTeacher(tid).then((res) => {
        if (res.status === 200) {
          Msg.success(res.message);
          this.getAllTeacher();
        } else {
          Msg.error(res.message);
        }
      }).catch(err => Msg.error(err));
    },
    batchDeletion() {
      if (this.handleSelection.length === 0 || this.handleSelection === []) {
        Msg.info("请选择想要删除的教师列");
        return;
      }
      this.$confirm(`您确定要删除这些教师吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true,
        type: 'warning',
        showClose: false,
      }).then(() => {
        let delList = [];
        for (let item of this.handleSelection) {
          delList.push(item.tid);
        }

        delTeachers(delList).then(res => {
          if (res.status === 200) {
            Msg.success(res.message);
            this.searchParams.value = "";
            this.getAllTeacher(this.queryParams);
          } else {
            Msg.error(res.message);
          }
        }).catch(err => Msg.error(err));

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    searchValidate() {
      if (this.searchParams.key === "") {
        Msg.warning("请选择搜索列");
        return;
      }
      this.queryParams.page = 1;
      if (this.searchParams.value === "") {
        // Msg.warning("请输入搜索内容");
        this.getAllTeacher(this.queryParams);
        return;
      }
      this.search(this.queryParams);
    },
    search(pageParam) {
      if (pageParam === undefined || pageParam === null) {
        pageParam === this.queryParams;
      }
      let params = {
        key: this.searchParams.key,
        value: this.searchParams.value,
        limit: pageParam,
      }
      selectTeacher(params).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.teacher;
          this.total = res.data.count;
        }
      }).catch(err => Msg.error(err));
    },
    closeDialogRefreshTable(refresh) {
      this.update = false;
      this.add = false;
      this.dialogFormVisible = false;
      if (refresh) {
        this.queryParams.page = 1;
        this.getAllTeacher(this.queryParams);
      }
    }
  },
  provide() {
    return {
      closeDialogRefreshTable: this.closeDialogRefreshTable,
    };
  },
  mounted() {
    this.getAllTeacher(this.queryParams);
  },
}
</script>

<style scoped>
/deep/ .el-dialog__header {
  height: 60px;
  line-height: 100px;
}

.el-select .el-input {
  width: 200px;
}

.search {
  display: block;
  line-height: 50px;
  height: 50px;
}

.button-box {
  float: right;
  margin-top: -5px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.input-with-select {
  float: left;
  width: 25%;
}

/deep/ .el-input-group__prepend {
  width: 45px;
}
</style>
