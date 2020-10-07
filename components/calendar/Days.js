export default class Calender{
  constructor(startYear, endYear){
    //起始年
    this.startYear = startYear || new Date().getFullYear();
   
    //结束年
    this.endYear = endYear || new Date().getFullYear()+1;
    this.days=[]
    console.log(this.startYear, this.endYear)
   
  }
  //如果当前年份能被4整除但是不能被100整除或者能被400整除，即可确定为闰年，返回1，否则返回0
  isLeap(year) {

   return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;

  }
  //判断月分是大月还是小月 
  //就可以得出这个月除了2月外是30天还是31天
  Month(year,month) {
    let allday=0;
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
  getWeek(year, month){
    var firstday = new Date(year, month - 1, 1);
    var xinqi = firstday.getDay();
    return xinqi
  }
  getdayListInfo(){
    let days=[]
    
    //说明是指当前年
    if (this.startYear == this.endYear)
    {
      days.push(...this.innerFn())
      //return this.innerFn()
      // for(let i=0;i<12;i++){
      //   let alldayObj=[]
      //   let allday= this.Month(this.startYear, i+1);
      //   let week = this.getWeek(this.startYear, i + 1);
        
      //     for(let ad=0;ad<allday;ad++)
      //     {
      //       if (month > (i + 1)) {
      //         alldayObj.push({
      //           day: ad+1,
      //           flag:false
      //         })
      //       }
      //       else if (month == (i + 1))
      //       {
      //         if ((ad+1)<d)
      //         {
      //           alldayObj.push({
      //             day: ad + 1,
      //             flag: false
      //           })
      //         }
      //         else
      //         {
      //           alldayObj.push({
      //             day: ad + 1,
      //             flag: true
      //           })
      //         }
      //       }
      //       else
      //       {
      //         alldayObj.push({
      //           day: ad + 1,
      //           flag: true
      //         })
      //       }
      //     }
        
      //   let obj={
      //     firstWeek: week,
      //     allday: alldayObj,
      //     year: this.startYear,
      //     month: i + 1
      //   }
      //   day.push(obj)
      // }
    }
    else
    {
      if (this.startYear < this.endYear)
      {
        let n = this.endYear - this.startYear+1
        for(let w=0;w<n;w++){
          days.push(...this.innerFn(w))
          // for (let i = 0; i < 12; i++) {
          //   let allday = this.Month(this.startYear+w, i + 1);
          //   let week = this.getWeek(this.startYear+w, i + 1);
          //   let obj = {
          //     firstWeek: week,
          //     allday: allday,
          //     year: this.startYear+w,
          //     month: i + 1
          //   }
          //   day.push(obj)
          // }
        }
      }
      else
      {
        console.error('startYear必须大于等于endYear')
      }
    }
    this.days = days
    return days
  }
  innerFn(w=0){
    let day = [];
    let nd = new Date();
    let month = nd.getMonth() + 1;
    let d = nd.getDate();
    for (let i = 0; i < 12; i++) {
      let alldayObj = []
      let allday = this.Month(this.startYear+w, i + 1);
      let week = this.getWeek(this.startYear+w, i + 1);

      for (let ad = 0; ad < allday; ad++) {
        //当前月大于本月，设置不可选
        if (this.startYear+w == new Date().getFullYear() && month > (i + 1)) {
          alldayObj.push({
            day: ad + 1,
            flag: false,
            select:false
          })
        }
        //当前月等于本月，
        else if (this.startYear+w == new Date().getFullYear() && month == (i + 1) ) {
          //当前号大于之前的，不可选
          if ((ad + 1) < d) {
            alldayObj.push({
              day: ad + 1,
              flag: false,
              select: false
            })
          } //否则可选
          else {
            alldayObj.push({
              day: ad + 1,
              flag: true,
              select: false,
              detail: (this.startYear + w) + '' + (i + 1) + '' + (ad + 1)
            })
          }
        }
        else {
          //其他都可选
          alldayObj.push({
            day: ad + 1,
            flag: true,
            select: false,
            detail: (this.startYear + w) + '' + (i + 1) + '' + (ad + 1)
          })
        }
      }

      let obj = {
        firstWeek: week,
        allday: alldayObj,
        year: this.startYear+w,
        month: i + 1
      }
      day.push(obj)
    }
    return day
  }
 

}
