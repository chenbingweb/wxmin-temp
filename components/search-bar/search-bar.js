// components/search-bar/search-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon:{
      type:String,
      value:'../../images/search_icon.png'
    },
    bg:{
      type:String,
      value:'rgba(51, 51, 51, 0.3)'
    },
    sc:{
      type:String,
      value:'#fff'
    },
    del_icon:{
      type:String,
      value:'../../images/del_1.png'
    },
    width:{
      type:Number,
      value:700
    },
    color:{
      type:String,
      value:'#333'
    },
    distance:{
      type:Number,
      value:-170
    },
    callback:{
      type:Function,
      value:()=>{}
    },
    searchkey:{
      type:String,
      value:'',
      observer:function(n){
        if(n)
        {
          this.onFocus()
          this.setData({
            search_content:n
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dis: 0,
    search_content:'',
    focus:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取焦点
    onFocus() {
      this.setData({
        dis:-170,// this.properties.distance//-330
      },()=>{
        this.setData({
          focus:true
        })
      })
    },
    //失去焦点
    onBlur({ detail: { value } }) {
      if (!value) {
        this.setData({
          dis: 0
        })
      }

    },
    //搜索
    onConfirm({detail:{value}}){
      this.properties.callback(value)
    },
    onDel(){
      this.setData({
        focus: false,
        dis: 0,
        search_content: ''
      })
      this.properties.callback('')
    }
  }
})
