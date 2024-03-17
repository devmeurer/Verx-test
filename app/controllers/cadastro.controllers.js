const Cadastro = require("../models/cadastro.model.js");

// Create and Save a new Cadastro
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

  // Save Cadastro in the database
  Cadastro.create(cadastro, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Cadastro."
      });
    else res.send(data);
  });
};

// Update a Cadastro identified by the cadastroId in the request
exports.update = (req, res) => {
    const id = req.params.id;
    if (!req.body) {
      return res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Verifica se a soma das áreas é válida
    const totalArea = req.body.area_total_hectares;
    const cultivableArea = req.body.area_agricultavel_hectares;
    const vegetationArea = req.body.area_vegetacao_hectares;
    if (cultivableArea + vegetationArea > totalArea) {
      return res.status(400).send({
        message: "A soma da área agricultável e de vegetação não pode ser maior que a área total."
      });
    }

    function validaCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g,'');    
        if(cpf == '') return false;    
        // Elimina CPFs invalidos conhecidos    
        if (cpf.length != 11 || 
            cpf == "00000000000" || 
            cpf == "11111111111" || 
            cpf == "22222222222" || 
            cpf == "33333333333" || 
            cpf == "44444444444" || 
            cpf == "55555555555" || 
            cpf == "66666666666" || 
            cpf == "77777777777" || 
            cpf == "88888888888" || 
            cpf == "99999999999")
                return false;       
        // Valida 1o digito 
        add = 0;    
        for (i=0; i < 9; i ++)       
            add += parseInt(cpf.charAt(i)) * (10 - i);  
            rev = 11 - (add % 11);  
            if (rev == 10 || rev == 11)     
                rev = 0;    
            if (rev != parseInt(cpf.charAt(9)))     
                return false;       
        // Valida 2o digito 
        add = 0;    
        for (i = 0; i < 10; i ++)        
            add += parseInt(cpf.charAt(i)) * (11 - i);  
        rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11) 
            rev = 0;    
        if (rev != parseInt(cpf.charAt(10)))
            return false;       
        return true;   
    }
    
    function validaCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g,'');
    
        if(cnpj == '') return false;
        
        if (cnpj.length != 14)
            return false;
    
        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" || 
            cnpj == "11111111111111" || 
            cnpj == "22222222222222" || 
            cnpj == "33333333333333" || 
            cnpj == "44444444444444" || 
            cnpj == "55555555555555" || 
            cnpj == "66666666666666" || 
            cnpj == "77777777777777" || 
            cnpj == "88888888888888" || 
            cnpj == "99999999999999")
            return false;
             
        // Valida DVs
        tamanho = cnpj.length - 2
        numeros = cnpj.substring(0,tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;
            
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
              return false;
               
        return true;
    }
    
    // Dentro do método de update (e create, se aplicável)
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

// Delete a Cadastro with the specified cadastroId in the request
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

// Retrieve a single Cadastro with cadastroId
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

// Retrieve all Cadastros from the database.
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
  