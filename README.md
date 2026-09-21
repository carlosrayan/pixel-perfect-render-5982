# Link para o Lovable

Link: https://pixel-perfect-render-5982.lovable.app

## Prompt usado no projeto

# PROMPT ÚNICO PARA LOVABLE

Quero criar do zero um SaaS web completo de **matchmaking entre candidatos e vagas de emprego**, com geração e adaptação de currículos **ATS-friendly** para cada vaga.

O projeto deve ser construído integralmente dentro do Lovable, utilizando a infraestrutura e recursos disponíveis na própria plataforma. Não quero depender de desenvolvimento externo para que o MVP funcione.

O produto deve ter aparência de um SaaS moderno, profissional, confiável, simples e agradável de usar.

---

# 1. OBJETIVO DO PRODUTO

Criar uma plataforma onde o usuário possa:

1. Criar sua conta.
2. Cadastrar seu perfil profissional.
3. Importar ou preencher seu currículo.
4. Informar experiências, formação, habilidades, idiomas, certificações e outros dados profissionais.
5. Cadastrar ou importar uma vaga de emprego.
6. Analisar automaticamente a compatibilidade entre o perfil do candidato e a vaga.
7. Exibir um percentual de compatibilidade.
8. Identificar:
   - palavras-chave presentes na vaga;
   - palavras-chave ausentes no currículo;
   - competências exigidas;
   - competências que o usuário possui;
   - competências que faltam;
   - requisitos atendidos;
   - requisitos não atendidos;
   - pontos fortes do currículo;
   - pontos que precisam ser melhorados.
9. Gerar uma versão personalizada do currículo para aquela vaga.
10. Garantir que o currículo gerado seja otimizado para sistemas ATS.
11. Permitir visualizar, editar e salvar diferentes versões de currículo.
12. Permitir exportar o currículo final em PDF.
13. Manter um histórico das vagas analisadas e dos currículos gerados.
14. Mostrar ao usuário quais alterações foram feitas no currículo e por quê.

O foco principal do produto é:

**"Pegue meu perfil profissional + uma vaga e me ajude a criar a versão do meu currículo mais adequada para aquela oportunidade, sem inventar informações."**

---

# 2. NOME PROVISÓRIO

Use inicialmente o nome:

**MatchCV**

O nome deve ficar fácil de alterar posteriormente.

Tagline:

**"Seu currículo alinhado à vaga certa."**

---

# 3. STACK E ARQUITETURA

Utilize uma arquitetura moderna e escalável.

Preferências:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Banco de dados integrado disponível no Lovable
- Autenticação integrada
- Row Level Security quando aplicável
- Backend/server-side functions quando necessário
- Estrutura preparada para integração com APIs de IA
- Componentes reutilizáveis
- Design system centralizado

Não criar uma aplicação apenas visual/mockada.

O sistema precisa ter estrutura real de dados, autenticação, CRUD e persistência.

Evite hardcode de dados importantes.

---

# 4. DESIGN SYSTEM

Utilize **shadcn/ui como base principal do Design System**.

Não crie componentes visuais completamente independentes quando existir um componente equivalente no shadcn/ui.

Utilizar componentes como:

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio Group
- Switch
- Card
- Badge
- Dialog
- Sheet
- Dropdown Menu
- Tabs
- Accordion
- Tooltip
- Alert
- Progress
- Separator
- Table
- Avatar
- Skeleton
- Toast/Sonner
- Form
- Command
- Calendar
- Breadcrumb
- Pagination

Criar uma camada consistente de componentes reutilizáveis.

---

# 5. IDENTIDADE VISUAL

A identidade visual deve transmitir:

- carreira;
- crescimento;
- tecnologia;
- confiança;
- clareza;
- simplicidade;
- profissionalismo.

Paleta principal:

### Verde claro
Usar como cor principal.

Exemplo:
`#86EFAC`

### Verde escuro para textos/ações importantes
Exemplo:
`#166534`

### Amarelo claro
Usar para destaques, alertas positivos e elementos de atenção.

Exemplo:
`#FEF08A`

### Fundo
Branco e tons extremamente suaves de cinza.

Exemplo:
`#FFFFFF`
`#F8FAFC`

### Texto
Cinza muito escuro.

Exemplo:
`#172033`

Evitar uma interface excessivamente colorida.

A maior parte da interface deve ser branca, com verde claro e amarelo claro utilizados estrategicamente.

Utilizar bastante espaço em branco.

---

# 6. PRINCÍPIOS DE UX/UI

O produto deve parecer um SaaS premium, mas simples.

Priorizar:

- hierarquia visual;
- leitura rápida;
- poucos elementos por tela;
- feedback visual;
- estados de loading;
- estados vazios;
- mensagens de erro claras;
- responsividade;
- acessibilidade;
- navegação intuitiva.

Evitar:

- excesso de gradientes;
- excesso de sombras;
- excesso de bordas;
- cards gigantes;
- telas visualmente poluídas;
- animações exageradas;
- elementos decorativos sem função.

Utilizar bordas arredondadas moderadas.

Utilizar animações pequenas e discretas somente quando melhorarem a experiência.

---

# 7. AUTENTICAÇÃO

Criar fluxo completo de autenticação.

Telas:

- Login
- Cadastro
- Recuperação de senha
- Logout
- Configuração inicial do perfil

No cadastro solicitar:

