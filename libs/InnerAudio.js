export default class InnerAudio{
  constructor(options){
    let prama = options||{}
    this.innerAudioContext = wx.createInnerAudioContext();
    this.init(prama);
    this.isPlay=true
    return this
  }
  destroy(){
    this.innerAudioContext.destroy()
  }
  play(src){
    if (!this.isPlay) return 
    this.src=src;
    this.innerAudioContext.src = src;
    this.innerAudioContext.play();
    return this
  }
  stop(){
    this.innerAudioContext.stop();
    this.isPlay = true;
    return this
  }
  init(prama){
    this.innerAudioContext.autoplay = prama.autoplay || false;//默认为不自动播放
    if(prama.src)
    {
      this.src = prama.src;
      this.innerAudioContext.src = prama.src
    }
    //停止播放
    this.innerAudioContext.onStop(() => {
      this.isPlay = true;
      
      if (prama.onStop) {
        prama.onStop()
      }
      console.log('开始播放')
    })
    //开始播放事件
    this.innerAudioContext.onPlay(() => {
      this.isPlay = false;
     
      if (prama.onPlay) {
        prama.onPlay()
      }
      console.log('开始播放')
    })
    //音频自然播放结束事件
    this.innerAudioContext.onEnded(()=>{
      this.isPlay = true;
      console.log('停止播放')
      //音频自然播放结束事件
      if (prama.onEnded) {
        prama.onEnded()
      }
    })
  }

}