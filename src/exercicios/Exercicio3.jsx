import { useEffect, useState } from 'react'

const API = 'https://jsonplaceholder.typicode.com/users'

function Exercicio3() {
  const [usuarios, setUsuarios] = useState([])
  const [editando, setEditando] = useState(null) // usuario em edicao (ou null)

  useEffect(() => {
    async function buscarUsuarios() {
      const resposta = await fetch(API)
      const dados = await resposta.json()
      setUsuarios(dados)
    }
    buscarUsuarios()
  }, [])

  async function excluirUsuario(id) {
    const resposta = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (resposta.ok) {
      setUsuarios(usuarios.filter((u) => u.id !== id))
      console.log(`Usuário ${id} excluído`)
    }
  }

  async function salvarEdicao(e) {
    e.preventDefault()
    const resposta = await fetch(`${API}/${editando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editando),
    })
    // Usamos a resposta do PUT (e nao o estado do form) para atualizar a lista
    const atualizado = await resposta.json()
    setUsuarios(usuarios.map((u) => (u.id === atualizado.id ? atualizado : u)))
    setEditando(null)
  }

  return (
    <div>
      <h1>Usuários</h1>

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

export default Exercicio3
