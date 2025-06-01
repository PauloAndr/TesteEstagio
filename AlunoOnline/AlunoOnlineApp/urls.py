from django.urls import path
from . import views

urlpatterns = [
    path('turmas/', views.TurmaListAPIView.as_view(), name='get_turmas'),
    path('turmas/post/', views.TurmaCreateAPIView.as_view(), name='post_turma'),
    path('turmas/<int:turma_id>/delete/', views.TurmaDeleteAPIView.as_view(), name='delete_turma'),
    path('turmas/<int:turma_id>/update/', views.TurmaUpdateAPIView.as_view(), name='update_turma'),
    path('turmas/<int:turma_id>/', views.TurmaDetailAPIView.as_view(), name='get_turma'),
    path('professores/', views.ProfessorListAPIView.as_view(), name='get_professores'),
    path('professores/post/', views.ProfessorCreateAPIView.as_view(), name='post_professor'),
    path('professores/<int:professor_id>/delete/', views.ProfessorDeleteAPIView.as_view(), name='delete_professor'),
    path('professores/<int:professor_id>/update/', views.ProfessorUpdateAPIView.as_view(), name='update_professor'),
    path('professores/<int:professor_id>/', views.ProfessorDetailAPIView.as_view(), name='get_professor'),
    path('alunos/', views.AlunoListAPIView.as_view(), name='get_alunos'),
    path('alunos/post/', views.AlunoCreateAPIView.as_view(), name='post_aluno'),
    path('alunos/<int:aluno_id>/delete/', views.AlunoDeleteAPIView.as_view(), name='delete_aluno'),
    path('alunos/<int:aluno_id>/update/', views.AlunoUpdateAPIView.as_view(), name='update_aluno'),
    path('alunos/<int:aluno_id>/', views.AlunoDetailAPIView.as_view(), name='get_aluno'),
]