module.exports = options=>{
  return  async (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource)//复数转为大驼峰单数
    req.Model = require(`../models/${modelName}`)
    next()
  }
}