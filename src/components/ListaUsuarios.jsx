import { useState } from 'react'

// Lista com o proprio loading ("Excluindo...") e o proprio erro de exclusao.
function ListaUsuarios({ usuarios, onEditar, onExcluir }) {
  const [excluindoId, setExcluindoId] = useState(null)
  const [erro, setErro] = useState(null)

  async function handleExcluir(id) {
    setExcluindoId(id)
    setErro(null)
    try {
      await onExcluir(id)
    } catch (e) {
      setErro(e.message)
    } finally {
      setExcluindoId(null)
    }
  }

  return (
    <div>
      {erro && <p>Erro: {erro}</p>}
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email}{' '}
            <button onClick={() => onEditar(u)}>Editar</button>{' '}
            <button disabled={excluindoId === u.id} onClick={() => handleExcluir(u.id)}>
              {excluindoId === u.id ? 'Excluindo...' : 'Excluir'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListaUsuarios
