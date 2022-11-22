import mongoose,{connect} from 'mongoose';

function connects(){
  return connect("mongodb+srv://functionup-cohort:G0Loxqc9wFEGyEeJ@cluster0.rzotr.mongodb.net/rushikesh9075-DB?authSource=admin&replicaSet=atlas-9zusex-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true")
  .then(()=>{
    console.log("DB is connected")
  }).catch((error:any)=>{
    console.log(error)
  })
}

export default connects