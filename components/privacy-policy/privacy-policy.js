// commont/components/privacy-policy/privacy-policy.ts
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
    showPrivacy:false
  },
  pageLifetimes:{
    show(){
      this.showPrivacyBoolean()
      wx.onNeedPrivacyAuthorization(resolve => {
        // 需要用户同意隐私授权时
        // 弹出开发者自定义的隐私授权弹窗
        this.setData({
          showPrivacy: true
        })
        // this.resolvePrivacyAuthorization = resolve
      })
      // wx.requirePrivacyAuthorize({
      //   success: (res) => {
      //     console.log(res)
      //     // 用户同意授权
      //     // 继续小程序逻辑
      //   },
      //   fail: () => {}, // 用户拒绝授权
      //   complete: () => {}
      // })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showPrivacyBoolean(){
      //@ts-ignore
      wx.getPrivacySetting({
        success: res => {
          console.log(res)
          if (res.needAuthorization) {
            // 需要弹出隐私协议
            this.setData({
              showPrivacy: true
            })
          }
        },
        fail: () => {},
        complete: () => {}
      })
    },
    onOpen(){
      //@ts-ignore
      wx.openPrivacyContract()
    },
    handleAgreePrivacyAuthorization() {
      // 用户点击同意按钮后
      // this.resolvePrivacyAuthorization({ buttonId: 'agree-btn', event: 'agree' })
      this.setData({
        showPrivacy:false
      })
      // 用户点击同意后，开发者调用 resolve({ buttonId: 'agree-btn', event: 'agree' })  告知平台用户已经同意，参数传同意按钮的id。为确保用户有同意的操作，基础库在 resolve 被调用后，会去检查对应的同意按钮有没有被点击过。检查通过后，相关隐私接口会继续调用
      // 用户点击拒绝后，开发者调用 resolve({ event:'disagree' }) 告知平台用户已经拒绝
    },
    handleDisAgreePrivacyAuthorization(){
      // this.resolvePrivacyAuthorization({ event:'disagree' })
      this.setData({
        showPrivacy:false
      })
      wx.exitMiniProgram()
    }
  }
})