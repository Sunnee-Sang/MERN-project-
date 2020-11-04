const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    //pagination
    let num = 7;
    let pageNum = (parseInt(req.query.page) - 1) * num;
    if(pageNum < 0) {
        pageNum = 0;
    }
    //search info
    let searchInfo = {};
    if(req.query.term) {
        //console.log("this is search api");
        let content = req.query.term;
        let isNum = /^\d+$/.test(content);
        let age = isNum? parseInt(content): "";
        let searchItems = [
            {firstName: {$regex : `.*${content}.*`, $options: 'i'}}, 
            {lastName: {$regex : `.*${content}.*`, $options: 'i'}}, 
            {sex: {$regex : `.*${content}.*`, $options: 'i'}}
        ];
        if(age !== "") {
            searchItems.push({age: age});
        }
        searchInfo = {$or: searchItems};
    } 
    //sort info
    let sortInfo = { createdAt: -1 };
    //console.log(sortInfo);
    if(req.query.sort_by) {
        sortInfo = { [req.query.sort_by ]: parseInt(req.query.order)};
    }
    //console.log(sortInfo);
    //Model.find(filter, [projection], [options], [callback])
    User.find(searchInfo) 
        .sort(sortInfo)
        .then((docs)=>{
            const index= docs.length 
            return index;
        })
        .then((index) => {res.json(index)})
        .catch((err)=>{
            //error handle
            res.json(err);
        });
});

module.exports = router