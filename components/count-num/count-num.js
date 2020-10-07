// components/count-num/count-num.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    total:{
      type:Number,
      value:99999999
    },
    num_p:{
      type:Number,
      value:1,
      observer:function(n){
        if(n)
        {
          this.setData({
            num:n
          })
        }
      }
    },
    callBack:{
      type:Function,
      value:()=>{}
    },
    item:{
      type:Object,
      value:{}
    },
    disable:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onReduce(){
      if (this.properties.disable)
      {
        return
      }
      if(this.data.num<=1)
      {
        return
      }
      this.setData({
        num: --this.data.num
      },()=>{
        let obj = {
          n:this.data.num, ...this.properties.item
        }
        this.properties.callBack(obj)

      })
    },
    onPlus(){
      if (this.properties.disable) {
        return
      }
      if(this.data.num>=this.properties.total) {
        wx.showToast({
          title: '单次预约人数已达上限',
          icon:'none'
        })
        return
      };
      this.setData({
        num: ++this.data.num
      }, () => {
        let obj = {
          n: this.data.num, ...this.properties.item
        }
        this.properties.callBack(obj)
      })
    },
  }
})
