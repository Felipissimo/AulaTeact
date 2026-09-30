// Importa a biblioteca Express, responsável 
// por criar o servidor e as rotas da API
import express from "express";

// Importa a biblioteca CORS, que permite a
// comunicação entre aplicações executadas
// em portas diferentes (React e API)
import cors from "cors"; 

//  Cria uma instância da aplicação Express
const app = express();

// Habilita o CORS para permitir requisições 
// vindas do React
app.use(cors());

// Permite que a API receba e 
// interprete dados  no formato JSON 
app.use(express.json());

// Vetor responsável por armazenar temporariamente
// todas as consultas realizadas pelo usuário
let historico = [];


// MÉTODO GET
// Utilizado para consultar informações
// já armazenadas na API
// Rota responsável por retornar todo o histórico 
app.get("/historico", (req, res) => {

// Envia a lista completa de consultas em formato
// json 
res.json(historico);

});

// MÉTODO POST
// Utilizado para enviar informações
// para a API
app.post("/historico", (req, res) => {
    
    // Adiciona os dados recebidos pelo react
    // ao vetor de histórico 
    historico.push(req.body);

    res.json({
      mensagem: "Consulta salva!"
    });

});

// Inicia a API na porta 3000
app.listen(3000, () => {

console.log("Servidor rodando na porta 3000");

});