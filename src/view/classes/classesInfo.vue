<template>
  <div class="info">
    <div class="search">
      <el-input placeholder="请输入内容"
                v-model="searchParams.value"
                class="input-with-select"
                @keyup.enter.native="searchValidate">
        <el-select v-model="searchParams.key" slot="prepend" placeholder="请选择">
          <el-option :label="option.label" :value="option.value"
                     :key="option.value" v-for="option in searchOptions"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchValidate()"></el-button>
      </el-input>
      <div class="button-box">
        <el-button type="primary" @click="batchDeletion()">批量归档</el-button>
        <el-button type="primary" @click="addInfo()">添加班级</el-button>
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

    <el-dialog :visible.sync="dialogFormVisible"
               width="30%" top="10vh"
               :before-close="closeDialogRefreshTable"
               v-el-drag-dialog
               destroy-on-close center>
      <classes-form v-if="dialogFormVisible" :update="update" :add="add" :classes="currentClasses"/>
    </el-dialog>
  </div>
</template>

<script>
import proTable from "@/components/table/pro-table";
import {delClass, getAllClasses, arhClasses, selectClasses} from "@/api/classesApi";
import {Msg} from "@/tools/message";
import ClassesForm from "@/view/classes/classesForm";
import elDragDialog from "@/directive/el-dragDialog";

export default {
  name: "classesInfo",
  directives: {elDragDialog},
  components: {
    ClassesForm,
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
        key: "cid",
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
        {value: 'cid', label: '班级号'},
        {value: 'name', label: '班级名'},
        {value: 'grade', label: '年级'},
        {value: 'manager', label: '班主任'},
        {value: 'college', label: '学院'},
      ],
      // 设置table的列
      tableCol: [
        {prop: 'c_no', label: '序号', width: 50},
        {prop: 'cid', label: '班级号'},
        {prop: 'name', label: '班级名'},
        {prop: 'manager', label: '班主任'},
        {prop: 'stuNum', label: '班级人数'},
        {prop: 'grade', label: '年级', width: 100},
        {prop: 'college', label: '学院', width: 200},
      ],
      // table的基本操作
      operator: [
        {
          'text': '编辑', click: (row, col, cellValue) => {
            return this.editInfo(row)
          },
          disabled: (row, col, cellValue) => {
            return false;
          },
        },
        {
          'text': '详情', click: (row, col, cellValue) => {
            return this.getInfo(row)
          },
          disabled: (row, col, cellValue) => {
            return false;
          },
        },
        {
          'text': '归档', click: (row, col, cellValue) => {
            return this.archInfo(row)
          },
          disabled: (row, col, cellValue) => {
            return false;
          },
        },
        {
          'text': '删除',
          click: (row, col, cellValue) => {
            return this.delInfo(row)
          },
          disabled: (row, col, cellValue) => {
            return row.stuNum !== 0;
          },
        },
      ],
      // 模拟数据
      tableData: [],
      firstTableCol: {
        'select': true,
        'type': 'selection'
      },
      currentClasses: {},
    }
  },
  methods: {
    addInfo() {
      this.add = true;
      this.dialogFormVisible = true;
      this.currentClasses = {};
    },
    getInfo(classes) {
      this.currentClasses = classes;
      this.dialogFormVisible = true;
      // 触发父方法
      console.log("获取详情", classes)
    },
    delInfo(classes) {
      this.$confirm(`您确定要删除${classes.cid}-${classes.name}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      }).then(() => {
        this.delClasses(classes.cid);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      // 触发父方法
      console.log("删除信息", classes)
    },
    archInfo(classes) {
      this.$confirm(`您确定要归档${classes.cid}-${classes.name}及班内所有学生吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      }).then(() => {
        this.archClasses(classes.cid);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消归档'
        });
      });
      // 触发父方法
      console.log("归档信息", classes)
    },
    editInfo(classes) {
      this.update = true;
      this.currentClasses = classes;
      this.dialogFormVisible = true;
      // 触发父方法
      console.log("编辑信息", classes)
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
    getAllClasses(queryParams) {
      if (!queryParams) {
        queryParams = this.queryParams;
      }
      getAllClasses(queryParams).then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          Msg.error(res.message);
        }
      }).then((data) => {
        this.tableData = data.classes;
        this.total = data.count;
      }).catch(err => Msg.error(err));
    },
    delClasses(cid) {
      // let param = {
      //   cid: cid
      // }
      delClass(cid).then((res) => {
        if (res.status === 200) {
          Msg.success(res.message);
          this.getAllClasses();
        } else {
          Msg.error(res.message);
        }
      }).catch(err => Msg.error(err));
    },
    archClasses(cid) {
      // let param = {
      //   cid: cid
      // }
      arhClasses([cid]).then((res) => {
        if (res.status === 200) {
          Msg.success(res.message);
          this.getAllClasses();
        } else {
          Msg.error(res.message);
        }
      }).catch(err => Msg.error(err));
    },
    batchDeletion() {
      if (this.handleSelection.length === 0 || this.handleSelection === []) {
        Msg.info("请选择想要归档的班级列");
        return;
      }
      this.$confirm(`您确定要归档这些班级及其所有学生吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true,
        type: 'warning',
        showClose: false,
      }).then(() => {
        let delList = [];
        for (let item of this.handleSelection) {
          delList.push(item.cid);
        }

        arhClasses(delList).then(res => {
          if (res.status === 200) {
            Msg.success(res.message);
            this.searchParams.value = "";
            this.getAllClasses(this.queryParams);
          } else {
            Msg.error(res.message);
          }
        }).catch(err => Msg.error(err));

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消归档'
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
        this.getAllClasses(this.queryParams);
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
      selectClasses(params).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.classes;
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
        this.getAllClasses(this.queryParams);
      }
    }
  },
  provide() {
    return {
      closeDialogRefreshTable: this.closeDialogRefreshTable,
    };
  },
  mounted() {
    this.getAllClasses(this.queryParams);
  },
}
</script>

<style scoped>
/deep/ .el-dialog__header {
  height: 60px;
  line-height: 100px;
}

.el-select .el-input {
  width: 130px;
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
