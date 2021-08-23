var User = require('../models/User');
const {body, validationResult} = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// POST user register
exports.register = [
    body('firstName', 'Enter Firstname').trim().isLength({min:1}).escape(),
    body('lastName', 'Enter Lastname').trim().isLength({min:1}).escape(),
    body('email', 'Enter Email').trim().isLength({min:1}).escape(),
    body('password', 'Enter Password of min 8 character').trim().isLength({min:8}).escape(),
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(401).json({
                name: req.body.firstName + ' ' + req.body.lastName,
                errors: errors.array()
            });
            return;
        }
        else {
            var user = new User(
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email
                }
            );
            bcrypt.hash(req.body.password, 10, (error, hashedPassword)=> {
                if(error) {return next(error);}
                user.set('password', hashedPassword);
                user.save(error=> {
                    if(error) {return next(error);}
                    jwt.sign({user}, 'secretkey', {expiresIn: '1d'},(err,token)=>{
                        res.json({
                            token, user
                        })
                    });
                })
            });
        }
    }
]

// POST user login
exports.login = [
    body('email', 'Enter Email').trim().isLength({min:1}).escape(),
    body('password', 'Enter Password of min 8 character').trim().isLength({min:8}).escape(),
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(401).json({
                email: req.body.email,
                errors: errors.array()
            });
            return;
        }
        else {
            User.findOne({email:req.body.email}).
            then((user)=>{
                if(!user) {
                    res.status(404).json({
                        msg: 'user not found'
                    });
                    return;
                } else {
                    bcrypt.compare(req.body.password, user.password, (err,isMatch)=>{
                        if(err) { throw err;}
                        if(isMatch) {
                            jwt.sign({user}, 'secretkey', {expiresIn: '1d'},(err,token)=>{
                                res.json({
                                    token
                                })
                            }); 
                        }
                    })
                }
            })
        }
    }
]
// exports.login = (req,res, next) => {
//     try {
//         const user = await User.find({email: });
//     } catch(error) {
//         next(error);
//     }

//     jwt.sign({user}, 'secretkey', {expiresIn: '60s'},(err,token)=>{
//         res.json({
//             token
//         })
//     });
    // passport.authenticate('local', {session: false}, (err, user, info) => {
    //     // if(err || !user) {
    //     //     return res.status(400).json({ msg: 'Something went wrong.' });
    //     // }
    //     if(err) {
    //         return res.status(400).json({ msg: 'Something went wrong.' });
    //     }
    //     if(!user) {
    //         return res.status(400).json({ msg: 'User not found.' });
    //     }
    //     req.login(user, {session: false}, (error)=>{
    //         if (error) res.send(error);
    //         const token = jwt.sign({ user }, process.env.SECRET, {
    //             expiresIn: '1d',
    //         });
    //         return res.json({ user, token });
    //     });
    // })(req,res);
// }


// GET user logout
exports.logout = function(req,res,next) {
    req.logout();
    res.status(200).json({message: "Signout Successful."})
}

// GET all users list
exports.all_users = async (req,res,next) => {
    try {
        const users = await User.find({});
        if(!users) {
            return res.status(404).json({error: "No user found"});
        }
        jwt.verify(req.token, 'secretkey', (err,authData)=>{
            if(err) {
                res.sendStatus(403);
            } else {
                res.status(200).json({users});
            }
        });
    } catch (error) {
        next(error);
    }
} 

// GET single user
exports.single_user = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.userid);
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }
        jwt.verify(req.token, 'secretkey', (err,authData)=>{
            if(err) {
                res.sendStatus(403);
            } else {
                res.status(200).json({user});
            }
        });
    } catch (error) {
        next(error);
    }
}

// DELETE user
exports.delete_user = async (req,res,next) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err,authData)=>{
            if(err) {
                res.sendStatus(403);
            } else {
                const user = await User.findByIdAndRemove(req.params.userid, function(err){
                    if(err) {next(err);}
                    res.status(200).json({msg: "user deleted"});
                });
            }
        });
    } catch (error) {
        next(error);
    }
}