// components/time-select/time-select.js
import { selectList2, initData, initData2, testData, selectList, getTimeList, isOk, isUseTime, _timeList_ as TimeObj, getTimes, getAllDate, is7week } from "./fn.js"



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectTimeCb:{
      type:Function,
      value:()=>{}
    },
    buytotaltime:{
      type:String,
      value:'0',
      observer:function(n,o){
        if(n)
        {
          this.isBuyTotalTime=n;
          this.isBuyTotalTimeFn && this.isBuyTotalTimeFn(n)
        }
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    timeList:[]
  },
  ready(){
    // getTimes('2018-09-01',(res) => {
    //   this.setData({
    //     timeList: res
    //   }, () => {
    //      initData.bind(this)()
    //   })
    // })
    this.setData({
      timeList: testData()
    })
    //时间队列
    this.dayArr={}
    //当前使用时间
    this.isSelectTime=0;
    this.tipFlag=false;
    // let page = getApp().getPage.bind(this)("pages/lessonDetail/lessonDetail");
    // console.log(page.data.lesson_time)
    // //购买总课时
    // this.isBuyTotalTime = page.data.lesson_time.filter(item => item.selected)[0].time;
    // //执行回调
    //  this.isBuyTotalTimeFn && this.isBuyTotalTimeFn(this.isBuyTotalTime)
    this.teacherDays = []
    getAllDate(this)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //选择时间
    onSelect({currentTarget:{dataset:{index,time}}}){
      
      let { timeList } = this.data;
      //判断是否可选
      let choiceSelect=timeList.some(item=>{
        if (item.start == time && item.selected)
        {
          return true
        }

        return false
        
      })
      if (!choiceSelect)
      {
        if (this.isSelectTime >= this.isBuyTotalTime )
        {
          wx.showToast({
            title: '当前预约时间超过总课时',
            mask: true,
            icon: 'none'
          })
          return 
        }

        
        
      }

      let obj = this.dayArr[this._key_];
      //获取历史选择的时间节点
      if (obj &&  obj.lastTime.list )
      {
        if (obj.lastTime.list.length==1)
        {
          this.selectArr = [obj.lastTime.list[0].start]
        }
        else 
        {
          this.selectArr = [obj.lastTime.list[0].start, obj.lastTime.list[obj.lastTime.list.length-1].start]
        }

       
      }
      console.log(this.isSelectTime, this.selectArr[1], time )

      this.selectArr.push(time);
      //开始选择
      if (this.selectArr.length==1)
      {
        
        if (isOk.bind(this)(this.selectArr)) {
          timeList.forEach((item, _index) => {
            if (this.selectArr.includes(item.start)) {
              item.selected = true;
            }
            else {
              item.selected = false;
            }


          })
          this.setData({
            timeList
          },()=>{
            this.dayArr[this._key_].selectTime = selectList.bind(this)(this.data.timeList.filter(item => item.selected))
            

            this.properties.selectTimeCb(selectList.bind(this)(this.data.timeList.filter(item=>item.selected)))
          })
        }
        else
        {
          wx.showToast({
            title: '您选择的时间段不可预约',
            icon: 'none'
          })
          this.selectArr=[]
        }
        
      }
      else 
      {
        this.selectArr.length=2;
        this.selectArr[1] = time;
        //第二个时间大于第一段时间，不能选择
        if (this.selectArr[1] < this.selectArr[0])
        {
          this.selectArr = [this.selectArr[0]]
          return 
        }
        //如果相等，则取消选中
        else if (this.selectArr[1] == this.selectArr[0])
        {
          let one = timeList.filter(item=>item.selected).length==1?true:false;
          //if (timeList)
          if(one)
          {
            
            timeList.forEach(item=>{
              item.selected=false;
            })
            this.setData({
              timeList
            })
            this.dayArr[this._key_].selectTime = {}
            obj.lastTime = {}
            this.properties.selectTimeCb()
            this.isSelectTime = isUseTime.bind(this)()
            this.selectArr = []
            console.log(this.dayArr)
            return

          }
          else
          {

          
            this.selectArr = [this.selectArr[1]]
            timeList.forEach((item, _index) => {
              if (this.selectArr.includes(item.start)) {
                item.selected = true;
                // if (item.selected)
                // {
                //   item.selected = false;
                //   this.selectArr = []
                // }
                // else
                // {
                //   item.selected = true;
                // }

              }
              else {
                item.selected = false;
              }


            })
          
            this.setData({
              timeList
            },()=>{
              
              this.dayArr[this._key_].selectTime = selectList.bind(this)(this.data.timeList.filter(item => item.selected))
              this.properties.selectTimeCb()

              this.isSelectTime = isUseTime.bind(this)()
            })
            // this.dayArr[this._key_].selectTime = {}
            // obj.lastTime = {}
            // this.properties.selectTimeCb()
            // this.isSelectTime = isUseTime.bind(this)()
            // console.log(this.dayArr)
          
            // this.dayArr[this._key_].selectTime = {}
            // obj.lastTime={}
          
          // this.properties.selectTimeCb(selectList.bind(this)(this.data.timeList.filter(item => item.selected)))
            
            console.log(this.dayArr)
            return
          }
        }
        
        var _arr = getTimeList.bind(this)()
        if (_arr.length > this.isBuyTotalTime)
        {
            wx.showToast({
            title: '当前预约时间超过总课时',
            mask: true,
            icon: 'none'
          })
          return
        }
        //判断是否包含不合法日期
        if (isOk.bind(this)(_arr)) 
        {
        
          timeList.forEach((item, _index) => {
            if (_arr.includes(item.start)) {
              item.selected = true;

            }
            else {
              item.selected = false;
            }



          })
          this.setData({
            timeList
          },()=>{
            this.dayArr[this._key_].selectTime = selectList.bind(this)(this.data.timeList.filter(item => item.selected))
            this.properties.selectTimeCb(selectList.bind(this)(this.data.timeList.filter(item => item.selected)))
            
            let useTime = 0
            let arr = []
            let dayArr = selectList.bind(this)(this.data.timeList.filter(item => item.selected))
            console.log(dayArr)
            useTime=dayArr.list.length;
            if (useTime >= 4 && !this.tipFlag) {
              this.tipFlag = true
              wx.showToast({
                title: '罗马不是一天建成的，考虑到学习效果，不建议一次上课时间太久哦，土豪随意。',
                icon: 'none'
              })

            }
            else if (useTime < 4) {
              this.tipFlag = false

            }
          })
        }
        else
        {
          wx.showToast({
            title: '您选择的时间段不合法',
            icon:'none'
          })
        }
        console.log(this.dayArr)
      
      }
      
      console.log('isUseTime',this.isUseTime)
    },
    //判断是否已选
    upDateSelectArr(time){
      let _s_i = this.selectArr.indexOf(time);
      console.log('_s_i',_s_i)
      if(_s_i<0) return
      this.selectArr=this.selectArr.slice(0,_s_i+1);
      console.log(_s_i + 1, this.selectArr.slice(0, _s_i + 1))
     
    },
    //修改时间列表
    changeTimeList(month,cb){
      console.log(month)
      this.currentMonth=month;
      this._key_ = '_' + this.currentMonth.day + '_' + this.currentMonth.name
      getTimes(this.currentMonth.day,(res)=>{
        this.setData({
          timeList: res
        }, () => {


          initData.bind(this)()
        })
      })
     
    },
    //一键预约
    oneKey(months){
      let arr=[];
      let _dayLastTime=[]
      let index=0;
      let start_day=''//开始日期
      
      let _index = Object.keys(this.dayArr).length - 1;
      Object.keys(this.dayArr).forEach(item=>{
        let _item = this.dayArr[item]
        if (_item.lastTime.list) 
        {
          _dayLastTime.push({key:item, list:_item.lastTime.list})
        }
      })
      if (_dayLastTime.length==1)
      {
        arr.push(..._dayLastTime[0].list)
        start_day = _dayLastTime[0].key.split("_")[2]
      }
      else if(_dayLastTime.length>1)
      {
        arr.push(..._dayLastTime[_dayLastTime.length - 1].list)
        start_day = _dayLastTime[_dayLastTime.length - 1].key.split("_")[2]
      }
      console.log(arr, start_day)

      // let item = this.dayArr[Object.keys(this.dayArr)[_index]];
      
      // if(item.lastTime.list)
      // {
      //   arr.push(...item.lastTime.list)
      // }
      if(arr.length==0)
      {
        wx.showToast({
          title: '您没有选择预约时间',
          icon: 'none'
        })
        return
      }
      let monthsArr = [];
      let _start_day= '';
      let _slice_index=0;
      months.forEach((month,_index)=>{
        if (month.name == start_day)
        {
          _slice_index=_index;
          _start_day=month.day;
        }
      })
      let teacherDays = is7week(_start_day, this.teacherDays)
      debugger
      
   //   months = months.slice(_slice_index)
      console.log(months)
      teacherDays.forEach(item=>{
        months.forEach(child=>{
          if (item.date == child.day) {
            monthsArr.push(child)
          }
        })
        
      })
      
      console.log(monthsArr)
      let total = this.isBuyTotalTime - this.isSelectTime;
      total=parseInt(total/arr.length);
      console.log('total',total)
      getList.bind(this)(monthsArr, arr, total)((res,item)=>{
     
        
      
      })


      return 
      months.forEach(item=>{
        let key = '_' + item.day + '_' + item.name
        if (!this.dayArr[key]) {
          this.dayArr[key] = new TimeObj();
          this.dayArr[key].lastTime = selectList2.bind(this)(arr, item)
          // this.dayArr[key].newArr = _new_arr;
          this.dayArr[key].componentObj = this
          // this.dayArr[key]._updata()

        }
      })
      console.log(this.dayArr)

      
      
      // console.log(arr)
     

    }

  }
})


