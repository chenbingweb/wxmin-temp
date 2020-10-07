// components/city-piker/city-piker.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cityList: {
      type: Array,
      value: [],
      observer: function (nVal, oldVal) {
       
        
        if (!nVal||nVal.length ==0) return
        var newVal = nVal// this.dataChange(nVal);
       
        let noData = {
          // name: '-选择-',
          // code: '',
          // city: [//市
          //   {
          //     name: '-选择-',
          //     code: '',
          //     area: [//区
          //       {
          //         name: '-选择-',
          //         code: '',
          //       }
          //     ]
          //   }
          // ]
        }
       //newVal.push(noData)
        // this.province = [{
        //   name: '-选择-',
        //   code: '',
        //   index: 'pro'
        // }];
        // this.city = [[{
        //   name: '-选择-',
        //   code: ''
        // }]];
        // this.country = [[{
        //   name: '-选择-',
        //   code: ''
        // }]];
        this.province = [];
        this.city = [];
        this.country = [];
        for (let i = 0; i < newVal.length; i++) {
          this.province.push({ name: newVal[i].name, code: newVal[i].code });
          let item = [{
            name: '-选择-',
            code: ''
          }];
          item = [];
          for (let k = 0; k < newVal[i].city.length; k++) {
            item.push({ name: newVal[i].city[k].name, code: newVal[i].city[k].code })
            let area = [];
           
            for (let j = 0; j < newVal[i].city[k].area.length; j++) {
              area.push({ name: newVal[i].city[k].area[j].name, code: newVal[i].city[k].area[j].code })
            }
            this.country.push(area)
          }
          this.city.push(item)
        }
      
      //  console.log('country', this.country)
        this.cityList = newVal
        this.setData({
        //  cityList: newVal,
          province: this.province,
          getCity: this.city[0],
          country: this.country[0]
        })
      
        this.selectCityObj = { code: this.cityList[0].city[0].area[0].code, name: this.cityList[0].city[0].area[0].name }
        // console.log(this.selectCityObj )
        // console.log(this.province)
        console.log(this.city[0][0].code)
         console.log(this.country[0][0].code)
        this.cityListCode = {
          proCode: this.province[0].code,
          cityCode: this.city[0][0].code,
          countryCode: this.country[0][0].code
        }
        this.cityListName={
          proName: this.province[0].name,
          cityName: this.city[0][0].name,
          countryName: this.country[0][0].name
        }
        console.log(this.cityListCode)
      }
    },
    shows: {
      type: Boolean,
      value: false,
      observer: function (newval, old) {
        this.setData({
          show: true
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cityList: [],
    province: [],
    getCity: [],
    country: [],
    show: false
  },
  create: function () {
    this.stop = true;

  },
  ready: function () {
    // this.cityListCode = { proCode: "", cityCode: "", countryCode: "" }
    
  //  this.selectCityObj = { code: "", name: "" }
    // console.log(this.properties.cityList)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //数据结构转换
    dataChange: function (cityListArr){
      let Arr=[];
      for(let i=0;i<cityListArr.length;i++)
      {
        let pro = cityListArr[i];
        //省
        let proObj={
          "name": pro.Name,
          "code": pro.Id,
        }
        let cityLists = [];
        for (let k = 0; k < pro.Cities.length;k++){
         
          let citys = pro.Cities[k];
          let cityObj = {
            "name": citys.Name,
            "code": citys.Id
          }
          cityLists.push(cityObj)
           let are=[]
          for (let j = 0; j < citys.Distincts.length;j++){
            let areObj = citys.Distincts[j];
            are.push({
              "code": areObj.Id,
              "name": areObj.Name
            })
          }
          cityObj['area'] = are
        }
        proObj['city'] = cityLists
          
        Arr.push(proObj)

      }
      
      return Arr
    },
    //获取省
    getPro: function (cityList) {
      let proArr = []
      // this.setData({
      //   getCity: [{
      //     name: '-选择-',
      //     code: ''
      //   }]
      // })
      this.setData({
        getCity: []
      })
      for (let i = 0; i < cityList.length; i++) {
        proArr.push(cityList[i])
      }

      return proArr
    },
    //获取市
    getCity: function (proName) {
      let cityArr = []
      // this.setData({
      //   country: [{
      //     name: '-选择-',
      //     code: ''
      //   }]
      // })
      this.setData({
        country: []
      })
      for (let i = 0; i < this.cityList.length; i++) {
        if (proName.trim() == this.cityList[i].name.trim()) {
          for (let k = 0; k < this.cityList[i].city.length; k++) {
            cityArr.push(this.cityList[i].city[k])
          }
        }
        for (let k = 0; k < this.data.cityList[i].city.length;k++){
          cityArr.push(this.data.cityList[i].city[k])
        }
      }

      return cityArr
    },
    //获取区
    getCountry: function (proName, cityName) {
      if (!proName || !cityName) return
      // let countryArr = [{
      //   name: '-选择-',
      //   code: ''
      // }]
      let countryArr = []
      for (let i = 0; i < this.cityList.length; i++) {
        if (proName == this.cityList[i].name) {
          for (let k = 0; k < this.cityList[i].city.length; k++) {
            if (this.cityList[i].city[k].name == cityName) {
              countryArr.push(...this.cityList[i].city[k].area)
              console.log(this.cityList[i].city[k].area)
            }

          }
        }
      }

      return countryArr
    },
    //pikerchange事件
    bindChange: function (e) {
      let value = e.detail.value;
      
      if (this.province[value[0]].code == '') {
        this.setData({
          value: [0, 0, 0]
        })
        this.selectCityObj = { name: "", code: "" }

        this.cityListCode={ proCode: "", cityCode: "", countryCode: "" }
        
       
        return
      }

      //console.log(this.province[value[0]].name)
      // console.log(this.city[value[0]][value[1]])
      // console.log(this.city[value[0]][value[1]].name)

      try {
        let cityName = ''
        if (this.city[value[0]][value[1]]) {
          cityName = this.city[value[0]][value[1]].name
        }
        else {

        }

        this.setData({
          province: this.province,
          getCity: this.city[value[0]],
         country: this.getCountry(this.province[value[0]].name, cityName)
        })
        //获取城市编码
        this.cityListCode = {
          proCode: this.province[value[0]].code,
          cityCode: this.city[value[0]][value[1]].code,
          countryCode: this.data.country[value[2]].code
        }
        this.cityListName = {
          proName: this.province[value[0]].name,
          cityName: this.city[value[0]][value[1]].name,
          countryName: this.data.country[value[2]].name
        }
        this.selectCityObj = {}
        console.log(this.city[value[0]][value[1]].code)
        if (this.city[value[0]][value[1]].code == '') {
          this.selectCityObj = this.province[value[0]]
        }
        // else
        // {
        //   this.selectCityObj = this.city[value[0]][value[1]]
        // }
        else if (this.data.country[value[2]].code == '') {
          this.selectCityObj = this.city[value[0]][value[1]]
        }
        else if (this.data.country[value[2]].code != '') {
          this.selectCityObj = this.data.country[value[2]]
        }

      } catch (e) {
        console.log(e)
      }


    },
    //隐藏
    hiddenPicker: function () {
      console.log('close')
      this.setData({
        shows: false
      })
      var myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项
      this.triggerEvent('cancelCity', {}, myEventOption)
    },
    //确认
    selectCity: function (e) {
      console.log(this.selectCityObj.code.slice(2))
      if (parseInt(this.selectCityObj.code.slice(2))==0)
      {
        this.setData({
          shows: false
        })
        return
      }
      console.log(this.selectCityObj)
      var myEventDetail = { selectCity: this.selectCityObj, codes: this.cityListCode, names: this.cityListName }
      // detail对象，提供给事件监听函数
      var myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项
      this.triggerEvent('citySelect', myEventDetail, myEventOption)
      //关闭piker
      this.setData({
        shows: false
      })
    }

  }
})
