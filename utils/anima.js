class Ani {
  constructor() {
    this.animation = wx.createAnimation({
      duration: 1000,
      delay: 2000,
      timingFunction: 'ease',
    })
  }
  opacity() {
    this.animation.opacity(1);
    // this.animation.rotate(45).scale(2, 2);
    return this.animation
  }

}
export default new Ani()