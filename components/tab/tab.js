// components/tab/tab.js
import {User} from "../../model/user.js"
import { Index } from "../../model/index.js" 
Component({
  externalClasses: ['my-class','my-box'],
  /**
   * 组件的属性列表
   */
  properties: {
    showSelect:{
      type:Boolean,
      value:false
    },
    showSelect2:{
      type: Boolean,
      value: false
    },
    btnSelect:{
      type:String,
      value:'btn_select'
    },
    midBorder:{
      type:Boolean,
      value:false
    },
    isBorder:{
      type:Boolean,
      value:true
    },
    btWidth:{
      type:String,
      value:'33.333%',
    },
    tabList:{
      type:Array,
      value:[],
      observer:function(newVal,oldVal){
         
        console.log(newVal)
        if(newVal)
        {
          newVal.forEach((item,index)=>{
            if(index==0)
            {
              item.selected=true
            }
            else
            {
              item.selected = false
            }
          })
          //关闭动态状态
         
          this.setData({
            tabList: newVal
          })
        }
      }
    },
    isAll:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shopList:[
      // {
      //   name: '全部餐厅',
      //   id: ''
      // }
    ],
    index:0,
    isPC:false,
    typeIndex:0,
    types:[
      // {
      //   name:'类型选择',
      //   id:''
      // },
      {
        name: '单品',
        id: 'dp'
      },
      {
        name: '现做',
        id: 'xz'
      },
      {
        name: '套餐',
        id: 'tc'
      }
      
    ]
  },
  created:function(){
 
    console.log(User.restaurants)
    User.restaurantsEvent.Off(this.restaurantsEvent)
    User.restaurantsEvent.On(this, this.restaurantsEvent)
  },
  ready:function(){
    if (this.properties.isAll)
    {
      this.setData({
        isPC: User.pc,
        shopList: [
          {
            name: '全部餐厅',
            id: ''
          },

          ...User.restaurants,

        ],
        types: [
          {
            name:'类型选择',
            id:''
          },
          {
            name: '单品',
            id: 'dp'
          },
          {
            name: '现做',
            id: 'xz'
          },
          {
            name: '套餐',
            id: 'tc'
          }

        ]
      })
    }
    else
    {
      this.setData({
        isPC: User.pc,
        shopList: [
          // {
          //   name: '全部餐厅',
          //   id: ''
          // },

          ...User.restaurants,

        ]
      })
      this.data.shopList.forEach((item,index)=>{
        if (item.id == Index.currentShop) {
          this.setData({
            index: index
          })
        }
      })
      this.data.types.forEach((item,index)=>{
        if (item.id == Index.type)
        {
          this.setData({
            typeIndex: index
          })
        }
      })
    }

  },
  /**
   * 组件的方法列表
   */
  methods: {
    restaurantsEvent:function(){
      this.setData({
        isPC: User.pc,
        shopList:[
          // {
          //   name: '全部餐厅',
          //   id: ''
          // },
          ...User.restaurants
        ]
      })


    },
    //城市切换
    onChange:function({detail}){
      let {value}=detail;
      this.setData({
        index: parseInt(value)
      })
      var myEventDetail = { shopId: this.data.shopList[parseInt(value)].id }  // detail对象，提供给事件监听函数
      var myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项
      
      this.triggerEvent('selectShop', myEventDetail, myEventOption)
     
    },
    
    onSelectTab:function({currentTarget}){
      let { tid } = currentTarget.dataset;
      let list = this.properties.tabList;
      let tidType=""
      list.forEach(item=>{
        if (item.id == tid)
        {
          item.selected=true;
          tidType=item.id
        }
        else
        {
          item.selected = false
        }
      })
      this.setData({
        tabList: list
      })
      var myEventDetail = { tidType: tidType}  // detail对象，提供给事件监听函数
      var myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项
      this.triggerEvent('selectTab', myEventDetail, myEventOption)
    },
    //类型切换
    onChangeType({ detail}){
      let { value } = detail;
      this.setData({
        typeIndex: parseInt(value)
      })
      var myEventDetail = { type: this.data.types[parseInt(value)].id }  // detail对象，提供给事件监听函数
      var myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项

      this.triggerEvent('selectType', myEventDetail, myEventOption)
    }
  }
})
