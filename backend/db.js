import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt'


const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}
))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup"
})

app.get('/get/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Select * from klient where id = ?"
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get klient error in sql" })
    return res.json({ Status: "Success", Result: result })
  })
})

app.get('/getProdukt/:id',(req,res)=>{
  const id=req.params.id;
  const sqlQuery="Select * from products where id = ?"
  db.query(sqlQuery,[id],(err,result)=>{
    if (err) return res.json({ Error: "Get product error in sql" })
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, address } = req.body;
  const sql = "UPDATE klient SET name=?, email=?, address=? WHERE id=?";
  db.query(sql, [name, email, address, id], (err, result) => {
    if (err) return res.json({ Error: "Error when updating in sql" })
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/updateProduct/:id',(req,res)=>{
  const id=req.params.id;
  const {name,description,price,stock}=req.body;
  const sql="Update products set name=?,description=?,price=?,stock=? where id = ?";
  db.query(sql, [name, description, price, stock,id], (err, result) => {
    if (err) return res.json({ Error: "Error when updating in sql" })
    return res.json({ Status: "Success", Result: result })
  })
})

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete from klient where id=?";
  db.query(sql, [id], (err, res) => {
    if (err) return res.json({ Error: "error kur kem dasht me bo delete" })
    return res.json({ Status: "Success" })
  })
})

app.delete('/deleteProduct/:id',(req,res)=>{
  const id = req.params.id;
  const sql = "Delete from products where id = ?";
  db.query(sql,[id],(err,res)=>{
    if(err) return res.json({Error:"Error ne delete"})
    return res.json({Status:"Success"})
  })
})

app.get('/adminCount', (req, res) => {
  const sql = "Select count(id) as admin from users where role ='admin'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" })
    return res.json(result)
  })
})

app.get('/productCount',(req,res)=>{
  const sql="Select count(id) as product from products";
  db.query(sql,(err,result)=>{
    if (err) return res.json({ Error: "Error in running query" })
    return res.json(result)
  })
})

app.get('/userCount', (req, res) => {
  const sql = "Select count(id) as users from users where role ='user'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" })
    return res.json(result)
  })
})

app.get('/admins', (req, res) => {
  const sql = "SELECT id, name, email FROM users WHERE role='admin'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: "Error in running query" });
    return res.json(result);
  });
});


app.post('/register', (req, res) => {
  const sql = "INSERT INTO users(`name`,`email`,`password`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password
  ]
  db.query(sql, [values], (err, result) => {
    if (err) return res.json({ Message: "Error in Node" })
    return res.json(result)
  })
})

app.post('/login', (req, res) => {
  const sql = 'SELECT * FROM users WHERE email = ? and password = ?';
  db.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      res.json({ Error: "An error occurred while logging in" });
    }
    if (result.length > 0) {
      req.session.role = result[0].role;
      console.log(req.session.name);
      return res.json({ Login: true, name: req.session.name })
    } else {
      res.json({ Login: false });
    }
  });
});


app.post('/create', upload.single('image'), (req, res) => {
  const sql = "INSERT into klient(`name`,`email`,`password`,`address`,`image`) VALUES(?)";
  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Error: "error in hashing password" })
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.file.filename
    ]
    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Inside signup query" })
      return res.json({ Status: "Success" })
    })
  })
})

app.get('/getKlientat', (req, res) => {
  const sql = "Select * from klient";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get Klient Erorr in sql" })
    return res.json({ Status: "Success", Result: result })
  })
})



app.get('/', (req, res) => {
  if (req.session.role) {
    return res.json({ valid: true, role: req.session.role })
  } else {
    return res.json({ valid: false })
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  return res.json("Success");
})

app.post('/produktet/create', upload.single('image'), (req, res) => {
  const sql = "Insert into products (`name`,`description`,`price`,`image_url`,`stock`,`category_id`,`created_at`) VALUES (?)"
  const values = [
    req.body.name,
    req.body.description,
    req.body.price,
    req.file.filename,
    req.body.stock,
    req.body.category_id,
    req.body.created_at
  ]
  db.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Gabim gjate insertimit te produkteve ne databaze" })
    return res.json({ Status: "Success" })
  })
})

app.get('/getProduktet', (req, res) => {
  const sql = "Select * from products";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error ne marrjen e te dhenave" })
    return res.json({ Status: "Success", Result: result })
  })
})

app.get('/getKategorite',(req,res)=>{
  const sql = "Select * from categories";
  db.query(sql,(err,result)=>{
    if(err) return res.json({Error:"Error"})
    return res.json({Status:"Success",Result:result}) 
  })
})

app.post('/createCategory',(req, res) => {
  const sql = "Insert into categories (`name`,`description`,`created_at`) VALUES (?)"
  const values = [
    req.body.name,
    req.body.description,
    req.body.created_at
  ]
  db.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Gabim gjate insertimit te produkteve ne databaze" })
    return res.json({ Status: "Success" })
  })
})

app.get('/getKategori/:id',(req,res)=>{
  const id=req.params.id;
  const sqlQuery="Select * from categories where id = ?"
  db.query(sqlQuery,[id],(err,result)=>{
    if (err) return res.json({ Error: "Get category error in sql" })
    return res.json({ Status: "Success", Result: result })
  })
})

app.delete('/deleteKategori/:id',(req,res)=>{
  const id = req.params.id;
  const sql = "Delete from categories where id = ?";
  db.query(sql,[id],(err,res)=>{
    if(err) return res.json({Error:"Error ne delete"})
    return res.json({Status:"Success"})
  })
})









app.listen(8081, () => {
  console.log("Running on portt 8081");
})