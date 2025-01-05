// GoogleOAuthController.js

exports.homePage = (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  };
  
  exports.isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
  };
  
  exports.protectedPage = (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
  };
  
  exports.googleAuthFailure = (req, res) => {
    res.send('Failed to authenticate..');
  };
  
  exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);  // Handle any error that occurs during logout
      }
      req.session.destroy((err) => {
        if (err) {
          return next(err);  // Handle error if session destruction fails
        }
        res.send('Goodbye!');  // Send a response after session is destroyed
      });
    });
  };
  

  
  