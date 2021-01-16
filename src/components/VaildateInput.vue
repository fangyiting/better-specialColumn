<template>
   <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="inputRef.val"
      @blur="VaildateInput"
      @input="updateValue"
      v-bind="$attrs"
    >
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="inputRef.val"
      @blur="VaildateInput"
      @input="updateValue"
      v-bind="$attrs"
    ></textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted } from 'vue'
import { emitter } from './ValidateForm.vue'
// 网上搜的验证, 写这些的都是大神
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

interface RuleProp {
  type: 'required' | 'email' | 'range' | 'custom';
  message?: string;
  validator?: () => boolean;
  min?: { length: number; message: string };
  max?: { length: number; message: string };
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  name: 'VaildateInput',
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    // 使用哪种 就传哪种框过去,默认input
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  // 禁用 Attribute 继承
  inheritAttrs: false,
  setup (props, context) {
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    const updateValue = (e: KeyboardEvent) => {
      // 双向绑定 相当于vue2的 v-model
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }
    const VaildateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message || ''
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            case 'range': {
              const { min, max } = rule
              if (min && inputRef.val.trim().length < min.length) {
                passed = false
                inputRef.message = min.message
              }
              if (max && inputRef.val.trim().length > max.length) {
                passed = false
                inputRef.message = max.message
              }
              break
            }
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', VaildateInput)
    })
    return {
      inputRef,
      VaildateInput,
      updateValue
    }
  }
})
</script>

<style scoped>

</style>
