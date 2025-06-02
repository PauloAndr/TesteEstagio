from AlunoOnlineApp.models import Professor, Turma, Aluno


def run():
    prof1 = Professor.objects.create(nome_professor="João Silva", matricula_professor="P22222")
    prof2 = Professor.objects.create(nome_professor="Maria Souza", matricula_professor="P11111")

    turma1 = Turma.objects.create(serie="Primeira Série", turno="Manhã", turma="1A", professor_principal=prof1)
    turma2 = Turma.objects.create(serie="Segunda Série", turno="Tarde", turma="2B", professor_principal=prof2)

    aluno1 = Aluno.objects.create(nome_aluno="Carlos", matricula_aluno="A11111", turma=turma1)
    aluno2 = Aluno.objects.create(nome_aluno="Ana", matricula_aluno="A22222", turma=turma1)
    aluno3 = Aluno.objects.create(nome_aluno="Pedro", matricula_aluno="A33333", turma=turma2)
    print("Banco populado com sucesso!")