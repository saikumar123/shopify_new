const jwt = require('jsonwebtoken')
const config = require('./authConfig')

module.exports = (req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Credentials',true);
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  const token = req.cookies.token
  const rToken = req.cookies.refreshToken;
  const userId = req.cookies.userId;
  console.log("request cookies is ", req.cookies.token);
  console.log("response cookie is ", res.cookie());
  //req.headers['x-access-token']
  
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      console.log(err);
        if (err) {
          if(err.name === 'TokenExpiredError') {
            jwt.verify(rToken, config.refreshTokenSecret, function(err, decoded) {

              if(err){
                return res.status(401).json({"error": true, "message": 'Unauthorized access.' });        
              }
              const newToken = jwt.sign({ id: userId }, config.secret, {              
                expiresIn : config.tokenLife, 
              });
                
              res.cookie('token', newToken, { httpOnly: true });    
              
            });
           
          } else {
          return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
          }
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'No token provided.'
    });
  }
}