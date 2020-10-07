
let _interface = require('../../utils/interface.js')
import Ajax from "../../libs/Ajax.js";
import Tool from "../../libs/Tool.js";
import { User } from "../../model/user.js"
//初始化事件
export const initData = function(cb){
  this.selectArr = [];
  
  let { timeList } = this.data;
  let _new_arr = []
  timeList.map(item => {
    var obj = {
      ...item
    }
    _new_arr.push(obj)

  })
  timeList.forEach((item, _index) => {
    if (item.status != 0 && item.status != 5) {
      if (_new_arr[_index + 1] && _new_arr[_index + 1].status == 0) {
        _new_arr[_index + 1].status = 3
      }
      if (_index !== 0 && _new_arr[_index - 1].status == 0 && item.status != 5) {
        _new_arr[_index - 1].status = 3
      }

    }
  })

  this.setData({
    timeList: _new_arr
  },()=>{
    if (!this.dayArr[this._key_]) {
      this.dayArr[this._key_] = new TimeObj();
    }
    this.dayArr[this._key_].newArr = _new_arr;
    this.dayArr[this._key_].componentObj = this
    this.dayArr[this._key_]._updata()
    this.properties.selectTimeCb()


    cb && cb()

    console.log(this.dayArr)
  })
  console.log(_new_arr)
}
export const initData2 = function (timeList){
  let _new_arr = []
  timeList.map(item => {
    var obj = {
      ...item
    }
    _new_arr.push(obj)

  })
  timeList.forEach((item, _index) => {
    if (item.status != 0 && item.status != 5) {
      if (_new_arr[_index + 1] && _new_arr[_index + 1].status == 0 ) {
        _new_arr[_index + 1].status = 3
      }
      if (_index !== 0 && _new_arr[_index - 1].status == 0 && item.status != 5) {
        _new_arr[_index - 1].status = 3
      }
    }
  })

  return _new_arr
}

//已选择时间
export const selectList=function(list){
  console.log(this.currentMonth)  
  let { day } =this.currentMonth;
  let start = 0;
  let end = 0;
  if(list.length>1)
  {
    start =list[0].start;
    end = list[list.length-1].start+1;
    return {
      day: day,
      list,
      time: `${day} ${start < 10 ? '0' + start : start}:00至${end < 10 ? '0' + end : end}:00`,
      sendTime: `${day} ${start < 10 ? '0' + start : start}:00-${end < 10 ? '0' + end : end}:00`
    }
  }
  else if(list.length==1)
  {
    start = list[0].start;
    end = start+1
    return {
      day: day,
      list,
      time: `${day} ${start < 10 ? '0' + start : start}:00至${end < 10 ? '0' + end : end}:00`,
      sendTime: `${day} ${start < 10 ? '0' + start : start}:00-${end < 10 ? '0' + end : end}:00`
    }
  }
  return {}

}
export const selectList2 = function (list,month) {
  console.log(month)
  let { day } = month;
  let start = 0;
  let end = 0;
  if (list.length > 1) {
    start = list[0].start;
    end = list[list.length - 1].start + 1;
    return {
      day: day,
      list,
      time: `${day} ${start < 10 ? '0' + start : start}:00至${end < 10 ? '0' + end : end}:00`,
      sendTime: `${day} ${start < 10 ? '0' + start : start}:00-${end < 10 ? '0' + end : end}:00`
    }
  }
  else if (list.length == 1) {
    start = list[0].start;
    end = start + 1
    return {
      day: day,
      list,
      time: `${day} ${start < 10 ? '0' + start : start}:00至${end < 10 ? '0' + end : end}:00`,
      sendTime: `${day} ${start < 10 ? '0' + start : start}:00-${end < 10 ? '0' + end : end}:00`
    }
  }
  return {}

}
//测试
export const testData = function () {
  let list = [
    {
      start: 8,
      status: 9,//0 可选,1 爆,2
      opacity: 'rgba(168, 123, 90, 0.2)' // '#a87b5a20',
    },
    {
      start: 9,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.05)'// '#a87b5a05',
    },
    {
      start: 10,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.2)',
    },
    {
      start: 11,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.05)'
    },


    {
      start: 12,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.05)'
    },
    {
      start: 13,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.2)',
    },
    {
      start: 14,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.05)'
    },
    {
      start: 15,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.2)',
    },


    {
      start: 16,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.2)'
    },
    {
      start: 17,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.05)'
    },
    {
      start: 18,
      status: 9,//0,1,2
      opacity: 'rgba(168, 123, 90, 0.2)'
    },
    {
      start: 19,
      status: 9,//0,1
      opacity: 'rgba(168, 123, 90, 0.05)'
    },

  ]

  list.forEach(item => {
    item.status = Math.random() > 0.5 ? 5 : 5
  })
  return list;
}
//生成联系时间
export const getTimeList = function () {
  let start = this.selectArr[0];
  let end = this.selectArr[1];
  
  var arr = []
  if (this.selectArr.length == 2) {
    for (var i = start; i <= end; i++) {
      arr.push(i)
    }
  }
  
  return arr
}
//判断是否合法
export const isOk= function (_arr) {
  let { timeList } = this.data;

  var flag = true
  timeList.forEach((item, _index) => {
    if (_arr.includes(item.start)) {

      if (item.status != 0) {
        flag = false
      }

    }
  })
  return flag
}
//判断已选择时间
export const isUseTime = function(){
  let useTime=0
  for (let key in this.dayArr) {
    if (this.dayArr[key].lastTime.time) {
      this.dayArr[key].lastTime.list.forEach(item => {
        useTime += 1
      })
    }
  }
  return useTime

}

