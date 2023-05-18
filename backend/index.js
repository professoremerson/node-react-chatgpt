// importando as bibliotecas
import { Configuration, OpenAIApi } from 'openai'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

// criando uma nova aplicação "Express"
const app = express()
// definindo a porta onde o 'backend' vai estar rodando
const port = process.env.PORT
/**
 * definindo a utilização do padrão 'JSON' no corpo
 * das requisições
 */
app.use(bodyParser.json())
/**
 * definindo a utilização do 'cors' para
 * habilitar a livre comunicação entre
 * 'frontend' e 'backend'
 */
app.use(cors())

/**
 * definindo a configuração para a conexão com a
 * API do OpenAI (ChatGPT)
 */
const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.APIKEY
})

// estabelecendo a conexão com a API do ChatGPT
const openai = new OpenAIApi(configuration)

/**
 * criando uma rota para receber as requisições do
 * 'frontend'
 */
app.post('/sendmessages', async (request, response) => {
  // criando uma constante para receber o corpo da requisição
  const { chats } = request.body
  /**
   * enviando o chat (mensagem) recebido do 'frontend'
   * para a API do ChatGPT
   */
  const result = await openai.createChatCompletion({
    // informando qual 'model' do ChatGPT usar
    model: 'gpt-3.5-turbo',
    // informando as mensagens que serão enviadas e
    // como serão processadas
    messages: [
      {
        role: 'system',
        content: 'Chat com Node.js, React.js e ChatGPT'
      },
      ...chats
    ]
  })
  // recuperando a mensagem de resposta do ChatGPT
  response.json({
    output: result.data.choices[0].message
  })
})

// executando a aplicação
app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`)
})
