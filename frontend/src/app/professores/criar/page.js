"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CriarProfessor() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    const res = await fetch("http://localhost:8000/api/professores/post/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome_professor: nome, matricula_professor: matricula }),
    });
    if (res.ok) {
      router.push("/professores");
    } else {
      const data = await res.json();
      setErro(data.error || "Erro ao cadastrar professor");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} />
        <button type="submit">Cadastrar</button>
        {erro && <p style={{color: 'red'}}>{erro}</p>}
      </form>
      <button type="button" onClick={() => router.back()} style={{marginTop: 12, marginRight: 8}}>
        Voltar
      </button>
      <button type="button" onClick={() => router.push("/") } style={{marginTop: 12}}>
        Home
      </button>
    </>
  );
}
