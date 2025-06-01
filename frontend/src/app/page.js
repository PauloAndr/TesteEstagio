import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Sistema Escolar</h1>
      <nav className="flex flex-col gap-4 items-center">
        <Link href="/turmas" className="text-blue-600 underline text-lg">
          Turmas
        </Link>
        <Link href="/professores" className="text-blue-600 underline text-lg">
          Professores
        </Link>
        <Link href="/alunos" className="text-blue-600 underline text-lg">
          Alunos
        </Link>
      </nav>
      <p className="mt-8 text-gray-500">Escolha uma opção para começar.</p>
    </div>
  );
}
