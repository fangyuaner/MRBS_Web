import * as API from './'

export default {

  //查询获取order列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/order', params)
  },

  //查询获取一条order信息
  findById: id => {
    return API.GET(`/api/v1/order/${id}`)
  },

  //order申请
  add: params => {
    return API.POST(`/api/v1/order`, params)
  },
  update: (params) => {
    return API.PUT(`/api/v1/order/`, params)
  },

  //单个删除order
  remove: para => {
    return API.DELETE(`/api/v1/order/delete`,para)
  },

  //批量删除，传ids数组
  removeBatch: (params) => {
    return API.DELETE(`/api/v1/order/batch`,params)
  },
  //查询所有Room的statu和roomname
   findRoomName:(params) =>{
     return API.GET(`/api/v1/order/findRoomName`,params)
   }

}
