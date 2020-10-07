import Tool from "../../libs/Tool.js"

 class Calender {
  constructor(startYear, endYear) {
    //起始年
    this.startYear = startYear || new Date().getFullYear();

    //结束年
    this.endYear = endYear || new Date().getFullYear() + 1;
    this.days = []
    console.log(this.startYear, this.endYear)

  }
  //如果当前年份能被4整除但是不能被100整除或者能被400整除，即可确定为闰年，返回1，否则返回0
  isLeap(year) {

    return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;

  }
  //判断月分是大月还是小月 
  //就可以得出这个月除了2月外是30天还是31天
  Month(year, month) {
    let allday = 0;
    if (month !== 2) {
      if (month === 4 || month === 6 || month === 9 || month === 11)
        allday = 30;
      else
        allday = 31;
    }
    else {
      //判断是否是闰年
      if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)
        allday = 29;
      else
        allday = 28;
    }
    return allday
  }

  //获取每月第一天周几
  getWeek(year, month) {
    var firstday = new Date(year, month - 1, 1);
    var xinqi = firstday.getDay();
    return xinqi
  }
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  //获取60天的信息
  getDayList(days=60){
    let start = new Date().getTime();
    let perSec = 1 * 24 * 60 * 60 *1000;
    let dayArr = [];
    let name = '今天';
    for(let i=0;i<days;i++){
      let day = new Date(start)
      let year =  day.getFullYear();
      let month = this.formatNumber(day.getMonth()+1);
      let _day = this.formatNumber(day.getDate()) ;
      let week = day.getDay();
      if(i==0)
      {
        name ='今天'
      }
      else if(i==1)
      {
        name = '明天'
      }
      else
      {
        name = this.getWeek(week)
      }
      let info = {
        year: `${year}-${month}-${_day}`,
        day: `${month}-${_day}`,
        week: this.getWeek(week),
        name: name,
        istoday:i==0?true:false,

      }
      dayArr.push(info)
      start += perSec
    }
    return dayArr
  }
  getWeek(n){
    if(n==0)
    {
      n="周日"
    }
    if (n == 1) {
      n = "周一"
    }
    if (n == 2) {
      n = "周二"
    }
    if (n == 3) {
      n = "周三"
    }
    if (n == 4) {
      n = "周四"
    }
    if (n == 5) {
      n = "周五"
    }
    if (n == 6) {
      n = "周六"
    }
    return n
  }
}

export default new Calender()