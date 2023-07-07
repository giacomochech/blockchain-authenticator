const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://user:user@cluster1.dqod0q0.mongodb.net/blockchain", { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    }
})
const user=new mongoose.model('user',userSchema);

const companySchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
})

const company=new mongoose.model('companies',companySchema)

module.exports={
    user,
    company
}