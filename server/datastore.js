const mongodb = require('mongodb').MongoClient;
const moongose = require('mongoose')



const shortid=require('shortid')
let DB_URI='mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB
let db=false

const datastore = {
  DB_URI:DB_URI,
  insertOrGet:(value)=>{
    return new Promise((resolve,reject)=>{
      try{
        db=false
        mongodb.connect(DB_URI,(err,client)=>{
        if(!err)
        {
          db=client
          let database = client.db(process.env.DB)
          let collection = database.collection(process.env.COLLECTION)
          collection.find({url:value}).toArray((err,documents)=>{
            if(!err)
            {
              if(documents.length>0)
                resolve(documents[0])
              else
              {
                let key = shortid.generate()
                 collection.insert({_id:key,url:value},(err,res)=>{
                   if(err)
                     reject(DatastoreKeyAlreadyExistsException({key}))
                   else
                   {
                     resolve(res.ops[0])
                   }
                 })    
              }
            }
          })
        }
        else reject(new DatastoreUnknownException('insert',value,{})) 
      })
      }
      finally
      {
        if(db){
          console.log("closing db")
          db.close()
          db=false
        }
          
      }
    })
  },
  get : (value)=>{
    return new Promise((resolve,reject)=>{
      try{
        db=false
        mongodb.connect(DB_URI,(err,client)=>{
        if(!err)
        {
          db=client
          let database = client.db(process.env.DB)
          let collection = database.collection(process.env.COLLECTION)
          collection.find({_id:value}).toArray((err,documents)=>{
            if(!err)
            {
              console.log("was here",documents.length,value)
              if(documents.length>0)
                resolve(documents[0]["url"])
              else
              {
                reject(new DatastoreKeyNotFoundException(value))  
              }
            }
          })
        }
        else reject(new DatastoreUnknownException('get',value,{})) 
      })
      }
      catch(ex){
        reject({
          error:"Not a valid shortcode"
        })
      }
      finally{
        if(db)
        {
          console.log("closing db")
          db.close()
          db=false
        }
      }
    })
  },
  getAll: ()=>{},
  
  

 }

function DatastoreKeyNeedToBeStringException(keyObject) {
  this.type = this.constructor.name;
  this.description = "Datastore can only use strings as keys, got " + keyObject.constructor.name + " instead.";
  this.key = keyObject;
}

function DatastoreKeyAlreadyExistsException(keyObject) {
  this.type = this.constructor.name;
  this.description = "Datastore key "+keyObject+" already exists";
  this.key = keyObject;
}

function DatastoreKeyNotFoundException(keyObject) {
  this.type = this.constructor.name;
  this.description = "Datastore key "+keyObject+" not found";
  this.key = keyObject;
}

function DatastoreNotInstantiatedException() {
  this.type = this.constructor.name;
  this.description = "This datastore instance was not instatiated before being accessed";
}

function DatastoreUnderlyingException(params, ex) {
  this.type = this.constructor.name;
  this.description = "The underlying MongoDB instance returned an error";
  this.params = params;
  this.error = ex;
}
function DatastoreUnknownException(method, args, ex) {
  this.type = this.constructor.name;
  this.description = "An unknown error happened during the operation " + method;
  this.method = method;
  this.args = args;
  this.error = ex;
}

function DatastoreValueSerializationException(value, ex) {
  this.type = this.constructor.name;
  this.description = "Failed to serialize the value to JSON";
  this.value = value;
  this.error = ex;
}

function DatastoreDataParsingException(data, ex) {
  this.type = this.constructor.name;
  this.description = "Failed to deserialize object from JSON";
  this.data = data;
  this.error = ex;
}


module.exports = datastore