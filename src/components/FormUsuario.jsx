import { useState } from 'react'

// Formulario com estado unico (um objeto com todos os campos).
// Tem o proprio loading ("Salvando...") e o proprio erro.
function FormUsuario({ usuarioInicial, onSalvar, onCancelar }) {
  const [dados, setDados] = useState({
    name: usuarioInicial ? usuarioInicial.name : '',
    email: usuarioInicial ? usuarioInicial.email : '',
  })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  function handleChange(e) {
    setDados({ ...dados, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    setErro(null)
    try {
      await onSalvar(dados) // se der certo, o App fecha o formulario
    } catch (err) {
      setErro(err.message)
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{usuarioInicial ? 'Editar usuário' : 'Novo usuário'}</h2>
      <input name="name" placeholder="Nome" value={dados.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={dados.email} onChange={handleChange} />
      <button type="submit" disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar'}
      </button>
      <button type="button" onClick={onCancelar} disabled={salvando}>
        Cancelar
      </button>
      {erro && <p>Erro: {erro}</p>}
    </form>
  )
}

export default FormUsuario
