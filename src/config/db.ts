import mongoose,{connect} from 'mongoose';

function connects(){
  return connect("mongodb+srv://sanchita123:sanchita@cluster0.r5mjtyo.mongodb.net/test")
  .then(()=>{
    console.log("DB is connected")
  }).catch((error:any)=>{
    console.log(error)
  })
}

export default connects