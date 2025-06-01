"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ListarProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/professores/")
      .then((res) => res.json())
      .then((data) => setProfessores(data.professores))
      .catch(() => setErro("Erro ao carregar professores"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este professor?")) return;
    const res = await fetch(`http://localhost:8000/api/professores/${id}/delete/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProfessores(professores.filter((p) => p.id !== id));
    } else {
      alert("Erro ao deletar professor");
    }
  };

  return (
      <div>
        <h1>Lista de Professores</h1>
        <button onClick={() => router.push("/professores/criar")}>Cadastrar Professor</button>
        <button onClick={() => router.push("/professores") } style={{marginLeft: 8}}>Voltar</button>
        <button onClick={() => router.push("/") } style={{marginLeft: 8}}>Home</button>
        {loading ? (
          <p>Carregando...</p>
        ) : erro ? (
          <p style={{color: 'red'}}>{erro}</p>
        ) : (
          <ul style={{ marginTop: 16 }}>
            {professores.map((prof) => (
              <li key={prof.id}>
                {prof.nome_professor} | {prof.matricula_professor}
                {prof.turma ? ` | Turma: ${prof.turma} | Série: ${prof.serie}` : " | Sem turma"}
                {" | "}
                <Link href={`/professores/${prof.id}/editar`}>Editar</Link>
                {" | "}
                <button onClick={() => handleDelete(prof.id)} style={{color: 'red'}}>Deletar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
  );
}
