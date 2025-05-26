from django.test import TestCase
from .models import Professor, Turma, Aluno
from django.urls import reverse
import json

# Create your tests here.

class PopulaModelosTestCase(TestCase):
    def setUp(self):
        # Cria professores
        self.professores = [
            Professor.objects.create(nome_professor="João Silva", matricula_professor="P12345", ativo=True),
            Professor.objects.create(nome_professor="Joana Oliveira", matricula_professor="P54321", ativo=True),
            Professor.objects.create(nome_professor="Mario Gomes", matricula_professor="P12543", ativo=True),
        ]
        # Cria turmas
        self.turmas = [
            Turma.objects.create(turno="Manhã", nome_turma="Primeira Série", professor_principal=self.professores[0], turma="Turma 1A", ativo=True),
            Turma.objects.create(turno="Tarde", nome_turma="Primeira Série", professor_principal=self.professores[1], turma="Turma 1B", ativo=True),
            Turma.objects.create(turno="Noite", nome_turma="Primeira Série", professor_principal=self.professores[2], turma="Turma 1C", ativo=True),
        ]
        # Cria alunos e associa às turmas
        self.alunos = [
            Aluno.objects.create(nome_aluno="Mario Silva", turma=self.turmas[0], matricula_aluno="A67890", ativo=True),
            Aluno.objects.create(nome_aluno="Marcos Pereira", turma=self.turmas[0], matricula_aluno="A12345", ativo=True),
            Aluno.objects.create(nome_aluno="Maria Souza", turma=self.turmas[1], matricula_aluno="A67123", ativo=True),
            Aluno.objects.create(nome_aluno="Ana Costa", turma=self.turmas[1], matricula_aluno="A67321", ativo=True),
            Aluno.objects.create(nome_aluno="Pedro Lima", turma=self.turmas[2], matricula_aluno="A09876", ativo=True),
            Aluno.objects.create(nome_aluno="Lucas Martins", turma=self.turmas[2], matricula_aluno="A09678", ativo=True),
        ]
        # Define representantecdas turmas
        self.turmas[0].representante = self.alunos[0]
        self.turmas[0].save()
        self.turmas[1].representante = self.alunos[2] 
        self.turmas[1].save()
        self.turmas[2].representante = self.alunos[4] 
        self.turmas[2].save()

    def test_professores_criados(self):
        self.assertEqual(Professor.objects.count(), 3)
        self.assertEqual(self.professores[1].nome_professor, "Joana Oliveira")

    def test_turmas_criadas(self):
        self.assertEqual(Turma.objects.count(), 3)
        self.assertEqual(self.turmas[0].nome_turma, "Primeira Série")
        self.assertEqual(self.turmas[0].turma, "Turma 1A")
        self.assertEqual(self.turmas[0].professor_principal, self.professores[0])
        self.assertEqual(self.turmas[0].representante, self.alunos[0])

    def test_alunos_criados(self):
        self.assertEqual(Aluno.objects.count(), 6)
        self.assertEqual(self.alunos[0].nome_aluno, "Mario Silva")
        self.assertEqual(self.alunos[0].turma, self.turmas[0])
