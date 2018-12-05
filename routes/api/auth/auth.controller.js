const jwt = require('jsonwebtoken')
const Member = require('../../../models/Member')
/*
    POST /api/auth
*/

exports.register = (req, res) => {
    const { id, password, name, email, role } = req.body

    // create a new user if does not exist
    const create = (member) => {
        if(member) {
            throw new Error('username exists')
        } else {
            return Member.create(id, password, name, email, role)
        }
    }

    // respond to the client
    const respond = () => {
        res.json({
            message: 'registered successfully'
        })
    }

    // run when there is an error (username exists)
    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }

    // check username duplication
    Member.findOneByUsername(id)
        .then(create)
        .then(respond)
        .catch(onError)
}
/*
    POST /api/auth/login
    {
        username,
        password
    }
*/

exports.login = (req, res) => {
    const {id, password} = req.body
    const secret = req.app.get('jwt-secret')

    // check the user info & generate the jwt
    const check = (member) => {
        if(!member) {
            // user does not exist
            throw new Error('login failed')
        } else {
            // user exists, check the password
            if(member.verify(password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: member._id,
                            id: member.id,
                            name: member.name,
                            email: member.email,
                            role: member.role
                        },
                        secret,
                        {
                            expiresIn: '7d',
                            issuer: 'space',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        })
                })
                return p
            } else {
                res.json({
                    success: false
                })
                throw new Error('login failed')
            }
        }
    }

    // respond the token
    const respond = (token) => {
        res.json({
            success: true,
            token
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    Member.findOneByUsername(id)
        .then(check)
        .then(respond)
        .catch(onError)

}
/*
    GET /api/auth/check
*/

exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}