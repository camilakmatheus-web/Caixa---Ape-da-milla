const express = require ( "express" ) ; 
const cors = require ( "cors" ) ; 
const mongoose = require ( "mongoose" ) ; 
const bcrypt = require ( "bcrypt" ) ; 
const jwt = require ( "jsonwebtoken" ) ; 

const app = express ( ) ; 
app.use ( cors ( ) ) ;​​
app.use ( express.json ( ) ) ;​​​​

// 🔐 CONFIG
const SECRETO = "segredo_super_forte_123" ;   

// 📦 MONGODB
mongoose.connect ( process.env.MONGO_URL || " mongodb + srv ://apedamila:92533911@cluster0.fyggn20.mongodb.net/caixa ? retryWrites=true&w = majority " )  
  . então ( ( ) => console .log ( "MongoDB conectado " ) )  
  .catch ( err = > console.log ( err ) ) ;​​  

// ================= MODELOS =================
const User = mongoose.model ( " User " , {   
  email : String , 
  senha : String 
} ) ;

const Caixa = mangusto . modelo ( "Caixa" , {   
  userId : String , 
  produtos : Array , 
  vendas : Array , 
  pendentes : Array 
} ) ;

// ================= MIDDLEWARE =================
função auth ( req , res , next ) {  
  const token = req.headers.authorization ;​​​​

  if (!token) return res.status(401).send("Sem token");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).send("Token inválido");
  }