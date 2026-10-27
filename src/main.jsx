import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Para testar os exercicios 1 a 4, troque o import acima por, por exemplo:
// import App from './exercicios/Exercicio1.jsx'
// StrictMode foi removido de proposito: em modo dev ele roda o useEffect
// duas vezes e as requisicoes apareceriam duplicadas no Network.
createRoot(document.getElementById('root')).render(<App />)
