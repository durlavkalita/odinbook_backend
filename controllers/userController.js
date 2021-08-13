var User = require('../models/User');
const {body, validationResult} = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

// POST user register
exports.register = [
    body('firstName', 'Enter Firstname').trim().isLength({min:1}).escape(),
    body('lastName', 'Enter Lastname').trim().isLength({min:1}).escape(),
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
                }
            );
            bcrypt.hash(req.body.password, 10, (error, hashedPassword)=> {
                if(error) {return next(error);}
                user.set('password', hashedPassword);
                user.save(error=> {
                    if(error) {return next(error);}
                    res.locals.user = req.user;
                    res.status(200).json({
                        message: "Signin Succesful",
                        user: req.user,
                    });
                })
            });
        }
    }
]

// POST user signin
exports.signin = [
    body('firstName', 'Enter Firstname').trim().isLength({min:1}).escape(),
    body('lastName', 'Enter Lastname').trim().isLength({min:1}).escape(),
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
                }
            );
            bcrypt.hash(req.body.password, 10, (error, hashedPassword)=> {
                if(error) {return next(error);}
                user.set('password', hashedPassword);
                user.save(error=> {
                    if(error) {return next(error);}
                    res.locals.user = req.user;
                    res.status(200).json({
                        message: "Signin Succesful",
                        user: req.user,
                    });
                })
            });
        }
    }
]


// GET user signout
exports.signout = function(req,res,next) {
    req.logout();
    res.status(200).json({message: "Signout Successful."})
}