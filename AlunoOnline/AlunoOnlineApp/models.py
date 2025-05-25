from django.db import models

class Professor(models.Model):
    nome_professor = models.CharField(max_length=100)
    email_professor = models.EmailField(unique=True)
    id_professor = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.nome

class Turma(models.Model):
    nome_turma = models.CharField(max_length=100, unique=True)
    ano = models.IntegerField()
    professor_principal = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True, blank=True, related_name='turmas_lecionadas')
    # on_delete=models.SET_NULL: se o professor for deletado, o campo na turma fica nulo (precisa de null=True)
    # related_name: permite acessar as turmas de um professor (ex: professor_obj.turmas_lecionadas.all())
    # ... outros campos da turma

    def __str__(self):
        return self.nome_turma

class Aluno(models.Model):
    nome_aluno = models.CharField(max_length=100)
    email_aluno = models.EmailField(unique=True)
    matricula_aluno = models.CharField(max_length=20, unique=True)
    turmas = models.ManyToManyField(Turma, related_name='alunos') # Aluno pode estar em várias turmas
    # ... outros campos do aluno

    def __str__(self):
        return self.nome