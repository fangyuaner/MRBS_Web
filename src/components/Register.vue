<template>
  <el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-position="left" label-width="0"
           class="demo-ruleForm login-container">
    <h3 class="title">用户注册</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model.lazy="registerForm.username" auto-complete="off" placeholder="用户名"
                @blur="nameCheck"></el-input><!-- @blur="handleBlur" id="Name"-->
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="confirmPwd">
      <el-input type="password" v-model="registerForm.confirmPwd" auto-complete="off" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-form-item prop="realname">
      <el-input type="text" v-model="registerForm.realname" auto-complete="off" placeholder="真实姓名"></el-input>
    </el-form-item>

    <el-form-item prop="sex">
      <el-select v-model="registerForm.sex" placeholder="性别" style="width: 100%">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="grade">
      <el-input type="text" v-model="registerForm.grade" auto-complete="off" placeholder="班级"></el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input type="text" v-model="registerForm.email" auto-complete="off" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input type="text" v-model="registerForm.phone" auto-complete="off" placeholder="联系方式"></el-input>
    </el-form-item>
    <el-form-item prop="statu">
      <el-select v-model="registerForm.statu" placeholder="身份" style="width: 100%">
        <el-option
          v-for="item in options1"
          :key="item.value1"
          :label="item.label1"
          :value="item.value1">
        </el-option>
      </el-select>
    </el-form-item>
    <el-button type="text" style="margin-left: 230px" @click.native.prevent="ToLogin">已有账号，去登录</el-button>

    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="registerSubmit" :loading="loading">注册
      </el-button>
    </el-form-item>

    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="resetForm('registerForm')"
                 :loading="loading">重置
      </el-button>
    </el-form-item>


  </el-form>
</template>

<script>
  import API from '../api/api_register';

  export default {
    data() {

      var validatePass = (rules, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'));
        } else if (value.toString().length < 5 || value.toString().length > 18) {
          callback(new Error('密码长度为5 - 18个字符'))
        } else {
          callback();
        }
      };
      var validatePass2 = (rules, value, callback) => {
        if (this.registerForm.password === '') {
          callback(new Error('请先创建新密码'));
        } else if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
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
        sex: '',
        statu: '',
        username: '',
        registerForm: {
          username: '',
          password: '',
          confirmPwd: '',
          realname: '',
          sex: '',
          grade: '',
          email: '',
          phone: '',
          statu: ''
        },
        registerRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          password: [
            {
              required: true, trigger: 'blur', validator: validatePass,
            },
          ],
          confirmPwd: [
            {
              required: true, validator: validatePass2, trigger: 'blur',
            },
          ],
          realname: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'blur'},
          ],
          grade: [
            {required: true, message: '请输入班级', trigger: 'blur'},
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
          statu: [
            {required: true, message: '请选择身份', trigger: 'blur'},
          ]
        }
      };
    },

    methods: {
      /*  handleBlur() {
          //this.$emit('blur', event);  // 触发 blur 事件
          this.nameCheck();
          //this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);  // 向父组件派发 el.form.blur 事件
        },*/

      ToLogin() {
        let that = this;
        that.$router.push({path: '/login'});
      },
      registerSubmit: function () {
        let that = this;
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let para = this.registerForm;
            API.register(para).then(function () {
              that.loading = false;
              that.$message.success({showClose: true, message: '注册成功', duration: 2000});
              that.$refs['registerForm'].resetFields();
              that.ToLogin();
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }
        });
      },
      resetForm(registerForm) {
        let that = this;
        that.$refs[registerForm].resetFields()
      },
      nameCheck() {
        let that = this;
        const param = new URLSearchParams();
        if(that.registerForm.username != ""){
        param.append("username", that.registerForm.username),
          API.check(param).then(function (result) {
            if (result && result.flag) {
              that.$message.error({showClose: true, message: result.message, duration: 2000});
            } else {
              that.$message.success({showClose: true, message: result.message, duration: 2000});
            }
          })
        }
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
