"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CriarTurmaPage() {
  const [serie, setSerie] = useState("");
  const [turno, setTurno] = useState("Manhã");
  const [turma, setTurma] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [professores, setProfessores] = useState([]);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/professores/")
      .then((res) => res.json())
      .then((data) => {
        const livres = data.professores.filter((p) => !p.turma_lecionado);
        setProfessores(livres);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    const res = await fetch("http://localhost:8000/api/turmas/post/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serie, turno, turma, professor_principal_id: professorId }),
    });
    if (res.ok) {
      router.push("/turmas");
    } else {
      const data = await res.json();
      setErro(data.error || "Erro ao criar turma");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input placeholder="Série" value={serie} onChange={e => setSerie(e.target.value)} />
        <select value={turno} onChange={e => setTurno(e.target.value)}>
          <option value="Manhã">Manhã</option>
          <option value="Tarde">Tarde</option>
          <option value="Noite">Noite</option>
        </select>
        <input placeholder="Turma" value={turma} onChange={e => setTurma(e.target.value)} />
        <select value={professorId} onChange={e => setProfessorId(e.target.value)}>
          <option value="">Selecione o Professor Responsável</option>
          {professores.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.nome_professor} ({prof.matricula_professor})
            </option>
          ))}
        </select>
        <button type="submit">Criar</button>
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
