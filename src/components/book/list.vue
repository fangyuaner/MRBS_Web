<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>会议场馆管理</el-breadcrumb-item>
        <el-breadcrumb-item>会议场馆列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.roomname" placeholder="会议场馆名称" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="books" highlight-cFurrent-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="[会议场馆简介]">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!--<el-table-column prop="id" label="ID" width="80" align="center" ></el-table-column>-->
        <el-table-column prop="roomname" label="会议馆场名称" align="center" width="300"></el-table-column>
        <el-table-column prop="roomnum" label="会议馆场编号" align="center" width="200"></el-table-column>
        <el-table-column prop="capacity" label="容量" align="center" width="200"></el-table-column>
        <el-table-column prop="address" label="地址" align="center" width="320"></el-table-column>
        <!--<el-table-column prop="description" label="描述" ></el-table-column>-->
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div style="margin-left: 1150px">
        <div style="margin-left:-90px;margin-top: 30px;
">共{{total}}条数据
        </div>
        <div style="margin-top: -25px">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="limit"
            :current-page.sync="pageinfo"
          >
          </el-pagination>
        </div>
      </div>

      <!--工具条-->
      <el-col :span="24" class="toolbar" style="margin-top: -40px">
        <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>

      </el-col>

      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="名称" prop="roomname">
            <el-input v-model="editForm.roomname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="roomnum">
            <el-input v-model="editForm.roomnum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="容量" prop="capacity">
            <el-input v-model="editForm.capacity" auto-complete="off" type="number"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="editForm.address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" v-model="editForm.description" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="名称" prop="roomname">
            <el-input v-model="addForm.roomname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="roomnum">
            <el-input v-model="addForm.roomnum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="容量" prop="capacity">
            <el-input v-model="addForm.capacity" auto-complete="off" type="number"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="addForm.address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" v-model="addForm.description" :rows="8"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import API from '../../api/api_book';

  export default {
    data() {
      return {
        pageinfo: {},
        filters: {
          roomname: ''
        },
        books: [],
        total: 0,
        page: 1,
        limit: 6,
        loading: false,
        sels: [], //列表选中列

        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          roomname: [
            {required: true, message: '请输入会议场馆名称', trigger: 'blur'}
          ],
          roomnum: [
            {required: true, message: '请输入会议场馆编号', trigger: 'blur'}
          ],
          capacity: [
            {required: true, message: '请输入容量,必须为数字值', trigger: 'blur'},
          ],
          address: [
            {required: true, message: '请输入地址', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'}
          ]
        },
        editForm: {
          id: '',
          roomname: '',
          roomnum: '',
          capacity: '',
          address: '',
          description: '',
          username: this.$store.state.user,
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          roomname: [
            {required: true, message: '请输入会议场馆名称', trigger: 'blur'}
          ],
          roomnum: [
            {required: true, message: '请输入会议场馆编号', trigger: 'blur'}
          ],
          capacity: [
            {required: true, message: '请输入容量,数量必须为数字值', trigger: 'blur'},
          ],
          address: [
            {required: true, message: '请输入地址', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'}
          ]
        },
        addForm: {
          roomname: '',
          roomnum: '',
          capacity: '',
          address: '',
          description: '',
          username: this.$store.state.user,   //账号
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch() {
        // this.page = this.pageinfo;
        this.search();
      },
      search() {
        let that = this;
        let params = {
          page: that.pageinfo,
          limit: that.limit,
          roomname: that.filters.roomname
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result) {
            that.total = result.total;
            that.books = result.items;

          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //删除
      delBook: function (index, row) {
        let that = this;
        let para = {
          id: row.id,
          username: this.$store.state.user
        }
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          API.remove(para).then(function (result) {
            if (result && result.flag) {
              that.loading = false;
              that.$message.success({showClose: true, message: result.message, duration: 1500});
              that.search();
            } else {
              that.loading = false;
              that.$message.error({showClose: true, message: result.message, duration: 1500});
              that.search();
            }

          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {
        });
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.$set(this.editForm,'username',this.$store.state.user)
        // this.editForm.append('username',this.$store.state.user)
        console.log(this.editForm)
      },
      //编辑
      editSubmit: function () {
        let that = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let para = Object.assign({}, this.editForm);
            // para.append('username',this.$store.state.user)
            API.update(para).then(function (result) {
              if (result && result.flag) {

                that.loading = false;
                that.$message.success({showClose: true, message: result.message, duration: 2000});
                that.$refs['editForm'].resetFields();
                that.editFormVisible = false;
                that.search();
              } else {
                that.$message.error({showClose: true, message: result.message, duration: 2000});
                that.$refs['editForm'].resetFields();
                that.editFormVisible = false;
                that.search();
              }
            });
          }
        });
      },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          roomname: '',
          roomnum: '',
          capacity: '',
          address: '',
          description: '',
          username: this.$store.state.user,   //账号
        };
      },
      //新增
      addSubmit: function () {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            // let para = Object.assign({}, this.addForm);
            let para = that.addForm;
            console.log(para)
            API.add(para).then(function (result) {
              console.log(result);
              if (result && result.flag) {
                that.loading = false;
                that.$message.success({showClose: true, message: result.message, duration: 2000});
                that.$refs['addForm'].resetFields();
                that.addFormVisible = false;
                that.search();
              } else {
                that.loading = false;
                that.$message.error({showClose: true, message: result.message, duration: 2000});
                that.$refs['addForm'].resetFields();
                that.search();
              }
            });
          }
        });
      },
      //批量删除
      batchDeleteBook: function () {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        let params = {
          ids,
          username: this.$store.state.user,
        }
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          API.removeBatch(params).then(function (result) {
            that.loading = false;
            if (result && result.flag) {
              that.$message.success({showClose: true, message: result.message, duration: 1500});
              that.search();
            } else {
              that.$message.error({showClose: true, message: result.message, duration: 1500});
              that.search();
            }
          });
        });
      }
    },
    mounted() {
      this.handleSearch()
      // this.$set(this.editForm,'username',this.$store.state.user)
      // console.log("lalalalala",this.editForm)
    },
    watch: {
      pageinfo: {
        deep: true,
        handler() {
          this.search()
        }
      }
    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
</style>
