const db = require("../../models/dbmysql");
const dbMhs = db.mhs;
const dbNilai = db.nilai;
const dbSekolah = db.sekolah;
const dbPengguna = db.pengguna;
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
    no_hp_mhs: req.body.no_hp_mhs,
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

exports.tambahMhs = (req, res) => {
  if(!req.body.nama_mhs){
    res.status(400).send({
      message:"input kosong"
    });
    return;
  }

  dbMhs.create({
    nama_mhs: req.body.nama_mhs,
    nim_mhs: req.body.nim_mhs,
    no_hp_mhs: req.body.no_hp_mhs,
    ipk_mhs: req.body.ipk_mhs,
    nokwitansi_mhs: req.body.nokwitansi_mhs
  }).then(akunMhs => {
    return dbPengguna.findOne({
      where: {id: req.params.idPengguna}
    }).then(pengguna => {
      pengguna.setMahasiswa(akunMhs.id);
    }).catch(err => {
      res.status(500).send({ message: err.message || "error tambah mhs ke pengguna"});
    });
  }).catch(err => {
    res.status(500).send({ message: err.message || "error saat pembuatan akun"});
  });
}

exports.ambilMhsSekolah = (req, res) => {
  const { page, size, nama_mhs } = req.query;
  var condition = nama_mhs? { nama_mhs: {[Op.like]: `%${nama_mhs}`}} : null;

  return dbMhs.findAll({ 
    where: condition, 
    include: [{model: dbSekolah}]
  }).then(sekolahan => {
    res.send(sekolahan);
  }).catch(err => {
    res.status(500).send({ message: err.message || "error pengambilan data"});
  });

}

exports.ambilNilai = (req, res) => {
  dbMhs.findAll({
    include: [{model: dbNilai}],
    attributes: ['nama_mhs']
  }).then(nilai =>{
    res.status(200).send(nilai);
  }).catch(err=> {
    res.status(500).send({ message: err.message || "error mengambil nilai"});
  });
}

exports.ambilMhs = (req, res) => {
  dbMhs.findAll().then(mhs=> {
    res.status(200).send(mhs);
  }).catch(err => {
    res.status(500).send({message: err.message || "error mengmbil mahasiswa"});
  });
}

exports.findAll = (req, res) => {
  const { page, size, nama_mhs } = req.query;
  var condition = nama_mhs? { nama_mhs: {[Op.like]: `%${nama_mhs}`}} : null;
  const { limit, offset } = getPagination(page, size);

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
  dbMhs.findByPk(req.params.id)
    .then(akunDosen => {
      res.send(akunDosen);
    })
    .catch(err => {
      res.status(500).send({
        message: err || "error pengambilan mhs dengan id"
      });
    });
};

exports.insertSekolah = (req, res) => {
  const idMhs = req.params.idmhs;
  const idSekolah = req.params.idSekolah;
  dbMhs.findOne({
     where: { id: idMhs } 
    }).then(idMahasiswa => {
      return dbSekolah.findOne({
        where: {id: idSekolah}
      }).then(sekolahId => {
        idMahasiswa.setSekolah(sekolahId);
        res.send(idMahasiswa);
      }).catch(err => {
        res.status(500).send({
          message: "error set data sekolah "+ err
        });
      });
    }).catch(err => {
      res.status(500).send({
        message: "error dbmhs "+ err
      });
    });
}

exports.verifikasi = (req, res) => {
  console.log(req.body);
  dbMhs.update({
    status_verifikasi: req.body.status_verifikasi
  }, {
    where: {id: req.params.idMhs}
  }).then(verif =>{
    res.send({message: "berhasil verifikasi"});
  }).catch( err => {
    res.send({message: "verifikasi error "+ err});
  })
}

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
  }).then(num => {
    if (num == 1){
      res.send({
          message: "akun mahasiswa sdh dihapus"
      });
    } else {
      res.send({
          message: `Gagal menghapus akun mahasiswa dengan id = ${id}.`
      });
    }
  }).catch(err => {
      res.status(500).send ({
          message: "gagal delete akun mahasiswa id = "+ id
      });
  });
};

exports.deleteAll = (req, res) => {
  dbMhs.destroy({
      where: {},
      truncate: false
  }).then(num => {
      res.send({ message: `${num} akun mhs sdh dihapus`})
  }).catch(err => {
      res.status(500).send({
        message: 
          err.message || "error dalam proses penghapusan"
      });
  });
};

exports.nilaiUTS = (req, res) => {
  dbNilai.findOne({
    where: {nilaiDosen_uts: null},
  }).then(cekNilai => {
    return dbNilai.create({
      nilaiDosen_uts: req.body.nilaiDosen_uts
    }).then(nilaiUTS => {
      res.status(200).send({status: 1});
      dbMhs.findOne({
        where: {id: req.params.idMhsnilai}
      }).then(mhs => {
        mhs.setNilai(nilaiUTS.id);
      }).catch(err => {
        res.status(500).send({
          message: "error set nilai " + err
        });
      });
    }).catch(err => {
      res.status(500).send({
        message: "error cari mhs " + err
      });
    });
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "error saat simpan nilai"
    });
  });
}

exports.nilaiUas = (req, res) => {
  dbMhs.findOne({
    where:{id: req.params.idMhsnilai}
  }).then(mhs=> {
    dbNilai.update({ 
      nilaiDosen_uas: req.body.nilaiDosen_uas 
    }, {
      where: {id: mhs.nilaiId}
    }).then(nilaiUAS => {
      res.status(200).send({message: "nilai berhasil masuk:" + nilaiUAS})
    })
  }).catch(err => {
    res.status(500).send({message: "error mengmbil mhs"+ err});
  });
  // dbNilai.findOne({
  //   where: {nilaiDosen_uas: null}
  // }).then(cekNilai => {
  //   return dbNilai.create({
  //     nilaiDosen_uas: req.body.nilaiDosen_uas
  //   }).then(nilaiUas => {
  //     res.status(200).send({status: 1});
  //     dbMhs.findOne({
  //       where: {id: req.params.idMhsnilai}
  //     }).then(mhs => {
  //       mhs.setNilai(nilaiUas.id);
  //     }).catch(err => {
  //       res.status(500).send({
  //         message: "error set nilai " + err
  //       });
  //     });
  //   }).catch(err => {
  //     res.status(500).send({
  //       message: "error cari mhs " + err
  //     });
  //   });
  // }).catch(err => {
  //   res.status(500).send({
  //     message:
  //       err.message || "error saat simpan nilai"
  //   });
  // });

}