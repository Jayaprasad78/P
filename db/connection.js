const M=require('mongoose')
M.connect('mongodb://localhost:27017/user_311_class')
.then( ()=>{
    console.log("server is connected to database")
})
.catch( ()=>{
    console.log("database is not connected")
})
