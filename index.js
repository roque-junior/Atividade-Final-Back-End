import express from "express";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());
//lista de usuarios com as seguintes propriedades
//usario.nome
//usuario.senha
//usuario.email
//usuario.identificador
const usuarios = [];
let identificadorUnicoUsuario = 0;

//lista de recados com as seguintes propriedades
//recado.titulo
//recado.descricao
//recado.identificador
const recados = [
  {
    titulo : "home",
    descricao : "euuuuuu preciso de ajuda",
    id: 1,
    identificadorUnicoUsuario: 1
},

{
  titulo : "sergio",
  descricao : "sergio preciso de ajuda",
  id: 2,
  identificadorUnicoUsuario: 1
},

{
  titulo : "bruna",
  descricao : "bruna preciso de ajuda",
  id: 3,
  identificadorUnicoUsuario: 1
},

{
  titulo : "gabriel",
  descricao : "yuri preciso de ajuda",
  id: 4,
  identificadorUnicoUsuario: 1
},

];
let identificadorUnicoRecado = 0;

// deve receber um json no body com as seguintes propriedades
// body.nome
// body.senha
// body.email: deve ser unico

app.get("/", function (requisicao,resposta){
  resposta.status(200).send("Bem Vindo ao Api!");
})



app.post("/usuarios", function (requisicao, resposta) {
  // VALIDACÕES

  const bodyInvalido =
    !requisicao.body.nome || !requisicao.body.senha || !requisicao.body.email;
  // se o email já existe
  const existeEmail = usuarios.some(function (usuario) {
    return usuario.email === requisicao.body.email;
  });
  if (bodyInvalido) {
    resposta.status(400);
    resposta.send("Dados inválidos");
  } else if (existeEmail) {
    resposta.status(400);
    resposta.send("Email já cadastrado");
  } else {
    // CRIANDO USUARIO
    const novoUsuario = {
      nome: requisicao.body.nome,
      senha: requisicao.body.senha,
      email: requisicao.body.email,
    };
    novoUsuario.identificador = identificadorUnicoUsuario;
    identificadorUnicoUsuario++;
    usuarios.push(novoUsuario);
    resposta.json({
      mensagem: "Usuário criado com sucesso",
      usuario: novoUsuario,
    });
  }
});

app.post("/usuarios/login", function (requisicao, resposta) {
  const email = requisicao.body.email;
  const senha = requisicao.body.senha;

  const usuarioEncontrado = usuarios.find(function (usuario) {
    return usuario.email === email && usuario.senha === senha;
  });
  if (usuarioEncontrado) {
    resposta.json({
      mensagem: "Usuário logado com sucesso",
      usuario: usuarioEncontrado,
    });
  } else {
    resposta.status(401);
    resposta.send("Email ou senha inválidos");
  }
});

// crud de recados

app.post("/recados", function (requisicao, resposta) {
  const bodyInvalido = !requisicao.body.titulo || !requisicao.body.descricao;
  if (bodyInvalido) {
    resposta.status(400);
    resposta.send("Dados inválidos");
  } else {
    const novoRecado = {
      titulo: requisicao.body.titulo,
      descricao: requisicao.body.descricao,
    };
    novoRecado.identificador = identificadorUnicoRecado;
    identificadorUnicoRecado++;
    recados.push(novoRecado);
    resposta.json({
      mensagem: "Recado criado com sucesso",
      recado: novoRecado,
    });
  }
});

app.get("/recados", function (req, resposta) {
  // listando todos os recados com suporte à paginação
const perPage = 2;
const page = parseInt(req.query.page) || 1;
const startIndex = (page - 1) * perPage;
const endIndex = startIndex + perPage;

const recadosPaginados = recados.slice(startIndex, endIndex);

resposta.json({
  quantidade: recados.length,
  recados: recadosPaginados,
});
});

app.get("/recados/:id", function (requisicao, resposta) {
  const id = parseInt(requisicao.params.id);
  const recadoEncontrado = recados.find(function (recado) {
    return recado.identificador === id;
  });
  if (recadoEncontrado) {
    resposta.json({
      mensagem: "Recado encontrado",
      recado: recadoEncontrado,
    });
  } else {
    resposta.status(404);
    resposta.send("Recado não encontrado");
  }
});

app.put("/recados/:id", function (requisicao, resposta) {
  const bodyInvalido = !requisicao.body.titulo || !requisicao.body.descricao;
  // atualizar um recado
  const id = parseInt(requisicao.params.id);
  const recadoEncontrado = recados.find(function (recado) {
    return recado.identificador === id;
  });
  if (bodyInvalido) {
    resposta.status(400);
    resposta.send("Dados inválidos");
  } else if (!recadoEncontrado) {
    resposta.status(404);
    resposta.send("Recado não encontrado");
  } else {
    recadoEncontrado.titulo = requisicao.body.titulo;
    recadoEncontrado.descricao = requisicao.body.descricao;
    resposta.json({
      mensagem: "Recado atualizado com sucesso",
      recado: recadoEncontrado,
    });
  }
});

app.delete("/recados/:id", function (requisicao, resposta) {
  const id = parseInt(requisicao.params.id);
  const indice = recados.findIndex(function (recado) {
    return recado.identificador === id;
  });
  if (indice === -1) {
    resposta.status(404);
    resposta.send("Recado não encontrado");
  } else {
    recados.splice(indice, 1);
    resposta.json({
      mensagem: "Recado removido com sucesso",
    });
  }
});

app.listen(3000, function () {
  console.log("servidor rodando na porta 3000: url http://localhost:3000");
});