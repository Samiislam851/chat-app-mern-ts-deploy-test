
const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  
    const token = req.headers.authorization?.split(' ')[1]
    // console.log(req.headers);
    if (!token) {
        console.log('token was not given');
        res.status(400).json({ success: false, message: 'token was not given' })
        return
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification failed');

            res.status(401).json({ success: false, message: 'Unauthorized' }) 
            return

        } else if (!decoded) {
            console.error('Decoded payload is undefined');


            res.status(500).json({ success: false, message: 'Server Error Payload undefined' })
            return
        }

        else {
            // console.log('token verified');
            req.decoded = decoded
            next()
        }
    })
 
}
module.exports = verifyJWT