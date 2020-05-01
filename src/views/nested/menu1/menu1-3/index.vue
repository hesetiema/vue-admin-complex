<template>
  <div class="container">
    <el-form :model="form" label-position="left" label-width="100px" class="form">
      <div style="font-size:20px">新增用户</div>
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="介绍">
        <el-input v-model="form.introduction"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-input v-model="form.avatar" />
      </el-form-item>
      <el-form-item label="角色">
        <el-checkbox-group v-model="form.roles">
          <el-checkbox label="Admin"></el-checkbox>
          <el-checkbox label="Editor"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-button type="primary" @click="addUser">确认</el-button>
    </el-form>

    <el-table :data="list">
      <el-table-column label="昵称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="{row}">
          <span>{{ row.roles[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="danger" icon="el-icon-delete" @click="deleteUser(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { createUser, getUserList, deleteUser } from "@/api/user.js";
export default {
  data() {
    return {
      temList: null,
      list: null,
      form: {
        username: "",
        password: "",
        name: "",
        introduction: "",
        avatar: "",
        roles: []
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetForm() {
      this.form = {
        username: "",
        password: "",
        name: "",
        introduction: "",
        avatar: "",
        roles: []
      };
    },
    addUser() {
      createUser(this.form).then(res => {
        const { row } = res.data;
        if (row) {
          this.$message({
            message: "新建用户成功",
            type: "success"
          });
        }
        this.resetForm()
        this.getList()
      })
        .catch(err => {
          throw err
        });
    },
    async getList() {
      await getUserList()
        .then(res => {
          const {data} = res.data;
          // eslint-disable-next-line
          console.log(data)
          this.list = [...data];
        })
        .catch(err => {
          throw err
        });
    },
    deleteUser(row, index) {
      this.$confirm(`此操作将永久删除用户${row.username}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteUser(row.username)
            .then(() => {
              this.list.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;

  .form {
    margin-bottom: 2rem;
  }
}
</style>>
