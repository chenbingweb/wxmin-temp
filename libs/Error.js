/**
 * 
    ReferenceError:找不到对象时
    TypeError:错误的使用了类型或对象的方法时
    RangeError:使用内置对象的方法时，参数超范围
    SyntaxError:语法写错了
    EvalError:错误的使用了Eval
    URIError:URI错误
 * 
 */
export default class Err{
  constructor(){
    return this
  }
  //提示错误信息
 static printErr(errContent){
    throw new Error(errContent);  
  }
}