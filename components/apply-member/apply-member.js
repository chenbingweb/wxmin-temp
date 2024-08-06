// components/apply-member/apply-member.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isValidMember:{
      type:Boolean,
      value:false,
    },
    source:{
      type:String,
      value:'index'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog:false
  },
  lifetimes:{
      ready(){
       
        // setTimeout(()=>{
        //   this.showDialogFn()
        // },3000)
      }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDialogFn(){
      this.setData({
        showDialog:true
      })
      
      this.hideBar()
    },
    hideBar(){
      try{
        wx.hideTabBar()
      }catch(e){
        
      }
    },
    showBar(){
      try{
        wx.showTabBar()
      }catch(e){

      }
     
    },
    onClose(){
      this.setData({
        showDialog:false
      })
      this.showBar()
    },
    hide(){
      this.setData({
        showDialog:false
      })
    }
  }
})
