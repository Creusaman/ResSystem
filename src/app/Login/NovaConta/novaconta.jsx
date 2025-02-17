import React, {useState} from 'react';
import {Link, Navigate}  from 'react-router-dom';
import './novaconta.css';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../../../Config/firebase';

function NovaConta(){

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('');

  const auth = getAuth(firebaseApp);

  async function cadastrarUsuario(){
    setMensagem('');

    if (!email || !senha){
      setMensagem('Informe todos os campos');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      setSucesso('S');
    } catch (error) {
      setSucesso('N');    
      if (error.code === 'auth/weak-password') {
        setMensagem('A senha deve ter pelo menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email') {
        setMensagem('O email não é válido');
      } else if (error.code === 'auth/email-already-in-use') {
        setMensagem('Esse email já está em uso por outra conta');
      } else {
        setMensagem('Erro ao criar conta: ' + error.message);
      }
    }
  }

    return <div className="d-flex align-items-center text-center form-container">
      <form className="form-signin">
        <img className="mb-4" src="/Images/logo-small2.png" alt="" />
        <h1 className="h3 mb-3 fw-normal">Criar Conta</h1>

        <div className="form-floating">
          <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="floatingInput" placeholder="E-mail" />
          <label htmlFor="floatingInput">E-mail</label>
        </div>

        <div className="form-floating">
          <input onChange={(e) => setSenha(e.target.value)} type="password" className="form-control" id="floatingPassword" placeholder="Senha" />
          <label htmlFor="floatingPassword">Senha</label>
        </div>
        
        <button onClick={cadastrarUsuario} className="w-100 btn btn-lg btn-primary" type="button">Criar conta</button>

        {mensagem.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{mensagem}</div> : null}
        {sucesso === 'S' ? <Navigate to='/app/home' /> : null}

        <div className="login-links mt-5">
          <Link to="/app" className="mx-3">Já tenho uma conta.</Link>
        </div>

        <p className="mt-5 mb-3 text-muted">&copy; Desenvolvido por 99 Coders</p>
      </form>
    </div>
}

export default NovaConta;
