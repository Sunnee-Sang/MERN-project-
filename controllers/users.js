const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('./auth');

router.get('/',auth, (req, res) => {
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
    if(req.query.sort_by) {
        sortInfo = { [req.query.sort_by]: parseInt(req.query.order)};
    }
    //Model.find(filter, [projection], [options], [callback])
    User.find(searchInfo)
        .sort(sortInfo)
        .skip(pageNum)
        .limit(num)
        .then((docs)=>{
            if(docs.length === 0) {
                res.status(200).json("Sorry no results");
            } else {
                res.status(200).json(docs);
            }
        })
        .catch((error) => {
            console.error(error);
         });
});

router.get('/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, docs) => {
        if(err) res.json(err);
        else res.json(docs);
    });
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    let updateInfo = req.body;
    const {firstName, lastName, sex, age, password} =req.body
    try { 
     const user = await User.findOneAndUpdate(
         {_id: id},
         {$set: {firstName, lastName, sex, age, password}},
         {new:true}
         );
         user.save();
         res.json(user)
    } catch (err) {
        //console.error("backend work");
        res.status(500).send('Server Error');
      }
   /* User.findById(id, (err, docs) => {
        if(err) {
            res.status(501).json(err);
        } else {
            if(updateInfo.firstName) {
                docs.firstName = updateInfo.firstName;
            }
            if(updateInfo.lastName) {
                docs.lastName = updateInfo.lastName;
            }
            if(updateInfo.sex) {
                docs.sex = updateInfo.sex;
            }
            if(updateInfo.age) {
                docs.age = updateInfo.age;
            }
            if(updateInfo.password) {
                docs.password = updateInfo.password;
            }
            docs.save((err) => {
                if(err) {res.status(501).json(err);
                console.log(err)}
                else res.status(200).json(docs);
            });
        }
    });*/
});


//delete by user id 
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    User.findOneAndDelete({_id: id}, (err, docs) => {
        if(err) {
            res.json(err);
        } else {
            res.status(200).json("delete success");
        }
    });
});

//get by id 
router.get('/:id', (req, res) => {
    let id = req.params.id; 
    User.findById(id, (err, docs)=>{
        if(err) res.json(err);
        else res.json({docs});
    })
});

router.post('/', (req, res) => {
    let user = req.body;
    console.log(req.body);
    let age = 0;
    if(!isNaN(parseInt(user.age))) {
        age = parseInt(user.age);
    }
    const createUser = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        sex: user.sex,
        age: age,
        password: user.password,
        createdAt: new Date()
    });
    createUser.save((err) => {
        if(err) {
            res.status(406).json(err);
        } else {
            //if save succeeded, return user's _id
            res.status(201).json(createUser._id);
        }
    });
});



module.exports = router