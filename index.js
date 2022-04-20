
//para começar a usar o framework express 
const express = require('express');

const server = express();

server.use(express.json());

//vamos criar uma rota do tipo GET uma rota que trás informações no navegador
//eu espero que ele acesse localhost:3000/curso
//req => representa os dados da nossa requisição
//res => representa as informações para retornar uma resposta ao front-end

const cursos = ['Node JS', 'JavaScript', 'React Native'];

//Middleware Global
//fazendo um Middlewares => com função anonima
server.use((req, res, next) =>{
   console.log(`URL CHAMADA: ${req.url}`);
//usando o next ele passa pela requisição e continua os processos
   return next();
})

//Middleware especifico
function checkCurso(req, res, next){
   if(!req.body.name){
      return res.status(400).json({ error: "Nome do curso é obrigatorio" })
   }
 //se ele entrar no if ele barra em cima. Caso não ele passa e continua o processo no next.  
   return next();
}

//Middleware especifico para listagem
function checkIndexCurso(req, res, next){
   //cursos vem o meu array global => depois eu trago e verifico o index 
   //se tem o curso.
   const curso = cursos[req.params.index];
   //console.log(`Trazer o valor do meu curso ${curso}`);
   if(!curso){
      return res.status(400).json({ error: "O curso não existe" });
   }
  
   //manipulando middleware
   req.curso = curso;


   //eu continuo o meu processo.
   return next();
}

//get onde estamos chamando um unico curso.
server.get('/cursos', (req, res)=> {
   return res.json(cursos);
});


//listando um unico curso
server.get('/cursos/:index', checkIndexCurso, (req, res) => {
  return res.json(req.curso);
});

//Criando um novo curso
//toda vez que eu chamar a rota (/curso) ela passa pelo middleware()  e faz o outro middleware continua 
server.post('/cursos', checkCurso, (req, res) => {
  //estamos enviando ao servidor por esta propriedade.
   const { name } = req.body;
   cursos.push(name);
   return res.json(cursos);
});

//Atualizar ou Editar um curso que já existe.
server.put('/cursos/:index', checkCurso, checkIndexCurso, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    //curso no index = pega name que ele vai passar.
    cursos[index] = name;

    //no meu retorno, eu vou pegar => virá meu objeto cursos editado
    return res.json(cursos);

});

//Excluindo um curso existente
server.delete('/cursos/:index', (req, res) => {
     const { index } = req.params;
     
     //vou utilizar splice do javaScript para deletar.
     cursos.splice(index, 1);

     //o meu return em formato json, vou retornar todos os cursos.
     //return res.json(cursos);

     return res.json({ message: "Curso deletado com sucesso!"});
     
     //Ou res.send => sem enviar nada apenas para saber que ele foi deletado.
     //Ele não iria enviar nenhuma resposta ao front-end.
     //return res.send();

})

//ele vai ouvir a porta 3000
server.listen(3000);