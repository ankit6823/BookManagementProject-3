const jwt = require("jsonwebtoken");
const bookModel = require("../model/booksModel");
const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const booksModel = require("../model/booksModel");

//[ALL AUTHENTICATION LOGIC HERE ] 
const authentication = function (req, res, next) {
  try {

    const token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ status: false, message: "Token must be present" });
    }

    jwt.verify(token, "functionup-radon", function (error, decodedToken) {
      if (error) {
        return res.status(401).send({ status: false, message: "token invalid" });
      }
      req.userId = decodedToken.userId
      next();
    });

  }
  catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


const auth2 = async function (req, res, next) {
  let token = req.headers["X-Api-key"];
  if (!token) token = req.headers["x-api-key"]

  //If no token is present in the request header return error
  if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

  let decodedtoken = jwt.verify(token, "functionup-radon")
  console.log(decodedtoken.userId)
  let id = req.body.userId
  if (decodedtoken.userId == id) {
    next()
  }
  else {
    return res.status(403).send({ status: false, msg: "The Login User Are not authorize to do this Or Given Token in header Is Invalid" })
  }
}

exports.authForDelAndUp = async function (req, res, next) {
  let token = req.headers["X-Api-key"];


  if (!token) token = req.headers["x-api-key"]

  //If no token is present in the request header return error
  if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
  const { bookId } = req.params
  if (!bookId) return res.status(400).send({ status: false, msg: "book id must be present" });
  if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "book id is invalid" });
  const curUser = await booksModel.findOne({ _id: bookId }).select({ _id: 0, userId: 1 })
  console.log(curUser.userId.toString(), "cur user")
  let decodedtoken = jwt.verify(token, "functionup-radon")
  console.log(decodedtoken.userId, "decodeTo")
  if (curUser.userId.toString() == decodedtoken.userId) {
    next()
  } else {
    return res.status(403).send({ status: false, msg: "The Login User Are not authorize to do this Or Given Token in header Is Invalid" })
  }

}


module.exports.auth2 = auth2


module.exports.authentication = authentication;