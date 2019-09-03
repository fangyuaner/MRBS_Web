<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum" :loading="loading">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="realname" label="姓名">
          <el-input v-model="form.realname"></el-input>
        </el-form-item>
        <el-form-item prop="username" label="用户名" v-if="false">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别" >
        <el-select v-model="form.sex" placeholder="性别" style="width: 100%" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item prop="grade" label="班级">
          <el-input v-model="form.grade"></el-input>
        </el-form-item>
       <el-form-item prop="statu" label="身份" >
          <el-select v-model="form.statu" placeholder="身份" style="width: 100%" >
            <el-option
              v-for="item in options1"
              :key="item.value1"
              :label="item.label1"
              :value="item.value1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveProfile">修改并保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
  import API from '../../api/api_user';
  import {bus} from '../../bus.js'

  export default {
    data() {
      return {
        loading: false,
        options: [{
          value: '0',
          label: '女'
        }, {
          value: '1',
          label: '男'
        }],
        options1: [{
          value1: '0',
          label1: '老师'
        }, {
          value1: '1',
          label1: '学生'
        }],
        sex:'',
        statu:'',
        form: {
          id: '',
          username:  this.$store.state.user,   //账号
          realname: '',   //真实姓名
          password: '',
          phone: '',      //电话
          email: '',      //邮箱
          grade: '',        //班级
          statu: '',
          sex: ''
        },
        rules: {
          realname: [
            {
              required: true,
              message: '请输入真实姓名',
              trigger: 'blur'
            },
          ],
          email: [{
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          phone: [
            {
              required: true,
              pattern: /^1[34578]\d{9}$/,//可以写正则表达式呦呦呦
              message: '目前只支持中国大陆的手机号码',
              trigger: 'blur'
            }
          ],
          grade: [{
            required: true,
            message: '请输入班级名称',
            trigger: 'blur'
          }],
          sex: [{
            required: true,
            message: '',
            trigger: 'blur'
          }],
          statu: [{
            required: true,
            message: '',
            trigger: 'blur'
          }],
        }
      }
    },
    methods: {
      handleSaveProfile() {
        let that = this;
        that.$refs.form.validate((valid) => {
          if (valid) {
            that.loading = true;
            let args = {
              id: that.form.id,
              realname: that.form.realname,
              username: that.form.username,
              password : that.form.password,
              sex: that.form.sex,
              email: that.form.email,
              phone: that.form.phone,
              grade: that.form.grade,
              statu: that.form.statu
            };
            API.changeProfile(args).then(function (result) {
              that.loading = false;
              if (result && result.flag){
                that.$message.success({showClose: true, message: result.message, duration: 2000});
                that.query();
              }
            })

            // API.changeProfile(args).then(function (result) {
            //     that.loading = false;
            //     if (result && result.flag) {
            //       //修改成功
            //       let user = JSON.parse(window.sessionStorage.getItem('user'));
            //       user.realname = that.form.realname;
            //       user.phone = that.form.phone;
            //       user.email = that.form.email;
            //       user.grade = that.form.grade;
            //       sessionStorage.setItem('user', JSON.stringify(user));
            //       bus.$emit('setRealName', that.form.realname);
            //       that.$message.success({showClose: true, message: result.message, duration: 2000});
            //     } else {
            //       that.$message.error({showClose: true, message: result.message, duration: 2000});
            //     }
            //   }
            //   , function (err) {
            //     that.loading = false;
            //     that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            //   }).catch(function (error) {
            //     that.loading = false;
            //     console.log(error);
            //     that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            //   }
            // );
          }
        });
      },
      query(){
        let that = this;
        let param = {
          username: that.form.username,
        };
        API.queryProfile(param).then(function (result) {
          if (result) {
            that.form.id = result.id;
            that.form.username = result.username;
            that.form.realname = result.realname;
            that.form.password = result.password;
            that.form.sex = result.sex ,
            that.form.statu = result.statu;
            that.form.email = result.email;
            that.form.phone = result.phone;
            that.form.grade = result.grade;
          }
        })
      }
    },
    mounted() {
      this.query();
    }
  }
</script>
