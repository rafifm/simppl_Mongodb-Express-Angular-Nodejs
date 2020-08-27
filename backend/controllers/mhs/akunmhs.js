const db = require("../../models/dbmysql");
const dbMhs = db.mhs;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? + size : 3;
  const offset = page ? page * limit : 0;

  return { offset, limit };
}

const getPagingData = (data, page, limit) => {
  const { count: totalMhs, rows: mhs} = data;
  const halamanSekarang = page ? + page : 0;
  const totalHalaman = Math.ceil(totalMhs/limit);

  return { totalMhs, mhs, totalHalaman, halamanSekarang };
}

exports.create = (req, res) => {
  if(!req.body.nama_mhs) {
    res.status(400).send({
      message: " input kosong "
    });
    return;
  }
  const dataMhs = {
    nama_mhs: req.body.nama_mhs,
    nim_mhs: req.body.nim_mhs,
    ipk_mhs: req.body.ipk_mhs,
    nokwitansi_mhs: req.body.nokwitansi_mhs
  }

  dbMhs.create(dataMhs)
    .then(akunMhs => {
      res.send(akunMhs);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "error saat pembuatan akun"
      });
    });
};

exports.findAll = (req, res) => {
  const { page, size, nama_mhs } = req.query;
  var condition = nama_mhs? { nama_mhs: {[Op.like]: `%${nama_mhs}`}} : null;
  const { limit, offset } =getPagination(page, size);

  dbMhs.findAndCountAll ({ where: condition, limit, offset})
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message: 
          err.message || "error pengambilan data"
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  dbMhs.findByPk(id)
    .then(akunDosen => {
      res.send(akunDosen);
    })
    .catch(err => {
      res.status(500).send({
        message: "error pengambilan mhs dengan id"
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  dbMhs.update(req.body, {
    where: {id: id}
  })
    .then(num => {
      if(num == 1 ) {
        res.send({
          message: "Akun dosen telah terupdate"
        });
      } else {
        res.send ({
          message: `tidak bisa update akun dengan id =${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "update error dengan id= " + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  dbMhs.destroy({
      where: { id: id}
  })
  .then(num => {
      if (num == 1){
          res.send({
              message: "akun mahasiswa sdh dihapus"
          });
      } else {
          res.send({
              message: `Gagal menghapus akun mahasiswa dengan id = ${id}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send ({
          message: "gagal delete akun mahasiswa id = "+ id
      });
  });
};

exports.deleteAll = (req, res) => {
  dbMhs.destroy({
      where: {},
      truncate: false
  })
      .then(num => {
          res.send({ message: `${num} akun mhs sdh dihapus`})
      })
      .catch(err => {
          res.status(500).send({
              message: 
                  err.message || "error dalam proses penghapusan"
          });
      });
};