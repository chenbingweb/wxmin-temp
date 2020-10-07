 let jobList=require("../utils/job.js")
 class Job{
  constructor(){
  
    return this
  }
  getHangYe(){
    return jobList.data
  }
}
export default new Job()