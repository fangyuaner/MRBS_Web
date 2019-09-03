<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.realname" placeholder="用户名/姓名" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" align="center">
        </el-table-column>
        <el-table-column prop="realname" label="姓名"  align="center">
        </el-table-column>
        <el-table-column prop="username" label="账号"  align="center">
        </el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="formatSex"  align="center">
        </el-table-column>
        <el-table-column prop="grade" label="班级"  align="center">
        </el-table-column>
        <el-table-column prop="statu" label="身份" :formatter="formatStatu"  align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"  align="center">
        </el-table-column>
        <el-table-column prop="phone" label="联系方式"  align="center">
        </el-table-column>
       <!-- <el-table-column
          fixed="right"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="text" size="small"></el-button>
            <el-button icon="el-icon-delete" type="text" size="small"></el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <div style="margin-left: 1150px">
        <div style="margin-left:-90px;margin-top: 30px;
">共{{total}}条数据</div>
        <div style="margin-top: -25px"><el-pagination
                       layout="prev, pager, next"
                       :total="total"
                       :page-size="limit"
                       :current-page.sync="pageinfo"
        >
        </el-pagination></div>
      </div>



    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_user';

  export default {
    data() {
      return {
        pageinfo:{},
        filters: {
          realname: ''
        },
        loading: true,
        users: [],
        total: 0,
        page: 1,
        limit: 5
      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      //身份
      formatStatu: function (row, column) {
        return row.statu == 0 ? '老师' : row.statu == 1 ? '学生' : '管理员';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch(){
        this.total = 0;
        this.page = this.pageinfo;
        this.search();
      },
      //获取用户列表
      search: function () {
        let that = this;
        let params = {
          page: that.pageinfo,
          limit: 5,
          realname: that.filters.realname
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;

          if (result) {
            that.total = result.total;
            that.users = result.items;
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      }
    },
    //当 当前vue组件加载时，会运行mounted，mounted中调用handleSearch方法
    mounted() {
      this.handleSearch()
    },
     watch:{
       pageinfo:{
         deep:true,
         handler(){
           this.search()
         }

       }
     }

  }
</script>

<style scoped>

</style>
