<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传……</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary" >上传成功</button>
      </slot>
      <solt v-else name="default">
       <button class="btn btn-primary" >点击上传</button>
      </solt>
    </div>
    <input type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import axios from 'axios'
// 创建状态 类型
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFuntion = (file: File) => boolean;
export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUplaod: {
      type: Function as PropType<CheckFuntion>
    }
  },
  // 自定义事件
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')
    const uploadedData = ref()
    // 操作ref来达到上传的目的
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      // 上传组件的一系列操作
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files)
        // 是否满足自定义需求
        if (props.beforeUplaod) {
          const result = props.beforeUplaod(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        axios.post(props.action, formData, {
          headers: {
            'Contetnt-Type': 'mutipart/form-data'
          }
        }).then((resp: any) => {
          fileStatus.value = 'success'
          uploadedData.value = resp.data
          // 成功事件
          context.emit('file-uploaded', resp.data)
        }).catch((error) => {
          fileStatus.value = 'error'
          // 失败事件
          context.emit('file-uploaded-error', { error })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      handleFileChange,
      uploadedData
    }
  }
})
</script>

<style>

</style>
