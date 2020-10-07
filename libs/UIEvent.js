//事件封装
class UIEvent {
  constructor() {
    this._evtList = []
  }

  On(obj, func) {
    this._evtList.push([obj, func]);
    return this;
  }

  Off(func) {
    for (let i = 0; i < this._evtList.length; i++) {
      if (this._evtList[i][1] === func) {
        this._evtList.splice(i, 1);
        return;
      }
    }
  }

  Clear() {
    this._evtList = []
  }

  Emit(...param) {

    for (let i = 0; i < this._evtList.length; i++) {
      let kv = this._evtList[i];
      kv[1] && kv[1].call(kv[0], ...param);
    }
    // console.log(this._evtList)
  }
}

export { UIEvent }