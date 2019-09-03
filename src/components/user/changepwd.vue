<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="myForm" :model="Pwdform" :rules="rules" label-width="120px">
        <el-form-item prop="oldPwd" label="原密码">
          <el-input v-model="Pwdform.oldPwd"></el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码">
          <el-input type="password" v-model="Pwdform.newPwd"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPwd" label="确认新密码">
          <el-input type="password" v-model="Pwdform.confirmPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleChangepwd" :loading="loading">提交</el-button>
          <el-button @click="resetForm('myForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
  import API from '../../api/api_user';

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
        if (this.Pwdform.oldPwd === ''){
          callback(new Error('请先创建新密码'));
        } else if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.Pwdform.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        Pwdform: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: '',
          username: this.$store.state.user,   //账号
        },
        rules: {
          oldPwd: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          newPwd: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
          confirmPwd: [{
            required: true,
            validator: validatePass2,
          }],
        }
      }
    },
    methods: {
      handleChangepwd() {
        let that = this;
        this.$refs.myForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            const params = new URLSearchParams();
            params.append("username", that.Pwdform.username),
              params.append("oldPwd", that.Pwdform.oldPwd),
              params.append("newPwd", that.Pwdform.newPwd),

              //console.log(params);
              API.changePwd(params)
                .then(function (result) {
                  console.log(result && result.flag);
                  if (result && result.flag) {
                    that.$message.success({showClose: true, message: result.message, duration: 2000});
                    that.$refs['myForm'].resetFields();
                    that.loading = false;
                  } else {

                    that.loading = false;
                    that.$message.success({showClose: true, message: result.message, duration: 2000});

                    that.$refs['myForm'].resetFields()
                  }
                })
          }
        })
      },
      resetForm(Pwdform) {
        let that = this;
        that.$refs[Pwdform].resetFields()
      }
    }
  }
</script>
