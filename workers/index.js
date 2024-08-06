worker.onMessage( (data)=> {
  for(let i=0;i<data.length;i+=4){
    let r=data[i]
    let g=data[i+1]
    let b=data[i+2]
    let a=data[i+3]
    console.log(r,g,b,a)
    if((r+g+b)<100 && a==255){
     
      data[i+3]=0
    }
  }
  
  
  worker.postMessage({
    res:data
  })
})
