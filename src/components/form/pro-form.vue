<template>
  <el-form :model="formModel" size="small" v-bind="elFormAttrs" label-width="auto" label-position=“left”>
    <el-form-item
      v-for="(formItemConfig, index) in formItemConfigArr"
      :key="`${formItemConfig.prop}-${index}`"
      :prop="formItemConfig.prop"
      :rules="formItemConfig.rules"
      :label="formItemConfig.label"
    >
      <!--      <template #label>-->
      <!--        <div class="o-custom-label">{{ formItemConfig.label }}</div>-->
      <!--      </template>-->
      <el-input
        v-if="formItemConfig.itemType === 'input'"
        v-model="formModel[formItemConfig.prop]"
      ></el-input>
      <el-select
        v-else-if="formItemConfig.itemType === 'select'"
        v-model="formModel[formItemConfig.prop]"
      >
        <template v-if="formItemConfig.optionArr">
          <el-option
            v-for="(option, pos) in formItemConfig.optionArr"
            :key="`${option.value}-${pos}`"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </template>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "pro-form",
  model: {
    event: "change",
    prop: "formData",
  },
  props: {
    formData: {
      type: Object,
    },
    /**
     * prop: 唯一标识
     * itemType: 表单项类型
     * rules: 表单验证规则
     * label: 显示标签
     * optionArr: 下拉值
     */
    formItemConfigArr: {
      type: Array,
      default: () => [],
    },
    // el-form支持的所有属性
    elFormAttrs: {
      type: Object,
    },
  },
  data() {
    return {
      formModel: this.formData ? this.formData : {},
    };
  },
  watch: {
    // 监听formData改变，将formData的值设置给组件内部的formModel，规避eslint对单项数据流的规则检测报错
    formData: {
      handler(newVal) {
        this.formModel = newVal;
      },
    },
  },
  methods: {},
}
</script>

<style scoped>
/deep/ .el-form-item__label-wrap {
  line-height: 40px;
}

.el-form-item {
  line-height: 0;
  max-height: 0;
}
</style>
