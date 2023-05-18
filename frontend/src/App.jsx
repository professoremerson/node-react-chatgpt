import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    /**
     * enviando a mensagem do 'frontend' React.js para
     * o 'backend' Node.js que fará a comunicação com a
     * API do ChatGPT e, sem seguida devolverá a resposta
     * para o 'frontend'
     */
    fetch("http://localhost:9000/sendmessages",{
      // definindo o método HTTP da conexão
      method: "POST",
      // definindo o cabeçalho da requisição
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chats
      })
    })
    /**
     * convertendo a resposta do tipo 'Promise' do
     * método 'fetch()' em um JSON
     */
    .then((response) => response.json())
    /**
     * acessar a resposta convertida em JSON para
     * enviar para a tela
     */
    .then((data) => {
      // inserindo a resposta do ChatGPT na variável 'msgs'
      msgs.push(data.output)
      // enviando a variável 'msgs' para o array 'chats'
      // que irá conter todas as conversas
      setChats(msgs)
      // alterando a variavel 'isTyping' para 'false' para
      // esconder a mensagem que o ChatBot está digitando
      setIsTyping(false)
    })
    // tratando possíveis erros na manipulação da resposta
    .catch((error) => {
      console.log(error)
    })
  };

  return (
    <main>
      <h1>Node.js + React.js + ChatGPT</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Digitando" : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Digite sua mensagem e pressione Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}
export default App;