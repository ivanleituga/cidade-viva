# Cidade Viva

Trabalho da disciplina de Programação para Dispositivos Móveis em Android (Prof. Julio Cartier - Estácio).

## Integrantes

- Ivan Leituga Carvalho Pellon de Miranda (matrícula: 2024.03.47868-4)

## Sobre o projeto

App para registrar problemas urbanos do bairro: buraco na rua, poste apagado, foco de dengue, lixo descartado em lugar errado, essas coisas. A ideia é dar uma forma simples de documentar o que está acontecendo na vizinhança, classificar a gravidade e acompanhar até virar resolvido.

Categorias suportadas: buraco na via, iluminação pública, foco de dengue, lixo/entulho, vazamento de água, árvore/poda, sinalização, e um "outro" genérico.

## Tecnologias

- Expo SDK 54 (React Native 0.81, React 19.1)
- React Navigation v7 (Bottom Tabs com Native Stack aninhado)
- expo-sqlite para persistência local
- expo-image-picker para câmera e galeria

## Como rodar

Precisa de Node.js 20.19.4 ou superior (testei no Node 22 LTS) e o app Expo Go instalado no celular.

\`\`\`
git clone https://github.com/ivanleituga/cidade-viva.git
cd cidade-viva
npm install
npx expo start
\`\`\`

Lê o QR code com o Expo Go (no Android, pelo próprio app; no iOS, pela câmera do iPhone). Celular e computador precisam estar na mesma rede Wi-Fi.

Observação: o projeto usa Expo SDK 54 porque é a versão que o Expo Go das lojas suporta atualmente (junho/2026). Se aparecer erro de incompatibilidade, atualiza o Expo Go.

## Estrutura

\`\`\`
cidade-viva/
├── index.js                 entry point
├── App.js                   componente raiz, inicializa banco e navegação
├── src/
│   ├── database/db.js       camada de acesso ao SQLite
│   ├── navigation/          configuração das tabs e stacks
│   ├── screens/             5 telas (home, lista, form, detalhe, stats)
│   ├── components/          cards, badges, empty states
│   ├── theme/colors.js      design tokens (cores, spacing, radius)
│   └── utils/categories.js  catálogo de categorias/status/severidades
\`\`\`

O CRUD fica todo concentrado em `src/database/db.js` (createReport, listReports, getReportById, updateReport, updateReportStatus, deleteReport, getStats). As telas chamam essas funções sem precisar conhecer SQL, o que facilita testar e eventualmente trocar de banco no futuro.

## Funcionalidades

- Listar registros com filtro por categoria e por status
- Criar registro novo, com foto opcional (câmera ou galeria)
- Ver detalhe completo
- Editar
- Mudar status rapidamente (aberto -> análise -> resolvido) sem entrar no formulário
- Excluir com confirmação
- Tela de estatísticas com contagem por categoria, status e gravidade