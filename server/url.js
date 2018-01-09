'use strict'
const express = require('express');
const short_url_factory = require('./short_url.js');
const router = express.Router();
const validUrl = require('valid-url')
const urlValidator = function(req,res,next){
  const url = validUrl.isWebUri(req.params[0]);
  if(url!==undefined)
    {
      res.locals.url = url
      next()
    }
  else
    {
      res.status(422).json({"error":"The URI must be a valid web URI"})
    }
}


router.use('/make/*',urlValidator)

router.get('/make/*',function(req,res){
  short_url_factory.createShortUrlAsync(res.locals.url).then((urlObject)=>{
    res.status(201).json(urlObject)
  }).catch(function(err){
    console.log(err)
    res.status(500).send(err)
  })
})

router.get('/all',function(req,res){
  
})
  
// router.use('/*',urlValidator)
router.get('/:shortcode',function(req,res){
    const shortcode = req.params.shortcode;
    short_url_factory.getUrlAtAsync(shortcode).then((url)=>{
      res.redirect(url)
    }).catch((err)=>{
      console.log(err)
      res.status(500).send(err)
    })
  })
    
  



module.exports = {
  router:router
}