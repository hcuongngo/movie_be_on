import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs'
import 'dotenv/config.js'
import jwt from 'jsonwebtoken'
import { handleResponseError, handleResponseSuccess } from '../utils/response.js';

const generateAccessToken = (user) => {
  return jwt.sign({ user }, process.env.SECRET, {expiresIn: "1d"})
}

const register = async (req, res) => {
  const { email, password } = req.body
  console.log({ email, password })
  if (!email || !password) {
    handleResponseError(res, 400, 'All fields required');
    return
  }

  const existEmail = await User.findOne({ email })
  if (existEmail) {
    handleResponseError(res, 400, 'Email already exists')
    return
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const data = await User.create({ email, password: hashedPassword })
    console.log("data", data)
    handleResponseSuccess(res, 201, "Register successfully", {email: data.email, role: data.role})
    return
  } catch (error) {
    handleResponseError(res, 500, error.message)
  }
}

const login = async (req, res) => {
  console.log("login")
  const { email, password } = req.body

  if (!email || !password) {
    handleResponseError(res, 400, 'All fields required');
  }

  const user = await User.findOne({ email })
  if (!user) {
    handleResponseError(res, 401, 'Incorrect email');
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    handleResponseError(res, 401, 'Incorrect password');
  }

  try {
    const accessToken = generateAccessToken(user)
    handleResponseSuccess(res, 200, "Login successfully", { email, accessToken })
  } catch (error) {
    handleResponseError(res, 500, error.message)
  }
}

const logout = (req, res) => {
  // maybe delete fresh token he
  res.send('logout success')
}


export { register, login, logout }  
