<script setup lang="ts">
import { ref, defineProps, reactive } from 'vue'
import { returnFileSize } from '@/utils'

const props = defineProps<{
  accept?: string
}>()

const uploadFilesRef = ref<HTMLInputElement | null>(null)
const filesList = reactive([])

const getFile = () => {
  uploadFilesRef?.value?.click()
}

const onPreview = async (src: string) => {
  const image = new Image()
  image.src = src
  const imgWindow = window.open(src)
  imgWindow?.document.write(image.outerHTML)
}

const removeFile = (index: number) => {
  filesList.splice(index, 1)
}

const changeHandle = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const curFiles = target.files

  const validFileType = (name: string) => {
    const acceptTypes = props?.accept?.split(',')
    if (!acceptTypes) {
      return true
    }
    return acceptTypes.includes(name)
  }

  if (curFiles) {
    for (let i = 0; i < curFiles.length; i++) {
      const file = curFiles[i]
      if (file?.name && validFileType(file?.name)) {
        const { name, size, type } = file
        const [ext, ...rest] = name.split('.').reverse()

        const fileUrl = URL.createObjectURL(file)

        filesList.push({
          name,
          fileName: rest.join('.'),
          ext,
          size,
          type,
          url: fileUrl,
          index: i
        })
      }
    }
    // 清除input值 同一文件可以再次上传
    ;(e.target as HTMLInputElement).value = ''
  }
}
</script>

<template>
  <div class="upload-container">
    <label class="label-container" for="files" @click="getFile">
      <slot></slot>选择要上传的文件
    </label>
    <input
      type="file"
      name="files"
      ref="uploadFilesRef"
      :accept="accept"
      multiple
      hidden
      @change="changeHandle"
    />
    <ol class="preview">
      <li v-for="(curFile, index) in filesList" :key="curFile?.index" class="preview-item">
        <div class="file-desc">
          <div class="flex-item">
            <span class="ellipsis" :title="curFile?.name">{{
              `文件名：${curFile?.fileName}`
            }}</span>
            <span class="ext">{{ '.' + curFile?.ext }}</span>
          </div>
          <div class="flex-item">
            <span class="ellipsis" :title="returnFileSize(curFile?.size)?.join(' ')">
              {{ `文件大小：${returnFileSize(curFile?.size)?.[0]} ` }}</span
            >
            <span class="ext"> {{ returnFileSize(curFile?.size)?.[1] }}</span>
          </div>
          <div class="flex-item" :title="curFile?.type">
            <span class="ellipsis">{{ `文件类型：${curFile?.type}` }}</span>
          </div>
          <div class="flex-item-preview">
            <span>文件预览：</span>
            <img
              alt="preview image"
              class="preview-container"
              v-if="curFile?.type?.startsWith('image/')"
              :src="curFile?.url"
              @click="onPreview(curFile?.url)"
            />
            <a
              v-else-if="['text/plain', 'application/pdf'].some((s) => curFile?.type?.includes(s))"
              :href="curFile?.url"
              target="_blank"
              charset="utf-8"
              >查看</a
            >
            <iframe
              :src="`https://view.officeapps.live.com/op/embed.aspx?src=${curFile?.url}`"
              v-else-if="curFile?.type?.startsWith('application/')"
              class="preview-container"
            >
            </iframe>
            <span v-else>暂无</span>
          </div>
        </div>
        <button class="remove" @click="removeFile(index)">删除</button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.upload-container {
  padding: 24px;
  background-color: #fff;
  min-height: calc(100vh - 200px);
}

.label-container {
  width: fit-content;
  cursor: pointer;
}

.preview {
  display: flex;
  flex-direction: column;
  padding-inline-start: 0;
  margin-top: 20px;
  row-gap: 12px;
}

.preview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 20px;
  border: 1px solid gray;
  min-height: 80px;
}

.file-desc {
  max-width: calc(100% - 40px);
  display: flex;
  align-items: center;
  column-gap: 20px;
  flex: 1;
}

.flex-item {
  display: flex;
  align-items: center;
  min-width: 0;
  width: 25%;
}

.flex-item-preview {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 25%;
  min-width: 80px;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ext {
  flex: 1 0 1;
}

.preview-container {
  min-width: 20px;
  max-width: 120px;
  max-height: 80px;
  cursor: pointer;
}

.remove {
  min-width: 48px;
  cursor: pointer;
}
</style>
