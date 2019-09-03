<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>预约管理</el-breadcrumb-item>
        <el-breadcrumb-item>会议场馆预约</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">

      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.roomname" placeholder="会议室名称" @keyup.enter.native="handleSearch"></el-input>
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
      <el-table :data="orders" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="[会议描述]">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!--<el-table-column prop="id" label="ID" width="80" align="center" ></el-table-column>-->
        <el-table-column prop="meettingname" label="会议名称" align="center"></el-table-column>
        <el-table-column prop="roomname" label="举办场所" align="center"></el-table-column>
        <el-table-column prop="username" label="申请人" align="center"></el-table-column>
        <el-table-column prop="capacity" label="人数" align="center"></el-table-column>
        <el-table-column prop="createTime" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
        <el-table-column prop="statu" label="会议状态" align="center" :formatter="formatStatu"></el-table-column>
        <!--<el-table-column prop="description" label="描述" ></el-table-column>-->
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页条-->
      <div style="margin-left: 1300px">
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
          <el-form-item label="名称" prop="meettingname">
            <el-input v-model="editForm.meettingname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人数" prop="capacity">
            <el-input v-model="editForm.capacity" auto-complete="off" type="number"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="createTime">

            <el-date-picker
              style="width: 100%"
              v-model="editForm.createTime"
              type="datetime"
              placeholder="日期时间"
              align="right"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              style="width: 100%"
              v-model="editForm.endTime"
              type="datetime"
              placeholder="日期时间"
              align="right"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="简介" prop="description">
            <el-input type="textarea" v-model="editForm.description" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">保存</el-button>
        </div>
      </el-dialog>

      <!--预约界面-->
      <el-dialog title="预约" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-position="top" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="申请人" prop="username">
            <el-input v-model="addForm.username" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="会议名称" prop="meettingname">
            <el-input v-model="addForm.meettingname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="人数" prop="capacity">
            <el-input v-model.number="addForm.capacity" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="目标会议室" prop="roomname">
            <el-select
              style="width: 100%;"
              v-model="addForm.roomId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getRoomName"
              :loading="loading">
              <el-option-group
                v-for="(val, key)  in Options"
                :key="key"
                :label="key">
                <!--//value 是指roomname   key 指id-->
                <el-option
                  v-for="item in val"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间" prop="createTime">

            <el-date-picker
              style="width: 100%"
              v-model="addForm.createTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              style="width: 100%"
              v-model="addForm.endTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions2">
            </el-date-picker>
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
  import API from '../../api/api_order';

  export default {
    data() {
      return {

        seledctModel: [],
        multipleSelectOption: [],
        filters: {
          meettingname: ''
        },
        Options: [/*{
          key: '',
          label: '小型会议室',
          options: [{
            value: '',
            label: ''   //从数据库中查寻statu = 0 的room ，将拿么循环放着
          }]
        }, {
          label: '中型会议室',
          options: [{
            value: '',
            label: ''
          }]
        }, {
          label: '大型会议室',
          options: [{
            value: '',
            label: ''
          }]
        }, {
          label: '超大型会议室',
          options: [{
            value: '',
            label: ''
          }]
        }*/
        ],
        //value: [],
        loading: false,

        pickerOptions1: {},
        pickerOptions2: {},
        orders: [],
        total: 0,
        page: 1,
        limit: 3,
        loading: false,
        sels: [], //列表选中列
        pageinfo: {},


        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          create_time: [{
            type: 'date',
            required: true,
            trigger: 'change'
          }],
          end_time: [{
            type: 'date',
            required: true,
            trigger: 'change'
          }]

        },
        editForm: {
          id: '',
          meettingname: '',
          capacity: '',
          //roomname: '',
          createTime: '',
          endTime: '',
          description: ''
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addForm: {
          meettingname: '',
          roomId: '',
          roomname:'',
          username: this.$store.state.user,   //账号
          capacity: '',
          createTime: '',
          endTime: '',
          description: '',
        },
        addFormRules: {
          meettingname: [
            {required: true, message: '请输入会议名称', trigger: 'blur'}
          ],
          capacity: [
            {required: true, message: '请输入会议参与人数'},
            {
              type: 'number',
              message: '数量必须为数字值'
            },
          ],

        }
      }
    },
    methods: {
      //性别显示转换
      formatStatu: function (row, column) {
        return row.statu == 0 ? '会议未开始' : row.statu == 1 ? '会议进行中' : row.statu == 2 ? '会议结束' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch() {
        this.total = 0;
        this.page = this.pageinfo;
        this.search();
      },
      search() {
        let that = this;
        let params = {
          page: that.pageinfo,
          limit:3,
          meettingname: that.filters.meettingname
        };
        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result) {
            that.total = result.total;
            that.orders = result.items;
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
            that.loading = false;
            if (result && result.encode == 0) {
              that.loading = false;
              that.$message.success({showClose: true, message: result.message, duration: 1500});
              that.search();
            } else if (result && result.encode == 1) {
              that.loading = false;
              that.$message.error({showClose: true, message: result.message, duration: 1500});
              that.search();
            } else {
              that.loading = false;
              that.$message.error({showClose: true, message: result.message, duration: 1500});
              that.search();
            }
          });
        });
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.$set(this.editForm, 'name', this.$store.state.user)
      },
      //编辑
      editSubmit: function () {
        let that = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let para = Object.assign({}, this.editForm);
            para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd hh:mm:ss');
            para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime), 'yyyy-MM-dd hh:mm:ss');
            API.update(para).then(function (result) {
                // console.log(result)
                that.loading = false;
                if (result && result.encode == 0) {
                  that.$message.success({showClose: true, message: result.message, duration: 2000});
                  that.editFormVisible = false;
                  that.search();
                } else if (result.encode == 1) {
                  that.$message.error({showClose: true, message: result.message, duration: 2000});
                  that.editFormVisible = false;
                  that.search();
                } else if (result.encode == 2) {
                  that.$message.success({showClose: true, message: result.message, duration: 2000});
                  that.editFormVisible = false;
                  that.search();
                } else {
                  that.$message.error({showClose: true, message: result.message, duration: 2000});
                  that.editFormVisible = false;
                  that.search();
                }

              }
            );
          }
        });
      },
      showAddDialog: function () {

        this.addFormVisible = true;
        this.addForm = {
          meettingname: '',
          roomId: '',
          username: this.$store.state.user,   //账号
          capacity: '',
          createTime: '',
          endTime: '',
          description: '',
        };
      },
      //新增
      addSubmit: function () {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            //const para = new URLSearchParams();
            let para = Object.assign({}, this.addForm);
            para.createTime = (!para.createTime || para.createTime == '') ? '' : util.formatDate.format(new Date(para.createTime), 'yyyy-MM-dd hh:mm:ss');
            para.endTime = (!para.endTime || para.endTime == '') ? '' : util.formatDate.format(new Date(para.endTime), 'yyyy-MM-dd hh:mm:ss');
            API.add(para).then(function (result) {
              that.loading = false;
              if (result && result.encode ==0) {
                that.$message.success({showClose: true, message: result.message, duration: 2000});
                that.addFormVisible = false;
                that.search();
              } else if (result && result.encode ==1){
                that.$message.error({showClose: true, message: result.message, duration: 2000});
                that.addFormVisible = false;
                that.search();
              }else if (result && result.encode ==1){
                that.$message.success({showClose: true, message: result.message, duration: 2000});
                that.addFormVisible = false;
                that.search();
              }else {
                that.$message.error({showClose: true, message: result.message, duration: 2000});
                that.addFormVisible = false;
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
            if (result && result.flag) {

              that.loading = false;
              that.$message.success({showClose: true, message: result.message, duration: 1500});
              that.search();
            } else {
              that.loading = false;
              that.$message.error({showClose: true, message: result.message, duration: 1500});
              that.search();
            }

          })
        });
      }
      ,//从数据库中查询所有的roomname，并依据room表的statu分类向前传递  ，并在页面加载时就完成该方法的执行

      getRoomName(query) {
        let that = this;
        let para = {
          roomname: query
        }
        API.findRoomName(para).then(function (result) {
          that.Options = result.map;
        })
      },
    },
    mounted() {
      this.handleSearch()
      //this.getRoomName()
      // this.transMultipleSelectOprion()
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

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
</style>
