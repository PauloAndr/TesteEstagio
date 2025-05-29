from rest_framework import serializers
from .models import Turma, Professor, Aluno

class ProfessorSerializer(serializers.ModelSerializer):
    turma_lecionado = serializers.StringRelatedField()  # Exibe o nome da turma como string

    class Meta:
        model = Professor
        fields = ['id', 'nome_professor', 'matricula_professor']

class AlunoSerializer(serializers.ModelSerializer):
    turma = serializers.StringRelatedField() # Exibe o nome da turma como string

    class Meta:
        model = Aluno
        fields = ['id', 'nome_aluno', 'matricula_aluno', 'turma']

class TurmaSerializer(serializers.ModelSerializer):
    professor_principal = ProfessorSerializer(read_only=True)
    representante = AlunoSerializer(read_only=True)
    alunos = AlunoSerializer(many=True, read_only=True)

    class Meta:
        model = Turma
        fields = ['id', 'turno', 'serie', 'turma', 'professor_principal', 'representante', 'alunos']