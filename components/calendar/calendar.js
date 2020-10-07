// components/calendar/calendar.js
import Calendar from "./Days.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    week_title:['日','一','二','三','四','五','六'],
    month:[]
  },
  ready(){
    this.init()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //初始化日历
    init(){
      let days=new Calendar().getdayListInfo();
      this.setData({
        month:days
      })
      console.log(days)
     
    },
    //选择日期
    onselect({ currentTarget: { dataset: { flag, index, child, day}}}){
      if(!flag) return 
      console.log(flag, index, child, day)
      let nd = new Date();
      let currentMonth = nd.getMonth() + 1;
      let months = this.data.month;
      let d = nd.getDate();
      months.forEach(item=>{
        item.allday.forEach(_item=>{
          _item.select = false
         
        })
      })
      let currentSelect=''
      //months[index].month
      for (let cm = currentMonth; cm <= index+1; cm++) {
        let alldays = months[cm - 1].allday;
        for (let _index = child; _index < alldays.length; _index++)
        {
          let item = alldays[_index]
          //当前可选并且选择的天数大于可选的
          if (item.flag && item.day <= day && cm == index + 1) {
            item.select = true;
            currentSelect = months[cm - 1];
          }
          else if (item.flag && cm < index + 1) {
            item.select = true
          }
        }
        // months[cm - 1].allday.forEach((item, _index) => {

        //   //当前可选并且选择的天数大于可选的
        //   if (item.flag && item.day <= day && cm == index + 1) {
        //     item.select = true;
        //     currentSelect = months[cm - 1];
        //   }
        //   else if (item.flag && cm < index + 1) {
        //     item.select = true
        //   }
          
       

        // })

      }
      let { year, month } = currentSelect
      
      this.setData({
        [`month`]: months
      },()=>{
        console.log(year, month, day)
      })



 

    }
  }
})


//判断当前年是否是闰年
function isLeap(year) {
   return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;
  
}