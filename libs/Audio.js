export default class AudioSource {

  constructor(options){
      this._audo = wx.createInnerAudioContext();
      let param = {
        autoplay: false
      }
      param = Object.assign(param, options)
      console.log(param)
      for (let key in param) {
        this._audo[key] = param[key]
      }
      this._audo.onPlay(() => {
        console.log('开始播放')
      })
      return this
    }
    //音频播放
    play(options){
      this._audo.play()
    }
    stop(){
      this._audo.stop()
    }
}