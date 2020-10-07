// components/paging/paging.js
/*
  <paging  dataObj="{{dataObj}}" bindpageData="onPageData">
      <view slot="list"></view>
    </paging>
  js:
   onPageData({ detail }) {}
   this.setData({
      dataObj: {
        url: _interface.getMyPlateList||'',
        outData: {
          userId: getApp().globalData.userId,
          // village_id: getApp().globalData.village_id,
          // key: '',
          // collect: ''//
        }
      }
    })
*/
let page ="offset";
let pageSize ="limit";
// let page = "page";
// let pageSize = "pageSize";
import Ajax from "../../libs/Ajax.js";
import { User } from "../../model/user.js"
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表 getSignList
   */
  properties: {
    objData: {
      type: Boolean,
      value: false
    },
    pageFlage:{
      type:Boolean,
      value:true
    },
    scrollTop:{
      type:Number,
      value:0
    },
    showNoContent:{
      type:Boolean,
      value:false,
      observer: function (newVal, oldVal) {
        console.log(newVal, oldVal)

      }
    },
    paddingtop:{
      type:Number,
      value:250
    },
    paddingbottom: {
      type: Number,
      value: 0
    },
    scroll:{
      type:Boolean,
      value:true
    },
    dataObj: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        console.log(this)
        if (newVal.url) {
          this.setData({
            showMore: false,
            showNoData: false,
            showNoContent: true
          })
          this.page = newVal.outData.page || 1;
          //this.sendDataObj.page = this.page
          this.sendDataObj[page] = (this.page - 1) * this.properties.pageSize
          this.pageFlage = true;
          //接口地址
          this.url = newVal.url;
          //发送数据
          this.outData = newVal.outData;
          this.sendDataObj = Object.assign(this.sendDataObj, this.outData);
          //获取内容
          console.log(this.outData)
          this.getPageContent();
        }

      }
    },
    //请求地址
    url: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {


      }
    },
    //设置每次请求数量
    pageSize: {
      type: Number,
      value: 10,
      observer: function (newVal, oldVal) {
        console.log('page->',newVal)
        if (newVal)
        {
          this.sendDataObj[pageSize] = newVal;
          this.setData({
            pageSize:newVal
          })
        }
      }
    },
    //发送请求数据
    sendData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.outData = newVal
        console.log(this.outData)
      }
    },
    contentTip: {
      type: String,
      value: '暂无数据',
      observer: function (newVal, oldVal) {
        this.setData({
          contentTip: newVal
        })
      }
    },
    reload: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.page = 1;
          this.pageFlage = true;
          this.sendDataObj.page = this.page
          this.getPageContent()
          this.setData({
            showMore: false,
            showNoData: false,
            showNoContent: true
          })
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showMore: false,
    showNoData: false,
    showNoContent: true
  },
  created: function () {
    //初始化相关分页参数
    this.page = 1;
    this.pageSize = this.data.pageSize;
    this.pageFlage = true;
    this.sendDataObj = {
      [pageSize]: this.pageSize,
      [page]: (this.page - 1) * this.properties.pageSize
    };

  },
  ready: function () {


  },

  /**
   * 组件的方法列表
   */
  methods: {
    onScroll:function(){
      let myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项
      let myEventDetail = {}
      this.triggerEvent('scroll', myEventDetail, myEventOption)
    },
    scrolltolower: function (e) {
      if (!this.pageFlage || !this.properties.pageFlage) return
      this.setData({
        showMore: true
      })
      this.page += 1;
      this.sendDataObj[page] = (this.page - 1) * this.properties.pageSize//this.page;
     
      this.getPageContent()
    },
    scrolltoupper: function(e){
      console.log('istop')
      let myEventOption = {
        bubbles: true,
        composed: true,
        capturePhase: false
      }
      let myEventDetail = true
      this.triggerEvent('test', myEventDetail, myEventOption)
    },
    //获取内容
    getPageContent: function () {
      let myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项
      let ajax = new Ajax({
        path: this.url,
        header:{
          Authorization: User.userId
        },
        data: this.sendDataObj
      })
      ajax.then(res => {
        //  setTimeout(()=>{
        this.setData({
          showMore: false
        })
        // },2000)

        if (parseInt(res.errcode) == 200) {
          //res.data = res.data.orders
          // if (res.shop_id)
          // {
          //   getApp().globalData.shopId = res.shop_id
          // }

          if (Array.isArray(res.data)) {
            //分页数大于获取的数据，表示可以分页
            if (this.pageSize <= res.data.length) {
              this.pageFlage = true;
            }
            else if (res.data.length!=0 && res.data.length < this.data.pageSize) {
              if (this.page != 1) {
                this.setData({
                  showNoData: true,
                  showNoContent: false
                })
                this.pageFlage = false;
              }
              else {
                this.pageFlage = false;
              }

            }
            if (res.data.length>0)
            {
              this.setData({
                showNoContent: false
              })
            }

            if (res.data.length == 0 && this.page != 1) {
              this.setData({
                showNoData: true,
                showNoContent: false
              })
              this.pageFlage = false;
            }
            else if (res.data.length == 0 && this.page == 1) {
              this.setData({
                showNoContent: true
              })
              this.pageFlage = false;
            }
            console.log(res.data)
            let myEventDetail = res.data;
            // if (myEventDetail.length>10)
            // {
            //   myEventDetail.pop()
            // }
            if (this.properties.objData) {
              myEventDetail = {
                detail: res.data,
                ...res
              }
            }
            this.triggerEvent('pageData', myEventDetail, myEventOption)

          }
        }
        else if(res.errcode==1)
        {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
        else
        {
          wx.showToast({
            title: '网络繁忙,请稍后再试',
            icon: 'none'
          })
          this.setData({
            showNoData: false,
            showNoContent: true
          })
        }

      })
      ajax.catch(err => {
         wx.showToast({
           title: '网络繁忙,请稍后再试',
           icon:'none'
         })
        this.setData({
          showNoData: false,
          showNoContent: false
        })

          console.log('==分页报错 服务器=')
      })
    }
  }
})
