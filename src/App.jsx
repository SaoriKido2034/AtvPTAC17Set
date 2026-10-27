import { useEffect, useRef, useState } from 'react'
import ListaUsuarios from './components/ListaUsuarios.jsx'
import FormUsuario from './components/FormUsuario.jsx'

const API = 'https://jsonplaceholder.typicode.com/users'

// Exercicio 5: mini-CRUD completo.
// O App guarda o estado e faz todas as requisicoes (GET, POST, PUT, DELETE).
function App() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroLista, setErroLista] = useState(null)
  const [form, setForm] = useState(null) // null = fechado | 'novo' | usuario em edicao
  const controllerRef = useRef(null)

  // Funcao unica para todas as requisicoes: todas usam o mesmo AbortController
  async function requisicao(url, metodo = 'GET', corpo) {
    const resposta = await fetch(url, {
      method: metodo,
      headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: controllerRef.current.signal,
    })
    if (!resposta.ok) throw new Error(`Status ${resposta.status}`)
    return resposta.json()
  }

  useEffect(() => {
    const controller = new AbortController()
    controllerRef.current = controller

    async function buscarUsuarios() {
      try {
        const dados = await requisicao(API)
        setUsuarios(dados)
      } catch (e) {
        if (e.name !== 'AbortError') setErroLista(e.message)
      } finally {
        setCarregando(false)
      }
    }
    buscarUsuarios()

    // Ao sair da pagina (desmontar), cancela todas as requisicoes em andamento
    return () => controller.abort()
  }, [])

  async function criarUsuario(dados) {
    const novo = await requisicao(API, 'POST', dados)
    // O JSONPlaceholder sempre devolve id 11, entao garantimos um id unico
    const id = usuarios.some((u) => u.id === novo.id)
      ? Math.max(...usuarios.map((u) => u.id)) + 1
      : novo.id
    setUsuarios((atual) => [...atual, { ...novo, id }])
    setForm(null)
  }

  async function editarUsuario(id, dados) {
    const atualizado = await requisicao(`${API}/${id}`, 'PUT', { ...dados, id })
    setUsuarios((atual) => atual.map((u) => (u.id === id ? atualizado : u)))
    setForm(null)
  }

  async function excluirUsuario(id) {
    await requisicao(`${API}/${id}`, 'DELETE')
    setUsuarios((atual) => atual.filter((u) => u.id !== id))
  }

  return (
    <div>
      <h1>CRUD de usuários</h1>
      <button onClick={() => setForm('novo')}>Novo</button>

      {form && (
        <FormUsuario
          key={form === 'novo' ? 'novo' : form.id}
          usuarioInicial={form === 'novo' ? null : form}
          onSalvar={
            form === 'novo' ? criarUsuario : (dados) => editarUsuario(form.id, dados)
          }
          onCancelar={() => setForm(null)}
        />
      )}

      {carregando && <p>Carregando...</p>}
      {erroLista && <p>Erro: {erroLista}</p>}

      <ListaUsuarios
        usuarios={usuarios}
        onEditar={setForm}
        onExcluir={excluirUsuario}
      />
    </div>
  )
}

export default App
