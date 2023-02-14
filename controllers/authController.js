const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const foundUser =
    (await User.findOne({ username }).exec()) ||
    (await User.findOne({ email }).exec());

  if (!foundUser) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (foundUser.status != 'Active') {
    return res.status(401).send({
      message: 'Pending Account. Please Verify Your Email!'
    });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match)
    return res.status(401).json({ message: 'Password is not correct' });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1m' }
  );

  const refreshToken = jwt.sign(
    {
      username: foundUser.username
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1m' }
  );

  //Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'None', //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  res.json({ accessToken });
});

module.exports = { login };
