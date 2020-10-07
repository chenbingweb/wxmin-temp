let _interface = require('./utils/interface.js')
import Ajax from "./libs/Ajax.js";
import Tool from "./libs/Tool.js";
import Upload from "./libs/Upload.js";
import { User } from "./model/user.js";

class Options{
  constructor(){
    this._options = {
      //快递
      /*
      S01 顺丰快递
    S02 EMS快递
    S03 申通快递
    S04 圆通快递
    S05 百事汇通
    S06 DHL
    S07 FedEx
    S08 韵达快递
    S09 天天快递
    S10 TNT
    S11 全峰快递
    S12 如风达
    S99 其他
      
      */
      express:[
        { name: '请选择快递', id: '' },
        { name: '顺丰快递', id:'S01'},
        { name: 'EMS快递', id: 'S02' },
        { name: '申通快递', id: 'S03' },
        { name: '圆通快递', id: 'S04' },
        { name: '百世汇通', id: 'S05' },
        { name: 'DHL', id: 'S06' },
        { name: 'FedEx', id: 'S07' },
        { name: '韵达快递', id: 'S08' },
        { name: '天天快递', id: 'S09' },
        { name: 'TNT', id: 'S10' },
        { name: '全峰快递', id: 'S11' },
        { name: '如风达', id: 'S12' },
        { name: '中通快递', id: 'S13' },
        { name: '其他', id: 'S99' }
      ],
      //安全技术类别
      saveLevel: [
        {
          name: '请选择',
          id: ''
        },
        {
          name: 'A类',
          id: 'A'
        },
        {
          name: 'B类',
          id: 'B'
        },
        {
          name: 'C类',
          id: 'C'
        },
        {
          name: '/',
          id: '/'
        }
      ],
      //检测周期
      checkWeek: [
        {
          name: '请选择',
          id: '',
          MAPKUP: '',
          HURRC:''
        },
        {
          name: '常规4天(加收0%费用)',
          id: '1',
          MARKUP: 'M0',
          HURRC: 'UG0',
          per:1
        },
        {
          name: '加急3天(加收50%费用)',
          id: '2',
          MARKUP: 'M5',
          HURRC: 'UG1',
          per: 1.5
        },
        {
          name: '加急2天(加收100%费用)',
          id: '3',
          MARKUP: 'MA',
          HURRC: 'UG5',
          per: 2
        },
        {
          name: '加急1天(加收200%费用)',
          id: '4',
          MARKUP: 'ML',
          HURRC: 'UG2',
          per: 3
        }
      ],
      userList: ['请选择'],
      //标注等级
      tagLevel: [
        {
          name: '请选择',
          id: ''
        },
        {
          name: '优等品',
          id: 'A7'
        },
        {
          name: '一等品',
          id: 'A6'
        },
        {
          name: '二等品',
          id: 'A3'
        },
        {
          name: '合格品',
          id: 'B4'
        },
        {
          name: '/',
          id: '/'
        },
        // {
        //   name: '第二类',
        //   id: 'A1'
        // },
        // {
        //   name: '第一类',
        //   id: 'A2'
        // },
        
        // {
        //   name: '二格品',
        //   id: 'A4'
        // },
       
       
        // {
        //   name: '一级',
        //   id: 'B1'
        // },
        // {
        //   name: '二级',
        //   id: 'B2'
        // },
        // {
        //   name: '三级',
        //   id: 'B3'
        // },
        
        // {
        //   name: '不合格品',
        //   id: 'B5'
        // },

      ], //报告语言
      language: [
        {
          name: '请选择',
          id: '',
        },
        {
          name: '中文',
          id: '1',
        },
        {
          name: '英语',
          id: 'E',
        },
        {
          name: '中英文',
          id: 'Z',
        }
      ],  //发送方式
      sendType: [
          {
            name: '电子档报告',
            id: '1'
          }, 
          {
            name: '纸质报告',
            id: '2'
          },
          {
            name: '电子档报告与纸质报告',
            id: '3'
          },
          ],
      invoiceContent: [
        {
          name: '明细',
          id: 'detail'
        },
        {
          name: '测试费',
          id: 'test_fee'
        },
        {
          name: '检查费',
          id: 'examining'
        },
        {
          name: '检验费',
          id: 'checkout'
        },
        {
          name: '技术服务费',
          id: 'technology'
        }
      ],
      uspdlList:[
        {
          name:'无需退样',
          id:1
        },
        {
          name: '退回送样方（快递费由委托方承担）',
          id: 2
        },
        // {
        //   name: '退还成衣',
        //   id: 3
        // },
      ]
    }
    this.getSafeClassify()
    this.getCategoryList()
  }
  //获取安全技术类别
  getSafeClassify() {
    var ajax = new Ajax({
      data:{},
      header: {
        Token: User.userId
      },
      path: _interface.getSptyp  // _interface.get_shop_banner //
    })
    ajax.then(res => {
     
      if (res.errcode == 0) {
        this._options.saveLevel=res.data;

      }


    })
    ajax.catch(err => {
   
      console.log(err)
    })
  }
  //获取用途
  getCategoryList() {
    var ajax = new Ajax({
      data: {},
      header: {
        Token: User.userId
      },
      path: _interface.getCatecory  // _interface.get_shop_banner //
    })
    ajax.then(res => {

      if (res.errcode == 0) {
        let arr=[];
        res.data.forEach(item=>{
          arr.push(item.name)
        })
        this._options.userList = ['请选择', ...arr] ;
        console.log(this._options.userList)
      }


    })
    ajax.catch(err => {

      console.log(err)
    })
  }
}
let op = new Options()
export default op._options