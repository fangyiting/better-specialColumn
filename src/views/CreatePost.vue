<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <input type="file" name="file" @change.prevent="handleFileChange"/>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题: </label>
        <vaildate-input
          :rules="titleRules" v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情: </label>
        <vaildate-input
          rows="10"
          :rules="contentRules"
          v-model="contentVal"
          tag="textarea"
          placeholder="请输入文章详情"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import VaildateInput, { RulesProp } from '@/components/VaildateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import axios from 'axios'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps } from '../store'

export default defineComponent({
  components: { ValidateForm, VaildateInput },
  setup () {
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    // 这个是定义路由的一系列行为
    const titleVal = ref('')
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        // 获取columnId 传到对应ColumnDetail
        const { column } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column
          }
          store.commit('createPost', newPost)
          router.push({ name: 'column', params: { id: column } })
        }
      }
    }
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        axios.post('/upload', formData, {
          headers: {
            'Contetnt-Type': 'mutipart/form-data'
          }
        }).then((resp: any) => {
          console.log(resp)
        })
      }
    }
    return {
      titleRules,
      contentRules,
      contentVal,
      titleVal,
      onFormSubmit,
      handleFileChange
    }
  }

})
</script>

<style>

</style>
