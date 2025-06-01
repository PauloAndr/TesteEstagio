from django.shortcuts import render
from django.http import JsonResponse
from .models import Turma, Professor, Aluno  # Certifique-se de que os modelos Turma, Professor e Aluno estão importados corretamente
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TurmaSerializer, ProfessorSerializer, AlunoSerializer

# Create your views here.


        #GET VIEWS
class TurmaListAPIView(APIView):
    def get(self, request):
        turmas = Turma.objects.filter(ativo=True)
        serializer = TurmaSerializer(turmas, many=True)
        return Response({'turmas': serializer.data}, status=status.HTTP_200_OK)

class ProfessorListAPIView(APIView):
    def get(self, request):
        professores = Professor.objects.filter(ativo=True)
        serializer = ProfessorSerializer(professores, many=True)
        return Response({'professores': serializer.data}, status=status.HTTP_200_OK)

class AlunoListAPIView(APIView):
    def get(self, request):
        alunos = Aluno.objects.filter(ativo=True)
        serializer = AlunoSerializer(alunos, many=True)
        return Response({'alunos': serializer.data}, status=status.HTTP_200_OK)


            #CREATE VIEWS   
class ProfessorCreateAPIView(APIView):
    def post(self, request):
        nome = request.data.get('nome_professor')
        matricula = request.data.get('matricula_professor')
        if not nome or not matricula:
            return Response({'error': 'Nome e matrícula são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
        if Professor.objects.filter(matricula_professor=matricula).exists():
            return Response({'error': 'Matrícula já cadastrada.'}, status=status.HTTP_400_BAD_REQUEST)
        professor = Professor.objects.create(nome_professor=nome, matricula_professor=matricula)
        serializer = ProfessorSerializer(professor)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AlunoCreateAPIView(APIView):
    def post(self, request):
        nome = request.data.get('nome_aluno')
        matricula = request.data.get('matricula_aluno')
        turma_id = request.data.get('turma_id')
        if not nome or not matricula:
            return Response({'error': 'Nome e matrícula são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
        if Aluno.objects.filter(matricula_aluno=matricula).exists():
            return Response({'error': 'Matrícula já cadastrada.'}, status=status.HTTP_400_BAD_REQUEST)
        turma = None
        if turma_id:
            try:
                turma = Turma.objects.get(id=turma_id)
            except Turma.DoesNotExist:
                return Response({'error': 'Turma não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        aluno = Aluno.objects.create(nome_aluno=nome, matricula_aluno=matricula, turma=turma)
        serializer = AlunoSerializer(aluno)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TurmaCreateAPIView(APIView):
    def post(self, request):
        serie = request.data.get('serie')
        turno = request.data.get('turno')
        professor_id = request.data.get('professor_principal_id')
        turma_field = request.data.get('turma')
        if not serie or not turno or not turma_field:
            return Response({'error': 'Série, turno e campo turma são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
        professor = None
        if professor_id:
            try:
                professor = Professor.objects.get(id=professor_id)
            except Professor.DoesNotExist:
                return Response({'error': 'Professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        turma_obj = Turma.objects.create(
            serie=serie,
            turno=turno,
            professor_principal=professor,
            turma=turma_field
        )
        serializer = TurmaSerializer(turma_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


            #DELETE VIEWS
class AlunoDeleteAPIView(APIView):
    def delete(self, request, aluno_id):
        try:
            aluno = Aluno.objects.get(id=aluno_id)
            if not aluno.ativo:
                return Response({'error': 'Aluno não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
            turmas_representante = Turma.objects.filter(representante=aluno)
            for turma in turmas_representante:
                turma.representante = None
                turma.save()
            aluno.ativo = False
            aluno.save()
            return Response({'message': 'Aluno excluído com sucesso.'}, status=status.HTTP_200_OK)
        except Aluno.DoesNotExist:
            return Response({'error': 'Aluno não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

class ProfessorDeleteAPIView(APIView):
    def delete(self, request, professor_id):
        try:
            professor = Professor.objects.get(id=professor_id)
            if not professor.ativo:
                return Response({'error': 'professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
            turmas_professor = Turma.objects.filter(professor_principal=professor)
            for turma in turmas_professor:
                turma.professor_principal = None
                turma.save()
            professor.ativo = False
            professor.save()
            return Response({'message': 'professor excluído com sucesso.'}, status=status.HTTP_200_OK)
        except Professor.DoesNotExist:
            return Response({'error': 'professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

class TurmaDeleteAPIView(APIView):
    def delete(self, request, turma_id):
        try:
            turma = Turma.objects.get(id=turma_id)
            if not turma.ativo:
                return Response({'error': 'Turma não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
            alunos = Aluno.objects.filter(turma=turma)
            for aluno in alunos:
                aluno.turma = None
                aluno.save()
            turma.ativo = False
            turma.save()
            return Response({'message': 'Turma excluída com sucesso.'}, status=status.HTTP_200_OK)
        except Turma.DoesNotExist:
            return Response({'error': 'Turma não encontrada.'}, status=status.HTTP_404_NOT_FOUND)


            #UPDATE VIEWS
class ProfessorUpdateAPIView(APIView):
    def put(self, request, professor_id):
        try:
            professor = Professor.objects.get(pk=professor_id)
        except Professor.DoesNotExist:
            return Response({'error': 'Professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        original_data = ProfessorSerializer(professor).data
        updated_data = {**original_data, **request.data}
        serializer = ProfessorSerializer(professor, data=updated_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TurmaUpdateAPIView(APIView):
    def put(self, request, turma_id):
        try:
            turma = Turma.objects.get(pk=turma_id)
        except Turma.DoesNotExist:
            return Response({'error': 'Turma não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        original_data = TurmaSerializer(turma).data
        updated_data = {**original_data, **request.data}
        serializer = TurmaSerializer(turma, data=updated_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AlunoUpdateAPIView(APIView):
    def put(self, request, aluno_id):
        try:
            aluno = Aluno.objects.get(pk=aluno_id)
        except Aluno.DoesNotExist:
            return Response({'error': 'Aluno não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        original_data = AlunoSerializer(aluno).data
        updated_data = {**original_data, **request.data}
        serializer = AlunoSerializer(aluno, data=updated_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

            #Detail Views
class ProfessorDetailAPIView(APIView):
    def get(self, request, professor_id):
        try:
            professor = Professor.objects.get(pk=professor_id)
        except Professor.DoesNotExist:
            return Response({'error': 'Professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProfessorSerializer(professor)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TurmaDetailAPIView(APIView):
    def get(self, request, turma_id):
        try:
            turma = Turma.objects.get(pk=turma_id)
        except Turma.DoesNotExist:
            return Response({'error': 'Turma não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TurmaSerializer(turma)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AlunoDetailAPIView(APIView):
    def get(self, request, aluno_id):
        try:
            aluno = Aluno.objects.get(pk=aluno_id)
        except Aluno.DoesNotExist:
            return Response({'error': 'Aluno não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AlunoSerializer(aluno)
        return Response(serializer.data, status=status.HTTP_200_OK)

