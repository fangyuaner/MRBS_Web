import * as API from './'

export default {
  //注册
 register: params =>{
   return API.POST('/api/v1/register',params)
 } ,
  //用户名检查
  check: param =>{
   return API.PUT('/api/v1/register/check',param)
 }

}
