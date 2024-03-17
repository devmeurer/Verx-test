const sql = require("./db.js");

// constructor
const Cadastro = function(cadastro) {
  this.cpf_cnpj = cadastro.cpf_cnpj;
  this.nome_produtor = cadastro.nome_produtor;
  this.nome_fazenda = cadastro.nome_fazenda;
  this.cidade = cadastro.cidade;
  this.estado = cadastro.estado;
  this.area_total_hectares = cadastro.area_total_hectares;
  this.area_agricultavel_hectares = cadastro.area_agricultavel_hectares;
  this.area_vegetacao_hectares = cadastro.area_vegetacao_hectares;  
  this.culturas_plantadas = cadastro.culturas_plantadas;
};

Cadastro.create = (newCadastro, result) => {
  sql.query("INSERT INTO cadastros SET ?", newCadastro, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created cadastro: ", { id: res.insertId, ...newCadastro });
    result(null, { id: res.insertId, ...newCadastro });
  });
};


Cadastro.updateById = (id, cadastro, result) => {
    sql.query(
      "UPDATE cadastros SET cpf_cnpj = ?, nome_produtor = ?, nome_fazenda = ?, cidade = ?, estado = ?, area_total_hectares = ?, area_agricultavel_hectares = ?, area_vegetacao_hectares = ?, culturas_plantadas = ? WHERE id = ?",
      [cadastro.cpf_cnpj, cadastro.nome_produtor, cadastro.nome_fazenda, cadastro.cidade, cadastro.estado, cadastro.area_total_hectares, cadastro.area_agricultavel_hectares, cadastro.area_vegetacao_hectares, JSON.stringify(cadastro.culturas_plantadas), id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // Not found Cadastro with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated cadastro: ", { id: id, ...cadastro });
        result(null, { id: id, ...cadastro });
      }
    );
  };
  
  Cadastro.remove = (id, result) => {
    sql.query("DELETE FROM cadastros WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // Not found Cadastro with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted cadastro with id: ", id);
      result(null, res);
    });
  };

  Cadastro.findById = (id, result) => {
    sql.query(`SELECT * FROM cadastros WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found cadastro: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Cadastro with the id
      result({ kind: "not_found" }, null);
    });
  };

  Cadastro.getAll = result => {
    sql.query("SELECT * FROM cadastros", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("cadastros: ", res);
      result(null, res);
    });
  };   

  module.exports = Cadastro;
 