<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="tableTitle.stripe"
      :border="tableTitle.border"
      :fit="tableTitle.fit"
      :highlight-current-row="tableTitle.highlightCurrentRow"
      @selection-change="handleSelectionChange"
      :header-row-style="{lineHeight: '10px'}"
      border height="435">
      <!--表格第一列-->
      <el-table-column
        :type="firstTableCol.type"
        :width="firstTableCol.width"
        v-if="firstTableCol.select"
      >
      </el-table-column>
      <!--表格其它列-->
      <el-table-column v-for="(value,index) in tableCol" :key="index"
                       :prop="value.prop"
                       :label="value.label"
                       :width="value.width || 150"
                       resizable show-overflow-tooltip
                        style="line-height: 50px">
        <template slot-scope="scope">
          <template v-if="!value.render">
            <template v-if="value.formatter">
              {{ value.formatter(scope.row, value) }}
            </template>
            <template v-else-if="value.getImgurl">
              <el-image :src="value.getImgurl(scope.row, value)" style="width: 70px; height: 70px"
                        :preview-src-list="value.previewSrcList ? value.previewSrcList(scope.row, value) : value.getImgurl(scope.row, value).split(',')"/>
            </template>
            <template v-else>
              {{ scope.row[value.prop] }}
            </template>
          </template>
          <!--扩展dom-->
          <template v-else>
            <Table :key="`cus${index}`" :render="value.render" :param="scope.row"></Table>
          </template>
        </template>
      </el-table-column>
      <!--基础操作-->
      <el-table-column label="操作" fixed="right" :width="180">
        <template slot-scope="scope">
          <el-button type="text" v-for="(value,index) in operator" :disabled="value.disabled(scope.row, value)" @click="value.click(scope.row, value)" :key="index">
            {{ value.text }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页插件-->
    <el-pagination
      v-show="total>0"
      :total="total"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      v-bind="$attrs">
    </el-pagination>
  </div>
</template>

<script>
import Table from "@/tools/table";

export default {
  name: "pro-table",
  components: {Table},
  props: {
    tableTitle: {
      type: Object,
      default: {
        stripe: false,
        border: true,
        fit: true,
        highlightCurrentRow: false
      }
    },
    firstTableCol: {
      type: Object,
      default: {
        select: false,
        width: 55,
        type: 'selection'
      }
    },
    tableCol: {
      type: Array,
      default: ()=>([])
    },
    tableData: {
      type: Array,
      default: ()=>([])
    },
    operator: {
      type: Array,
      default: ()=>([])
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    autoScroll: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    // 监听table选择框
    handleSelectionChange(selection) {
      // 调用父组件对应的方法 handleSelectionChange
      this.$emit('handleSelectionChange', selection)
    },
    // 监听每页多少条数据（limit）
    handleSizeChange(limit) {
      this.$emit('pagination', {page: this.currentPage, limit: limit})
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    // 监听当前是第几页（page）
    handleCurrentChange(page) {
      this.$emit('pagination', {page: page, limit: this.pageSize})
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
  }
}
</script>

<style scoped>
.el-pagination {
  max-height: 28px;
  padding-top: 3px;
  padding-bottom: 0;
}
</style>
