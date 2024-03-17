const Cadastro = require("../models/cadastro.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const cadastro = new Cadastro({
    cpf_cnpj: req.body.cpf_cnpj,
    nome_produtor: req.body.nome_produtor,
    nome_fazenda: req.body.nome_fazenda,
    cidade: req.body.cidade,
    estado: req.body.estado,
    area_total_hectares: req.body.area_total_hectares,
    area_agricultavel_hectares: req.body.area_agricultavel_hectares,
    area_vegetacao_hectares: req.body.area_vegetacao_hectares,
    culturas_plantadas: req.body.culturas_plantadas
  });

  Cadastro.create(cadastro, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Cadastro."
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
    const id = req.params.id;
    if (!req.body) {
      return res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    const totalArea = req.body.area_total_hectares;
    const cultivableArea = req.body.area_agricultavel_hectares;
    const vegetationArea = req.body.area_vegetacao_hectares;
    if (cultivableArea + vegetationArea > totalArea) {
      return res.status(400).send({
        message: "A soma da área agricultável e de vegetação não pode ser maior que a área total."
      });
    }

    function validaCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
    
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    }
    
    
    function validaCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
    
        const validador = (tamanho) => {
            let soma = 0;
            const pos = tamanho - 7;
            for (let i = tamanho; i >= 1; i--) {
                soma += parseInt(cnpj.charAt(tamanho - i)) * (pos - i);
                if (i === 5) i -= 8;
            }
            let resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };
    
        const digitos = parseInt(cnpj.slice(12, 14));
        return digitos === ((validador(12) * 10) + validador(13));
    }
    
    
    const cpf_cnpj = req.body.cpf_cnpj;
    if(cpf_cnpj.length === 11) {
        if(!validaCPF(cpf_cnpj)) {
            return res.status(400).send({ message: "CPF inválido." });
        }
    } else if(cpf_cnpj.length === 14) {
        if(!validaCNPJ(cpf_cnpj)) {
            return res.status(400).send({ message: "CNPJ inválido." });
        }
    } else {
        return res.status(400).send({ message: "CPF ou CNPJ inválido." });
    }
    
  
    Cadastro.updateById(id, new Cadastro(req.body), (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Not found Cadastro with id ${id}.`
          });
        } else {
          return res.status(500).send({
            message: "Error updating Cadastro with id " + id
          });
        }
      } else res.send(data);
    });
  };


exports.delete = (req, res) => {
    const id = req.params.id;
  
    Cadastro.remove(id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Cadastro with id ${id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Cadastro with id " + id
          });
        }
      } else res.send({ message: `Cadastro was deleted successfully!` });
    });
  };


exports.findOne = (req, res) => {
    Cadastro.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Cadastro with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Cadastro with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };


exports.findAll = (req, res) => {
    Cadastro.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving cadastros."
        });
      else res.send(data);
    });
  };
  