- nome;
- e-mail;
- senha.

Após o cadastro, levar o usuário para um onboarding.

---

# 8. ONBOARDING

Criar um onboarding simples em etapas.

Etapa 1:

"Vamos conhecer seu perfil profissional."

Campos:

- Nome completo
- Cargo atual
- Cargo desejado
- Localização
- Pretensão salarial opcional
- Modelo de trabalho desejado:
  - Presencial
  - Híbrido
  - Remoto
  - Indiferente

Etapa 2:

Experiência profissional.

Permitir adicionar múltiplas experiências:

- Empresa
- Cargo
- Data inicial
- Data final
- Atual
- Descrição
- Principais responsabilidades
- Resultados/conquistas

Etapa 3:

Formação acadêmica:

- Instituição
- Curso
- Grau
- Data inicial
- Data final

Etapa 4:

Habilidades:

Permitir cadastrar múltiplas skills.

Exemplos:

- Excel
- Power BI
- SAP
- SQL
- Python
- Gestão de estoque
- Logística

Cada habilidade poderá ter nível:

- Básico
- Intermediário
- Avançado
- Especialista

Etapa 5:

Idiomas.

Etapa 6:

Certificações.

Etapa 7:

Resumo profissional.

Ao finalizar, mostrar:

"Seu perfil está pronto."

---

# 9. DASHBOARD

Criar um dashboard principal.

Sidebar desktop:

- Dashboard
- Meu Perfil
- Meu Currículo
- Analisar Vaga
- Minhas Vagas
- Currículos Gerados
- Histórico
- Configurações

No mobile utilizar menu lateral/drawer.

Dashboard deve mostrar:

## Saudação

"Olá, [nome] 👋"

Subtexto:

"Encontre oportunidades que combinam com seu perfil e adapte seu currículo para cada vaga."

## Card principal

"Analisar uma nova vaga"

CTA:

**Analisar vaga**

## Métricas

Mostrar:

- Vagas analisadas
- Currículos personalizados
- Melhor match
- Aplicações realizadas, caso esse recurso seja implementado

## Vagas recentes

Mostrar as últimas vagas analisadas.

Cada vaga deve exibir:

- cargo;
- empresa;
- data;
- score de compatibilidade;
- status.

---

# 10. MEU PERFIL

Criar uma página completa para o perfil profissional.

Seções:

### Informações pessoais

### Resumo profissional

### Experiência

### Formação

### Habilidades

### Idiomas

### Certificações

### Projetos

### Links

Permitir:

- editar;
- adicionar;
- excluir;
- reordenar experiências.

Salvar tudo no banco.

---

# 11. MEU CURRÍCULO

Criar uma área onde o usuário possa montar seu currículo base.

O currículo deve ser estruturado por dados, e não apenas como um texto gigante.

Estrutura:

1. Informações de contato
2. Título profissional
3. Resumo
4. Experiência profissional
5. Formação
6. Habilidades
7. Idiomas
8. Certificações
9. Projetos
10. Links profissionais

Permitir salvar o currículo como:

**Currículo principal**

Esse currículo será a fonte para geração dos currículos personalizados.

---

# 12. IMPORTAÇÃO DE CURRÍCULO

Criar opção:

**"Já tenho um currículo"**

Permitir upload de:

- PDF
- DOCX

O sistema deve extrair o conteúdo e tentar estruturar as informações nos campos do perfil.

IMPORTANTE:

Nunca assumir que uma informação encontrada no documento é verdadeira sem permitir que o usuário revise.

Após a importação mostrar:

"Confira seus dados antes de continuar."

Mostrar os campos extraídos para revisão.

---

# 13. ANALISAR VAGA

Essa é uma das funcionalidades centrais.

Criar página:

**Analisar nova vaga**

Permitir:

### Opção 1

Colar a descrição da vaga.

Textarea grande.

### Opção 2

Informar:

- Cargo
- Empresa
- Localização
- URL da vaga
- Descrição da vaga

Se houver suporte técnico para captura da URL, deixar a arquitetura preparada, mas o MVP deve funcionar perfeitamente com texto colado.

CTA:

**Analisar vaga**

---

# 14. PROCESSAMENTO DA VAGA

Ao analisar uma vaga, extrair e estruturar:

### Informações básicas

- Cargo
- Empresa
- Localização
- Modelo de trabalho

### Requisitos obrigatórios

### Requisitos desejáveis

### Hard skills

### Soft skills

### Ferramentas

### Tecnologias

### Formação

### Experiência exigida

### Idiomas

### Palavras-chave

### Responsabilidades

### Benefícios, se disponíveis

---

# 15. MATCHMAKING

Criar um algoritmo de compatibilidade entre:

**Perfil do usuário**

e

**Vaga**

Gerar um score de 0 a 100.

IMPORTANTE:

Não apresentar o score como uma "probabilidade de contratação".

O score representa apenas:

**"Compatibilidade entre o perfil informado e os requisitos identificados na vaga."**

Criar categorias:

- Experiência
- Hard skills
- Soft skills
- Formação
- Idiomas
- Ferramentas
- Palavras-chave
- Requisitos obrigatórios

Cada categoria deve possuir um score próprio.

Exemplo:

```text
Compatibilidade geral
82%

Experiência
90%

Hard skills
85%

Formação
100%

Idiomas
70%

Palavras-chave
78%


