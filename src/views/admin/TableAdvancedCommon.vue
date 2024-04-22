<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus'
import { onMounted, ref } from 'vue'

interface Item {
  date: string
  name: string
  state: string
  city: string
  address: string
  zip: string
}

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    children: [
      {
        date: '2016-05-01 09:00',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-01 10:00',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles'
      }
    ]
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036'
  }
]

const filterHandler = (value: string, row: Item, column: TableColumnCtx<Item>) => {
  const property = column['property']
  return row[property] === value
}

const handleEdit = (index: number, row: unknown) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: unknown) => {
  console.log(index, row)
}

const currentPage = ref(4)
const pageSize = ref(100)
const loading = ref(true)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>
<template>
  <el-table :data="tableData" v-loading="loading" style="width: 100%" height="250" row-key="date">
    <template #empty>
      <el-empty description="暂无数据" />
    </template>
    <el-table-column type="selection" width="55" />
    <el-table-column
      fixed
      sortable
      prop="date"
      label="Date"
      :filters="[
        { text: '2016-05-01', value: '2016-05-01' },
        { text: '2016-05-02', value: '2016-05-02' },
        { text: '2016-05-03', value: '2016-05-03' },
        { text: '2016-05-04', value: '2016-05-04' }
      ]"
      :filter-method="filterHandler"
      width="150"
      show-overflow-tooltip
    />
    <el-table-column prop="name" label="Name" width="120" />
    <el-table-column prop="state" label="State" width="120" />
    <el-table-column prop="city" label="City" width="360" />
    <el-table-column prop="address" label="Address" width="200" show-overflow-tooltip />
    <el-table-column prop="zip" label="Zip" width="120" />
    <el-table-column fixed="right" label="Option" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">
          Edit
        </el-button>
        <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope.row)">
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[100, 200, 300, 400]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400"
    :background="true"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<style scoped>
.el-pagination {
  justify-content: flex-end;
  padding-top: 16px;
}
</style>
