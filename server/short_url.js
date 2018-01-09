'use strict'
const datastore = require('./datastore.js')
const crypto = require('crypto');
const base64url = require('base64url');
const size = 5;
const getRandomKey =(size) =>{
  return base64url(crypto.randomBytes(size)) 
}

const createShortUrlAsync = (url)=>{
  return new Promise((resolve,reject)=>{
    try{
      const key = getRandomKey(size)
      datastore.insertOrGet(url).then((urlObject)=>{
      resolve(urlObject)  
      })
      
    }
    catch(err)
      {
      reject(new urlNotCreatedException(url,err)) 
  }
  })
}

const getUrlAtAsync = (key)=>{
  return new Promise((resolve,reject)=>{
    try{
      resolve(datastore.get(key))
    }
    catch(err)
    {
        reject(new urlKeyNotFoundException(key,err))
    }
  })
}

 
 
 
 const exceptionFactory=(type,description,url,err)=>({
  type,
  description,
  url,
  err
})
function urlNotCreatedException(url,err){
  return exceptionFactory(this.constructor.name,"The requested URL wasn't created",url,err)
}

function urlKeyNotFoundException(key,err){
  return exceptionFactory(this.constructor.name,"The requested Key wasn't found in the database",key,err)
}


module.exports = {
  createShortUrlAsync: createShortUrlAsync,
  getUrlAtAsync:getUrlAtAsync,
}