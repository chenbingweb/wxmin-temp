// components/scroll-box/scroll-box.js
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
    move:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scroll_1({ detail: { scrollTop}}){
      console.log(scrollTop)
      if(scrollTop>=100)
      {
        this.setData({
          move: false
        })
      }
    },
    scroll_2({ detail: { scrollTop} }){
      console.log(detail)
    }
  }
})