//选择时间对象
class TimeObj
{
  constructor(){
    this.times={};//初次选择
    this.lastTime={};//最后一次选择
    this.newArr=[];
    this.componentObj = {};//组件实例
    // this.selectArr=[];//已选择时间区间
  }
  set selectTime(val){
    this.times = val;
    this._updata()
  }
  get selectTime(){
    return this.times
  }
  _updata(){
    let _new_arr = this.newArr;
    let that = this.componentObj;
    let { list } = this.times;
    console.log('list', list)
    if (!list) return
    let arr = [];
    list.forEach(child => {
      arr.push(child.start)
    })
    if (list && this.times.list.length) {
      _new_arr.forEach(item => {
        if (arr.includes(item.start) && item.status == 0) {
          item.selected = true
        }
        else {
          item.selected = false
        }
      })
      //  console.log(_new_arr)
      //cb && cb(_new_arr)
      that.setData({
        timeList: _new_arr
      })
      this.lastTime = selectList.bind(that)(_new_arr.filter(item => item.selected));
      console.log('times', this.lastTime)

    }
    //更新已使用时间
    this.componentObj.isSelectTime = isUseTime.bind(this.componentObj)();
  }
  update(_new_arr,cb,that){
   
    let { list } = this.times;
    console.log('list',list)
    if(!list) return
    let arr =[];
    list.forEach(child => {
      arr.push(child.start)
    })
    if (list && this.times.list.length)
    {
      _new_arr.forEach(item=>{
        if (arr.includes(item.start) && item.status == 0)
        {
          item.selected = true
        }
        else
        {
          item.selected = false
        }
      })
      //  console.log(_new_arr)
      cb && cb(_new_arr)
      this.lastTime = selectList.bind(that)(_new_arr.filter(item => item.selected));
      console.log('times', this.lastTime)
     
    }
  }
  update2(_new_arr, list ,cb, that){
    
    console.log('list', list)
    if (!list) return
    let arr = [];
    list.forEach(child => {
      arr.push(child.start)
    })
    if (list && list.length) {
      _new_arr.forEach(item => {
        if (arr.includes(item.start) && item.status == 0) {
          item.selected = true
        }
        else {
          item.selected = false
        }
      })
     
      cb && cb(_new_arr)
      this.componentObj.isSelectTime = isUseTime.bind(this.componentObj)();
      //this.lastTime = selectList.bind(that)(_new_arr.filter(item => item.selected));
      console.log('times', this.lastTime)
    }
  }
}
export const _timeList_ = TimeObj




//获取老师时间
export function getTimes(month,cb,flag) {
  if(!flag)
  {
    wx.showLoading({
      title: '查询中...',
      mask: true
    })
  }
  
  let page = getApp().getPage.bind(this)("pages/timeSelect/timeSelect");
  console.log(page)
  

  var data = {
    date: month,
    teacher_id: page.tid
  }
  var ajax = new Ajax({
    header: {
      Token: User.userId
    },
    data,
    path: _interface.getTimelist  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 0) {
      let arr=[];
      res.data.forEach(item=>{
        for (let time = item.start_time; time < item.end_time;time++)
        {
          arr.push({
            start:time,
            status:item.status,
            id:item.id
          })
        }
      })
      let arr_new = testData();
      arr.forEach(child => {
      arr_new.forEach(item=>{
       
        if (item.start == child.start && item.status == 5 && Is24(month + ' ' + child.start +':00'))
        {
          if (child.status =='waitting_appoint')
          {
            item.status = 0
            item.id=child.id;
          }
          if (child.status == 'wait_teacher_sure' || child.status == 'wait_sure') {
            item.status = 1
            item.id = child.id;
          }
        }
        })
      })

    
      cb(arr_new)

    }
    else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    
    }


  })
  ajax.catch(err => {

    console.log(err)
  })
}
export function getAllDate(that) {

  wx.showLoading({
    title: '查询中...',
    mask: true
  })
  let page = getApp().getPage.bind(this)("pages/timeSelect/timeSelect");
  console.log(page)


  var data = {
    teacher_id: page.tid
  }
  var ajax = new Ajax({
    header: {
      Token: User.userId
    },
    data,
    path: _interface.getTeacherDays  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 0) {

     that.teacherDays = res.data;

    }
    else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })

    }


  })
  ajax.catch(err => {

    console.log(err)
  })
}
//判断是否在24小时内
function Is24(date){
  var hour_1 = new Date()
  var t_1 = hour_1.getTime();
  var hour_2 = new Date(date.replace(/-/g, '/'))
  var t_2 = hour_2.getTime();

  if ((t_2-t_1) > 24*60*60*1000) { 
    return true
   }
  else {
    return false
  }
}
//获取7天以后的
export function is7week(dy,days){
  dy = dy.replace(/-/g, '/');
  let weeks = []
  let newWeeks=[]
  for(let i = 0; i<days.length;i++)
  {
    let date = new Date(dy);
    let times = date.getTime()+(i+1)*7*24*60*60*1000;
    let newDate = new Date(times);
    let m = (newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1) : (newDate.getMonth() + 1);
    let d = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    let day = newDate.getFullYear() + "-" +  m+'-'+d;

    weeks.push(day)
  }
  days.forEach(item=>{
    weeks.forEach(child=>{
      if(item.date==child)
      {
        newWeeks.push(item)
      }
    })
  })
  return newWeeks

  
}