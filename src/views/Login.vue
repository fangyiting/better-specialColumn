<template>
<h1></h1>
  <validate-form @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <vaildate-input
      :rules="emailRules"
      v-model="emailVal"
      placeholder="请输入邮箱地址"
      type="text"
      ></vaildate-input>
    </div>
    <div class="mb-3">
      <label class="form-label">密码</label>
      <vaildate-input
      type="password"
      :rules="passwordRules"
      v-model="passwordVal"
      placeholder="请输入密码"
      ></vaildate-input>
    </div>
    <template #submit>
      <span class="btn btn-primary">提交</span>
    </template>
  </validate-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import VaildateInput, { RulesProp } from '../components/VaildateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '../components/createMessage'
export default defineComponent({
  name: 'Login',
  components: {
    VaildateInput,
    ValidateForm
  },
  setup () {
    const store = useStore()
    // 这个是定义路由的一系列行为
    const router = useRouter()
    const emailVal = ref('')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordVal = ref('')
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'range', min: { message: '你的密码至少包括六位,不能有空格', length: 6 } }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        store.dispatch('loginAndFetch', payload).then(data => {
          createMessage('登录成功 2秒后跳转首页', 'success')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      emailRules,
      passwordRules,
      passwordVal,
      emailVal,
      onFormSubmit
    }
  }
})
</script>

<style scoped>

</style>