function getList(months,arr,total,cb){
  let index=0;
  let _index=0;//当前选中下标
  wx.showLoading({
    title: '查询中...',
    mask:true
  })
  return innerFn.bind(this)
  function innerFn(callBack){
    if (_index > total || index >= months.length)
    {
      wx.hideLoading()
      cb && cb()
      return 
    }

    setTimeout(() => {
      
      getTimes(months[index].day,(res)=>{

        let item = months[index]
        let key = '_' + item.day + '_' + item.name
        if (!this.dayArr[key]) {
          this.dayArr[key] = new TimeObj();
          this.dayArr[key].componentObj = this
          // this.dayArr[key]._updata()
        }
        this.dayArr[key].times = selectList2.bind(this)(arr, item)
        this.dayArr[key].lastTime = selectList2.bind(this)(arr, item)
        //更新日期
        this.dayArr[key].update2(initData2(res), this.dayArr[key].lastTime.list, (ret) => {

          if(ret.every(item => !item.selected))
          {
            if (key == this._key_)
            {
              this.setData({
                timeList: initData2(res)
              })
            } 
            // let { timeList } = this.data;
            // timeList.forEach(item=>{
            //   item.selected=false
            // })
           
            this.dayArr[key].lastTime = {}
            this.dayArr[key].times={}
            this.properties.selectTimeCb()
            index++
            
            innerFn.bind(this)(callBack)
          }
          else
          {
           
            this.dayArr[key].newArr = ret;
            this.properties.selectTimeCb()
            _index++
            index++

            innerFn.bind(this)(callBack)
          }
          
         
        
         
        }, this)

        
       
      },true)
    }, 0)
  }
 
}




function uniq(array) {
  var temp = []; //一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) == -1) {
      temp.push(array[i]);
    }
  } 
  temp = temp.sort();
  return temp
}
