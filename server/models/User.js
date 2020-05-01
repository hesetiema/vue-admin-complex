const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username:{type:String},
  password:{
    type:String,
    select:false,
    set(val){
      return require('bcryptjs').hashSync(val,10)
    }
  },
  roles:{type:Array},
  introduction:{type:String},
  avatar:{type:String},
  name:{type:String}
})

module.exports = mongoose.model('User',schema)