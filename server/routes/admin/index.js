const express = require("express");
const router = express.Router();
const User = require("../../models/User");

const authMiddleware = require("../../middleware/auth");
const resourceMiddleware = require("../../middleware/resource");

module.exports = (app) => {
  //资源列表接口
  router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  router.get("/", async (req, res) => {
    const items = await req.Model.find().limit(20);
    res.send(items);
  });
  //资源详情接口
  router.get("/:id", async (req, res) => {
    const item = await req.Model.findById(req.params.id);
    res.send(item);
  });
  router.put("/:id", async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  router.delete("/:id", async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id);
    res.send({
      success: "delete ok!",
    });
  });
  app.use(
    "/dev-api/rest/:resource",
    authMiddleware(),
    resourceMiddleware(),
    router
  );

  app.post("/dev-api/users",async(req,res)=>{
    const {username, password,name,introduction,avatar,roles} = req.body;

    const user = await User.findOne({ username }).select("+password");
    if(user){
      return res.status(422).send({
        message:"用户已存在"
      })
    }

    let doc = {
      username, 
      password,
      name,
      introduction,
      avatar,
      roles
    }
    const document = await User.insertMany([doc])
    if(!document){
      return res.status(422).send({
        message:"数据存入失败"
      })
    }
    res.send({
      message:"新建用户成功",
      row:document
    })
  })

  app.get("/dev-api/users",async(req,res)=>{
    const rows = await User.find()
    if(!rows){
      return res.status(422).send({
        message: "用户列表不存在",
      });
    }
    res.send({
      message:"获取用户列表成功",
      data:rows
    })
  })

  app.delete('/dev-api/users/:username', async (req, res) => {
    const document = await User.deleteOne({"username":req.params.username})
    if (!document){
      res.status(422).send({
        message:`删除用户名${req.params.username}失败`,
      })
    }
    res.send("delete ok")
  });

  app.post("/dev-api/users/login", async (req, res) => {
    const { username, password } = req.body;
    //1.由用户名找用户
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(422).send({
        message: "用户不存在",
      });
    }
    //2.校验密码
    const isValid = require("bcryptjs").compareSync(password, user.password);
    if (!isValid) {
      return res.status(422).send({
        message: "密码错误",
      });
    }
    //3.加密 playload，返回token
    const jwt = require("jsonwebtoken");
    const playload = {
      id: user._id,
    };
    const secret = app.get("secret");
    const token = jwt.sign(playload, secret, { expiresIn: 60 * 60 * 1 });
    res.send({
      message: "登录成功",
      token: token,
    });
  });

  app.get("/dev-api/users/info", async (req, res) => {
    const token = req.headers["authorization"].split(" ")[1];
    if (token) {
      const jwt = require("jsonwebtoken");
      jwt.verify(token, app.get("secret"), async function (err, decoded) {
        if (err) {
          return res.send({
            name: err.name,
            message: err.message,
          });
        } else {
          const { id } = decoded;
          const user = await User.findOne({ _id: id });
          const { name, avatar, introduction, roles } = user;
          return res.send({
            name,
            avatar,
            introduction,
            roles,
          });
        }
      });
    } else {
      return res.send({
        message: "未提供token",
      });
    }
  });
  app.post("/dev-api/users/logout", async (req, res) => {
    res.send("logout ok!");
  });

  //错误处理
  app.use(async (err, req, res, next) => {
    res.status(err.status || 500).send({
      message: err.message,
    });
  });
};
