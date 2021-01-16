<template>
  <div class="signup-page mx-auto p-3 w-330">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <vaildate-input
          :rules="emailRules" v-model="formData.email"
          placeholder="请输入邮箱地址"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <vaildate-input
          :rules="nameRules" v-model="formData.nickName"
          placeholder="请输入昵称"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <vaildate-input
          :rules="passwordRules" v-model="formData.password"
          placeholder="请输入密码"
          type="password"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <vaildate-input
          :rules="repeatPasswordRules" v-model="formData.repeatPassword"
          placeholder="请输入密码"
          type="password"
        />
      </div>
      <template #submit>
      <span class="btn btn-primary">注册新用户</span>
    </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import VaildateInput, { RulesProp } from '@/components/VaildateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { defineComponent, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'Signup',
  components: { ValidateForm, VaildateInput },
  setup () {
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const router = useRouter()
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '重复密码不能为空' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '密码不相同'
      }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          password: formData.password,
          nickName: formData.nickName
        }
        axios.post('/users/', payload).then(data => {
          createMessage('注册成功，正在跳转登录页面', 'success')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      emailRules,
      nameRules,
      passwordRules,
      repeatPasswordRules,
      onFormSubmit,
      formData
    }
  }

})
</script>

<style>

</style>
