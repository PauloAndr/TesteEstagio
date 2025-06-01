"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarProfessor() {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:8000/api/professores/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setNome(data.nome_professor);
        setMatricula(data.matricula_professor);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    const body = {
      nome_professor: nome,
      matricula_professor: matricula
    };
    const res = await fetch(`http://localhost:8000/api/professores/${id}/update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      router.push("/professores/listar");
    } else {
      const data = await res.json();
      setErro(data.error || "Erro ao atualizar professor");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        </label>
        <br />
        <label>
          Matrícula:
          <input placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} />
        </label>
        <br />
        <button type="submit">Salvar</button>
        {erro && <p style={{color: 'red'}}>{erro}</p>}
      </form>
      <button type="button" onClick={() => router.back()} style={{marginTop: 12, marginRight: 8}}>
        Voltar
      </button>
      <button type="button" onClick={() => router.push("/")} style={{marginTop: 12}}>
        Home
      </button>
    </>
  );
}
