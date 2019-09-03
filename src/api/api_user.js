import * as API from './'

export default {
  //登录
  login: params => {
    return API.POST('/api/v1/users/login', params)
  },
 /* //登出
  logout: params => {
    return API.GET('/api/v1/users/logout', params)
  },*/
  //修改个人信息
  changeProfile: params => {
    return API.PATCH('/api/v1/users/profile', params)
  },
  //查询个人信息
  queryProfile: param => {
    return API.GET('/api/v1/users/query', param)
  },
  //修改密码
  changePwd: params => {
    return API.PUT('/api/v1/users/changePwd', params)
  },

  //查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/users', params)
  },
}
