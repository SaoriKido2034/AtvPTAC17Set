import { useEffect, useState } from 'react'

const API = 'https://jsonplaceholder.typicode.com/users'

function Exercicio1() {
  const [usuarios, setUsuarios] = useState([])

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
    }
  }

  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email}{' '}
            <button onClick={() => excluirUsuario(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Exercicio1
