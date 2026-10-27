import { useEffect, useState } from 'react'

const API = 'https://jsonplaceholder.typicode.com/users'

// Para forcar um erro (DELETE e PUT), troque por:
// 'https://jsonplaceholder.typicode.com/usuarios'
const URL_ESCRITA = API

function Exercicio4() {
  const [usuarios, setUsuarios] = useState([])
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch(API)
        if (!resposta.ok) throw new Error(`Status ${resposta.status}`)
        const dados = await resposta.json()
        setUsuarios(dados)
      } catch (e) {
        setErro(e.message)
      }
    }
    buscarUsuarios()
  }, [])

  async function excluirUsuario(id) {
    const anterior = usuarios // guarda a lista para o rollback
    setErro(null)
    setUsuarios(usuarios.filter((u) => u.id !== id)) // atualiza a tela na hora
    try {
      const resposta = await fetch(`${URL_ESCRITA}/${id}`, { method: 'DELETE' })
      if (!resposta.ok) throw new Error(`Status ${resposta.status}`)
      console.log(`Usuário ${id} excluído`)
    } catch (e) {
      setUsuarios(anterior) // rollback
      setErro(e.message)
    }
  }

  async function salvarEdicao(e) {
    e.preventDefault()
    const anterior = usuarios
    setErro(null)
    setUsuarios(usuarios.map((u) => (u.id === editando.id ? editando : u)))
    try {
      const resposta = await fetch(`${URL_ESCRITA}/${editando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editando),
      })
      if (!resposta.ok) throw new Error(`Status ${resposta.status}`)
      const atualizado = await resposta.json()
      setUsuarios((atual) =>
        atual.map((u) => (u.id === atualizado.id ? atualizado : u))
      )
      setEditando(null)
    } catch (err) {
      setUsuarios(anterior) // rollback
      setErro(err.message)
    }
  }

  return (
    <div>
      <h1>Usuários</h1>

      {erro && <p>Erro: {erro}</p>}

      {editando && (
        <form onSubmit={salvarEdicao}>
          <input
            value={editando.name}
            onChange={(e) => setEditando({ ...editando, name: e.target.value })}
          />
          <input
            value={editando.email}
            onChange={(e) => setEditando({ ...editando, email: e.target.value })}
          />
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setEditando(null)}>
            Cancelar
          </button>
        </form>
      )}

      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email}{' '}
            <button onClick={() => setEditando({ ...u })}>Editar</button>{' '}
            <button onClick={() => excluirUsuario(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Exercicio4
