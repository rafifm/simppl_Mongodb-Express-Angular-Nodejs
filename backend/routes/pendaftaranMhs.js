const express = require("express");
const multer = require("multer");

const dbmysql = require("../models/dbmysql-config");
const PendaftaranMhs = require("../models/pendaftaranmhs");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP ={
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpeg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  "",
  checkAuth, 
  multer({storage: storage}).single("image"),
  (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new PendaftaranMhs({
    nama: req.body.nama,
    nim: req.body.nim,
    ipk: req.body.ipk,
    nokwitansi: req.body.nokwitansi,
    imagePath: url + "/images/" + req.file.filename
  });
  
  // dbmysql.connect((err) => {
  //   if(err) throw err;
    
  //   let sql = `INSERT INTO pendaftaranmhs (nama, nim, ipk, nokwitansi, foto_mhs) VALUES (?)`;
  //   var isi = [
  //     req.body.nama,
  //     req.body.nim,
  //     req.body.ipk,
  //     req.body.nokwitansi,
  //     url + "/images/" + req.file.filename,
  //     // req.body.id,
  //   ];
    
  //   dbmysql.query(sql, [isi], (err, result) => {
  //     if(err) throw err;
  //     console.log('yg berhasil diinput: ' + result.affectedRows);
  //   });  
  // });

  post.save().then(postBaru => {
    res.status(201).json({
      message: " Pendaftaran berhasil ini",
      post: {
        id: postBaru._id,
        nama: postBaru.nama,
        nim: postBaru.nim,
        ipk: postBaru.ipk,
        nokwitansi: postBaru.nokwitansi,
        imagePath: postBaru.imagePath
      }
    });
  });
  
});

router.put("/:id", (req, res, next) => {
  const post = new PendaftaranMhs({
    _id: req.body.id,
    nama: req.body.nama,
    nim: req.body.nim,
    ipk: req.body.ipk,
    nokwitansi: req.body.nokwitansi
  })
  PendaftaranMhs.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "update berhasil"});
  });
});

router.get("",(req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = PendaftaranMhs.find();
  // dbmysql.getConnection((err, connection) => {
  //   if(err) throw err;
  //   let sql = 'SELECT * FROM pendaftaranmhs';  
  //   connection.query(sql, (err, result) => {
  //     if(err) throw err;
  //     if(pageSize && currentPage) {
  //       let paginate = 'SELECT * FROM pendaftaranmhs LIMIT ' + pageSize + ' OFFSET ' + (pageSize * (currentPage - 1));
  //       connection.query(paginate, (err, result) => {
  //         if(err) throw err;
  //         console.log(result);
  //         connection.release();
  //       });
  //     }
  //   });  
  // });

  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPosts = documents
      return PendaftaranMhs.count();
    })
    .then(count => {
      res.status(200).json({
        message: "post berhasil diambil",
        posts: fetchedPosts,
        maxPosts: count
      })
    });
});

router.get("/:id", (req, res, next) => {
  PendaftaranMhs.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Postingan tidak ditemukan"});
    }
  });
});

router.delete("/:id", checkAuth, (req, res,next) => {
  PendaftaranMhs.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: " Post terhapus"});
  });

});

module.exports = router;
