import { useState } from "react";
import { Sun, Cloud, CloudRain, Wind, Droplets, Search } from "lucide-react";
import "./App.css";

// Cria o componente principal da aplicação
function App() {

  // Estado responsável por armazenar a cidade digitada no input  
  const [cidadeInput, setCidadeInput] = useState("");

  // Estados para armazenar os dados retornados pela API
  const [cidadeExibida, setCidadeExibida] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [clima, setClima] = useState("");
  const [umidade, setUmidade] = useState("");
  const [vento, setVento] = useState("");
  
  // Estado para controlar o tipo de clima (usado para alterar o visual e ícones dinamicamente)
  const [tipoClima, setTipoClima] = useState("default");

  // Função executada quando o usuário clicar no botão "Consultar" ou apertar Enter
  async function consultarClima() {

    // Verifica se o campo está vazio
    if (cidadeInput === "") {
      alert("Digite uma cidade!");
      return;
    }
  
    try {
      const resposta = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cidadeInput}&appid=752dce4eeba4c382e1b505a04a47e817&units=metric&lang=pt_br`
      );

      // Converte a resposta para JSON
      const dados = await resposta.json();

      // Verifica se a cidade foi encontrada (código 200 significa sucesso na API)
      if (dados.cod !== 200) {
        alert("Cidade não encontrada");
        return;
      }

      // Atualiza os estados com os dados reais formatados
      setCidadeExibida(dados.name);
      setTemperatura(Math.round(dados.main.temp)); // Arredonda a temperatura para um visual mais limpo
      setClima(dados.weather[0].description);
      setUmidade(dados.main.humidity);
      setVento(Math.round(dados.wind.speed * 3.6)); // Converte a velocidade do vento de m/s para km/h

      // Identifica o tipo principal de clima para aplicar o tema correspondente
      const mainWeather = dados.weather[0].main.toLowerCase();
      if (mainWeather.includes("rain")) {
        setTipoClima("rainy");
      } else if (mainWeather.includes("cloud")) {
        setTipoClima("cloudy");
      } else {
        setTipoClima("sunny");
      }
  
      //AULA 29/09
      //Enviando dados do React para uma API própria utilizando o método Post

      //Faz a requisição para a API de histórico criada por você
      await fetch ("http://localhost:3000/historico"),{

        //Define o método HTTP utilizado
        method: "POST", 

        //Informa que os daods enviados estarão em formato JSON
        headers: {
          "Content-Type": "application/json"

        },

        //Converte o objeto JavaScript para JSON
        body: JSON.stringify({

          //Envia o nome da cidade consultada
          cidade: cidade,

          //Envia a temperatura retornada pela API OpenWeatherMap
          temperatura: dados.main.temp + "°C",

          clima: dados.weather[0].description,

          umidade: dados.main.humidity + "%",

          vento: Math.round(dados.wind.speed * 3.6)
        })

      });

      //Fim da primeira aula

    } catch (erro) {
      console.log(erro);
      alert("Erro ao consultar a API");
    }
  }

  // Função auxiliar para renderizar o ícone animado correto utilizando a biblioteca lucide-react
  const renderIcon = () => {
    switch (tipoClima) {
      case "rainy":
        return <CloudRain className="floatingIcon" size={64} strokeWidth={1.5} />;
      case "cloudy":
        return <Cloud className="floatingIcon" size={64} strokeWidth={1.5} />;
      default:
        return <Sun className="floatingIcon" size={64} strokeWidth={1.5} />;
    }
  };

  // Retorna a interface visual do sistema
  return (
    // Container principal da aplicação com classe dinâmica baseada no estado do clima (azul/roxo)
    <div className={`app-container ${tipoClima}`}>
      <div className="weather-card">
        
        {/* Barra de pesquisa para digitação e envio da cidade */}
        <div className="search-box">
          <input 
            type="text"
            placeholder="Pesquisar cidade..."
            value={cidadeInput}
            onChange={(e) => setCidadeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && consultarClima()} // Permite buscar apertando Enter
          />
          <button onClick={consultarClima}>
            <Search size={18} />
          </button>
        </div>

        {/* Renderização condicional: exibe os dados se houver cidade pesquisada, senão exibe uma mensagem inicial */}
        {cidadeExibida ? (
          <div className="weather-info">
            
            {/* Exibe a cidade informada */}
            <div className="location">
              <h2>🌍 Cidade: {cidadeExibida}</h2>
            </div>

            {/* Exibe o ícone dinâmico com animação de flutuação */}
            <div className="icon-container">
              {renderIcon()}
            </div>

            {/* Exibe a temperatura e a descrição detalhada do clima */}
            <div className="temp-section">
              <span className="temperature">🌡️ {temperatura}°</span>
              <p className="condition">☁️ {clima}</p>
            </div>

            {/* Exibe os detalhes adicionais de umidade e vento */}
            <div className="details">
              <div className="detail-item">
                <Droplets size={16} strokeWidth={2} />
                <span>💧 Umidade: {umidade}%</span>
              </div>
              <div className="detail-item">
                <Wind size={16} strokeWidth={2} />
                <span>💨 Vento: {vento} km/h</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="placeholder-text">
            <p>Digite uma cidade acima para ver a previsão 🌤️</p>
          </div>
        )}

      </div>
    </div>
  );
}

// Exporta o componente App para ser utilizado no React
export default App;