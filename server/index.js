const express= require('express');
const app = express()

app.use(express.json())
app.use(require('cors')())
require('./routes/admin/index')(app)
require('./plugins/db')(app)

app.set('secret','test')


app.listen(3000, () => {
  console.log('App listening on port 3000!');
});