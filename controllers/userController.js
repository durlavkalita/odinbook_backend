var User = require('../models/User');
const {body, validationResult} = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
require('../config/auth');

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
                    const body = {_id: user._id, email: user.email};
                    const token = jwt.sign({ user: body }, 'secret');
                    
                    return res.json({ token });
                })
            });
        }
    }
]

// POST user login
exports.login = async (req,res,next)=>{
    passport.authenticate('login', {session: false}, async (err,user,info)=>{
        try {
            if(err || !user) {
                return next(err);
            }

            req.login(user, {session: false}, async(error)=>{
                if(error) return next(error);
                
                const body = {_id: user._id, email: user.email};
                const token = jwt.sign({ user: body }, 'secret');

                return res.json({ token });
            })
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
}

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
        res.status(200).json({users});
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

        res.status(200).json({user});
    } catch (error) {
        next(error);
    }
}

// DELETE user
exports.delete_user = async (req,res,next) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userid, function(err){
            if(err) {next(err);}
            res.status(200).json({msg: "user deleted"});
        });
    
    } catch (error) {
        next(error);
    }
}