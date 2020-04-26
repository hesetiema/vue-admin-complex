<template>
  <div>
    <div class="options-container">
      <el-button type="primary" @click="handleCreate" icon="el-icon-plus">创建</el-button>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="Time">
          <el-date-picker v-model="form.time" type="datetime" placeholder="Pick a date"></el-date-picker>
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="Author" prop="author">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="Importance">
          <el-rate v-model="form.importance" :max="5"></el-rate>
        </el-form-item>
        <el-form-item label="Comment">
          <el-input v-model="form.comment" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
        </el-form-item>
        <el-form-item label="State">
          <el-select v-model="form.state">
            <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >Confirm</el-button>
      </div>
    </el-dialog>

    <el-table
      :data="list"
      class="table-container"
      v-loading="loading"
      show-header
      highlight-current-row
      border
      fit
      :stripe="true"
      :sort="{prop: 'time', order: 'descending'}"
    >
      <el-table-column label="序号" align="center">
        <template slot-scope="{$index}">
          <span>{{ $index+1+(listQuery.limit)*(listQuery.page-1) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" sortable prop="time" max-width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time| parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>作者: {{ scope.row.author }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.title }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="重要程度" align="center">
        <template slot-scope="{row}">
          <svg-icon v-for="n in row.importance" :key="n" icon-class="star" />
        </template>
      </el-table-column>
      <el-table-column label="评论" align="center" empty-text :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | stateFilter">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            v-if="row.state==='draft'"
            @click="handleUpdate(row)"
          >Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      v-show="total>0"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-size.sync="listQuery.limit"
      :page-sizes="listQuery.pageSizes"
      :current-page.sync="listQuery.page"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import {
  transactionsList,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from "@/api/remote-search";
import { parseTime } from "@/utils";
import Vue from "vue";

export default {
  filters: {
    stateFilter(state) {
      const stateMap = {
        published: "success",
        draft: "info"
      };
      return stateMap[state];
    },
    parseTime(time, format) {
      return parseTime(time, format);
    }
  },
  data() {
    return {
      temList: null,
      list: null,
      total: 0,
      form: {
        time: new Date(),
        title: "",
        author: "",
        importance: 1,
        comment: "",
        state: "published"
      },
      listQuery: {
        page: 1,
        limit: 5,
        pageSizes: [5, 10, 20]
      },
      loading: true,
      options: ["published", "draft"],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      rules: {
        author: [
          { required: true, message: "author is required", trigger: "change" }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    resetForm() {
      this.form = {
        time: new Date(),
        title: "",
        author: "",
        importance: 1,
        comment: "",
        state: "published"
      };
    },
    async fetchList() {
      await transactionsList().then(res => {
        this.temList = res.data;
        this.total = this.temList.length;
      });
      const { page, limit } = this.listQuery;
      this.list = [...this.temList].slice(page - 1, limit);
      this.loading = false;
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    createData() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          createTransaction(this.form).then(() => {
            this.fetchList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row); // copy obj
      this.form.time = new Date();
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    updateData() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateTransaction(this.form._id, this.form).then(() => {
            const index = this.list.findIndex(v => v._id === this.form._id);
            this.list.splice(index, 1, this.form);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm(`是否确定删除标题"${row.title}"?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTransaction(row._id);
          this.list.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      Vue.set(this.listQuery, "limit", val);
      this.fetchList();
    },
    handleCurrentChange(val) {
      const { limit } = this.listQuery;
      const pagePass = limit * (val - 1);
      const smaller = limit * val < this.total ? limit * val : this.total;
      this.list = [...this.temList].slice(pagePass, smaller);
    }
  }
};
</script>

<style lang="scss" scoped>
.options-container {
  margin: 2rem 0 1rem 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.el-table {
  margin: 0rem 2rem 2rem 2rem;
  width: calc(100% - 4rem);
}
.pagination{
  text-align: center;
}
</style>

