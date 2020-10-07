// components/nav-class/nav-class.js
Component({
  /**
   * 组件的属性列表 areas="{{areas}}" categories="{{categories}}"
   */
  properties: {
    areas:{
      type:Array,
      value:[]
    },
    categories:{
      type:Array,
      value:[],
      observer:function(n){
        let { categoriesList } = this.data;
        console.log(categoriesList)
        categoriesList.push(...n)
        this.setData({
          categoriesList
        })
      }
    },
    areaFn:{
      type:Function,
      value:()=>{}
    },
    cateFn:{
      type: Function,
      value: () => { }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current:'',
    categoriesList:[{
      id:'',
      name:'全部',
      img_url:'../../images/1_icon.png',
      selected:true
    }],
    navList:[
      {
        name:'区域',
        icon:'../../images/location.png',
        id:'area'
      },
      {
        name: '热度',
        icon: '../../images/hot.png',
        id: 'hot',
        selected : true
      },
      {
        name: '分类',
        icon: '../../images/icon-1.png',
        id: 'classic'
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //3 
    onAreaSelect({currentTarget:{dataset:{aid}}}){
      let { navList } = this.data;
    //  if (aid == 'hot') return && item.id !=='hot'
      navList.forEach(item=>{
        if (item.id == aid )
        {
          item.selected = true
          if(item.id=='hot')
          {
            this.properties.areaFn('')
          }
        }
        
        else
        {
          item.selected = false
        }
      })
      console.log(navList.find(item => item.selected).id)
      this.setData({
        navList,
        current: navList.find(item=>item.selected).id
      })
    },
    onSelectArea({ currentTarget: { dataset: { aid } } }){
      let areas = this.properties.areas;
      areas.forEach(item=>{
        if(item.id==aid)
        {
          item.selected = !item.selected;
          if (item.selected)
          {
            this.properties.areaFn(aid)
          }
          else
          {
            this.properties.areaFn('')
          }
          
        }
        else
        {
          item.selected=false
        }
      })
      this.setData({
        areas,
        current:''
      })
    },
    onSelectCl({ currentTarget: { dataset: { cid } } }){
      let { categoriesList } = this.data;
      categoriesList.forEach(item => {
        if (item.id == cid) {
          console.log(cid)
        
          
          item.selected = true
          this.properties.cateFn(cid)
          // if (item.selected) {
          //  // this.properties.areaFn(aid)
          // }
          // else {
          //   this.properties.areaFn('')
          // }

        }
        else {
          item.selected = false
        }
      })
      this.setData({
        categoriesList,
        current: ''
      })
      console.log(categoriesList)
    }
  }
})
