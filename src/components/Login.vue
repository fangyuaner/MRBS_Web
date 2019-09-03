<template>
  <el-form ref="userForm" :model="userForm" :rules="rules" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">用户登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="userForm.username" auto-complete="off" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="userForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>

    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-button type="text" style="margin-left: 130px" @click.native.prevent="Toregister">没有账号？去注册</el-button>

    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="loading">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import API from '../api/api_user';
  // import API from 'server/controllers/user.js';
  export default {
    name: 'login',
    data() {
      return {
        loading: false,
        Result: {},
        userForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            //{ validator: validaePass }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      //先在前端判断用户名密码是否为空
      handleLogin: function () {
        let that = this;
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let para = this.userForm;

            /* utils.axiosMethod({
               method:"POST",
               url:"/api/v1/users/login",
               data:this.loginData,
               callback:success
             })*/

            API.login(para).then(function (result) {
                if (result && result.flag) {
                  that.loading = false;
                  that.$message.success({showClose: true, message: result.message, duration: 2000});
                  // console.log(that.userForm.username)
                  that.$store.commit('setUser',{'user':that.userForm.username});

                  that.$router.push({path: '/dashboard'});

                } else {
                  that.loading = false;
                  that.$message.error({showClose: true, message: result.message, duration: 2000});

                }
              }
              // },function (result) {
              //   if (result){}
              //   that.loading = false;
              //   that.$message.error({showClose: true, message: err.toString(), duration: 2000});
              // }).catch(function (error) {
              //   that.loading = false;
              //   console.log(error);
              //   that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
              // }
            );
          }
        });


      },
      Toregister() {
        let that = this;

        that.$router.push({path: '/register'});
      }
    }
  }
</script>
<style>
  body {
    background: #DFE9FB;
  }
</style>
<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 160px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    background: -ms-linear-gradient(top, #ace, #00C1DE); /* IE 10 */
    background: -moz-linear-gradient(top, #ace, #00C1DE); /*火狐*/
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ace), to(#00C1DE)); /*谷歌*/
    background: -webkit-linear-gradient(top, #ace, #00C1DE); /*Safari5.1 Chrome 10+*/
    background: -o-linear-gradient(top, #ace, #00C1DE); /*Opera 11.10+*/

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
