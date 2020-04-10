# MongoDB 基础

## 1、windows 环境配置及连接

- 配置：查看配置文件`mongod.cfg`，若已指定数据及日志目录，则无需再设置
- 连接：管理员身份打开 cmd 后执行`net start mongodb`
- 关闭：`net stop mongodb`

## 2、MongoDB 后台管理 Shell

- 概念：MongoDB Shell 是 MongoDB 自带的交互式 Javascript shell,用来对 MongoDB 进行操作和管理的交互式环境
- 打开：执行`mongo.exe`即可进入`mongodb shell`，默认会链接到 test 文档(数据库)
- 操作：db 命令用于查看当前操作的文档（数据库）
  - 如`db.runoob.insert({x:10})`插入数字 10 到 runoob 集合的 x 字段

## 3、基础概念

| SQL 术语    | MongoDB 术语 | 说明                        |
| ----------- | ------------ | --------------------------- |
| database    | database     | 数据库                      |
| table       | collection   | 表/集合                     |
| row         | document     | 记录行/文档                 |
| column      | field        | 记录列/字段                 |
| index       | index        | 索引                        |
| primary key | primary key  | 主键，mongodb 以`_id`为主键 |

## 4、数据库

- MongoDB 默认当前数据库为"db"，存储在 data 目录中，初始指向 test 数据库
- 保留数据库
  - admin："root"权限数据库。数据库用户自动继承所有数据库的权限。一些特定的服务器端命令也只能从这个数据库运行
  - local：这个数据永远不会被复制，用来存储限于本地单台服务器的任意集合
  - config：Mongo 用于分片设置时，config 数据库在内部使用来保存分片信息
- **切换/创建数据库**：`use DATABASE_NAME`数据库不存在则创建数据库
  - 刚创建的数据库并不在数据库的列表中， 要显示它需要向其插入一些数据
- **删除数据库**：`db.dropDatabase()`删除当前数据库
- **查看数据库**：`show dbs`

## 5、集合

- 集合就是 MongoDB 文档组，类似于 RDBMS （关系数据库管理系统：Relational Database Management System)中的表格
- 合法的集合名
  - 不能是空字符串""
  - 不含有\0 字符（空字符)，这个字符表示集合名的结尾
  - 不能以"system."开头，这是为系统集合保留的前缀
  - 用户创建的集合名字不能含有保留字符
- Capped collections ：固定大小的 collection，非常适合类似记录日志的功能
  - 按照文档的插入顺序而不是使用索引确定插入位置，提高增添数据的效率
  - 创建：如`db.createCollection("mycoll", {capped:true, size:100000})`
  - 特点：
    - 能进行更新，然而对象不会增加存储空间
    - 不能删除一个文档，可以使用 drop() 方法删除 collection 所有的行
    - 删除之后，你必须显式的重新创建这个 collection
- 元数据之系统集合：`<dbname>.system.*`是包含多种系统信息的特殊集合
- **创建集合**：`db.createCollection(COLNAME,options)`
  - MongoDB 中可不需创建集合。插入一些文档时，MongoDB 会自动创建集合
  - options 可选，相关参数如下
    - capped——当该值为 true 时，必须指定 size 参数，创建固定大小集合
    - autoIndexId——如为 true，自动在 \_id 字段创建索引
    - size——数值类型，为固定集合指定一个最大值，以千字节计（KB）
    - max——数值类型，指定固定集合中包含文档的最大数量
- **删除集合**：`db.COLNAME.drop()`
- **查看集合**：`show collections` 或 `show tables`

## 6、文档

> insert/find/update/save/delete

- **插入文档**：`db.COLNAME.insert(document)`、`db.COLNAME.save(document)`
  - `db.COLNAME.insertOne()/insertMany()`向指定集合中插入一条/多条文档数据
  - 若不指定`_id`字段，`save`方法类似`insert`方法
  - 若指定`_id`字段，则`save`方法会更新该`_id`数据
  - 可将数据定义为一个变量，执行插入操作
- **查看文档**：`db.COLNAME.find()`、`db.COLNAME.find().pretty()`
  - `db.COLNAME.find(query, projection)`
    - query：可选，使用查询操作符指定查询条件，为`{}`时返回所有
    - projection：可选，使用投影操作符指定返回键，不指定默认返回所有键
      - projection 中，入参格式为`{columnA : 0/1,columnB : 0/1}`
      - 1 表示只返回指定键`column`，0 表示不返回指定键`column`
    - AND 及 OR 条件混用：`db.COLNAME.find({"likes": {$gt:50}, $or: [{"by": "菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty()`
- **更新文档**：
  - `db.COLNAME.update(<query>,<update>,options)`
    - `db.COLNAME.updateOne()/updateMany()`用于更新已存在的单个/多个文档
    - `query`：查询条件，同`sql`更新查询内`where`后面
    - `update`：更新的对象及操作符(`$,$inc`...)，同`sql`更新查询内`set`后面
    - `upsert`：若不存在`update`记录，是否插入`objNew`，默认`false`不插入
    - `multi`：若存在多条记录，是否全部更新，默认`false`只更新第一条
    - `writeConcern`：抛出异常的级别
    - 举例：`db.col.update({'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}},{multi:true})`
  - `db.collection.save(<document>,{writeConcern:<document>})`
    - save() 方法通过传入的文档来替换已有文档
    - document：文档数据
    - writeConcern：可选，抛出异常的级别
    - 举例：`db.col.save({"_id" : ObjectId("..."),"title" : "MongoDB"})`
- **删除文档**：
  - `db.COLNAME.remove(<query>,options)`
    - remove() 方法并不会真正释放空间，需`db.repairDatabase()`来回收磁盘空间，故不推荐
    - query :删除的文档的条件
    - justOne：若设为 true 或 1，则只删除一个文档，默认 false 删除所有
    - writeConcern：抛出异常的级别
    - 举例：删除一个匹配文档`db.COLNAME.remove(DELETION_CRITERIA,1)`
  - `db.COLNAMAE.deleteOne({})`、`db.COLNAME.deleteMany({})`

## 7、条件操作符

- 比较操作符：如`db.COLNAME.find({likes: {$lt :200, $gt : 100}})`
  - \$gt -------- greater than  >
  - \$gte --------- gt equal  >=
  - \$lt -------- less than  <
  - \$lte --------- lt equal  <=
  - \$ne ----------- not equal  !=
  - \$eq  --------  equal  =
- 模糊查询
  - `db.COLNAME.find({title:/教/})`查询 title 包含"教"字的文档
  - `db.COLNAME.find({title:/^教/})`查询 title 字段以"教"字开头的文档
  - `db.COLNAME.find({title:/教$/})`查询 title 字段以"教"字结尾的文档
- \$type 操作符：基于 BSON 类型来检索集合中匹配的数据类型，并返回结果
  - 如`db.COLNAME.find({"title" : {$type : 'string'}})`

## 8、limit 与 skip 方法、sort 排序

- limit() 方法接受一个数字参数，指定从 MongoDB 中读取的记录条数
- skip() 方法同样接受一个数字参数，跳过指定数量的数据记录
- sort() 方法可以通过参数指定排序的字段，其中 1 为升序排列，而 -1 降序
- 举例：`db.COLNAME.find({},{"title":1,_id:0}).sort({"likes":-1}).skip(1).limit(1)`
