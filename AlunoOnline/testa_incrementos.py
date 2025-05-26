from AlunoOnlineApp.models import Professor, Turma, Aluno

# Professores
prof1 = Professor.objects.create(nome_professor='Prof. A', matricula_professor='P000000001')
prof2 = Professor.objects.create(nome_professor='Prof. B', matricula_professor='P000000002')

# Turmas
# Cada turma precisa de um professor_principal

turma1 = Turma.objects.create(nome_turma='Turma 1', turno='Manhã', professor_principal=prof1, turma='A')
turma2 = Turma.objects.create(nome_turma='Turma 2', turno='Tarde', professor_principal=prof2, turma='B')

# Alunos
aluno1 = Aluno.objects.create(nome_aluno='Aluno 1', turma=turma1, matricula_aluno='A000000001')
aluno2 = Aluno.objects.create(nome_aluno='Aluno 2', turma=turma2, matricula_aluno='A000000002')

# Exibir resultados
print('Professores:')
for p in Professor.objects.all():
    print(p.id, p.nome_professor, p.matricula_professor)

print('\nTurmas:')
for t in Turma.objects.all():
    print(t.id, t.nome_turma, t.turno, t.professor_principal.nome_professor, t.turma)

print('\nAlunos:')
for a in Aluno.objects.all():
    print(a.id, a.nome_aluno, a.matricula_aluno, a.turma.nome_turma)
