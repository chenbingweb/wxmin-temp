// components/swiper-date/swiper-date.js
import Day from "./fn.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectFn:{
      type:Function,
      value:()=>{}
    },
 
    jjr:{
      type:Object,
      value:{},
      observer:function(n,o){
        if (n && typeof n == 'object' && n.jjr)
        {
          let list = Day.getDayList();
          let available_dates = n.available_dates||[];
          Object.keys(n.jjr).forEach(key=>{
              list.forEach(item=>{
                if (item.year==key)
                {
                  item.jjr = n.jjr[key]
                }
                if (available_dates.includes(item.year))
                {
                  item.available=true
                }
                else
                {
                  item.available = false
                }
              })
          })

          console.log(list)
          this.setDate(list);
        }
        else
        {
          let list = Day.getDayList();
          this.setDate(list);
        }
      }
    },
    displayrefreshtime:{
      type:String,
      value:'3'
    },
    refreshtime:{
      type:Number,
      value: 4000
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    dayList:[]
  },
  ready(){
   
    this.timmer =null;
    this.canClick=true;
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setDate(list){
      let arr = [];
      let child = []
      list.forEach((item, index) => {
        if (index % 7 == 0) {
          child = []
          child.push(item)
        }
        else {
          child.push(item)
          if (index == list.length - 1) {
            arr.push(child)
          }
        }
        if (child.length == 7) {
          arr.push(child)
        }

      })
      this.setData({
        dayList: arr
      })
    },
    onSelect({ currentTarget: { dataset: { did, available}}}){
      if (!available) return
      if (this.canClick==false)
      {
        wx.showToast({
          title: `请${this.properties.displayrefreshtime||3}秒后再次刷新`,
          icon:'none'
        })
        return
      }
      this.canClick=false;
      setTimeout(()=>{
        this.canClick = true;
      },this.properties.refreshtime)

     
      let { dayList } = this.data;
      dayList.forEach(item=>{
        item.forEach(child=>{
          if (child.day == did )
          {

            child.selected=true;
            this.properties.selectFn(child)
          }
          else
          {
            child.selected = false;
          }
        })
      })
      this.setData({
        dayList
      })
    },
  }
})
