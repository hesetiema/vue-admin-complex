<template>
  <el-table :data="list" width="100%" class="table-container">
    <el-table-column label="Order_No" min-width="150">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>

    <el-table-column label="Price" width="180" align="center">
      <template slot-scope="scope"> ￥{{ scope.row.price }} </template>
    </el-table-column>

    <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{ row }">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from "@/api/remote-search";
import mock from "../../../../mock/index.js";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        pending: "danger"
      };
      return statusMap[status];
    },
    orderNoFilter(str) {
      return str.substring(0, 30);
    }
  },
  data() {
    return {
      list: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      transactionList().then(res => {
        this.list = res.data.items.slice(0, 8);
      });
    }
  }
};
</script>

<style scoped>
.table-container {
  margin-bottom: 2rem;
}
</style>
