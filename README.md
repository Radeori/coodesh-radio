# Coodesh Radio

>  This is a challenge by [Coodesh](https://coodesh.com/)
Este é um desafio por [Coodesh](https://coodesh.com/) (em tradução livre)

## Descrição

O presente repositório é um projeto de Rádio Online, em que estações são carregadas a partir de uma API e podem ser filtradas e reproduzidas.

## Tecnologias utilizadas
* [HTML5](https://developer.mozilla.org/en-US/docs/Glossary/HTML5), [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript), [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) - tecnologias básicas do desenvolvimento Web
* [React](https://react.dev/) - biblioteca para desenvolvimento de interfaces
* [Next.js](https://nextjs.org/) - framework para desenvolvimento com React
* [CSS Modules](https://github.com/css-modules/css-modules) - "compilador" de CSS para [ICSS](https://github.com/css-modules/icss)
* [Bootstrap](https://getbootstrap.com/) - ferramentas de front-end baseadas em [Sass](https://sass-lang.com/) que oferecem interface em grade e componentes
* [Bootstrap Icons](https://icons.getbootstrap.com/) - biblioteca de ícones

## Como instalar e como utilizar
### Como instalar
npm install
### Como utilizar
npm run dev

## Documentação do processo criativo de desenvolvimento
### Resumo das decisões
* Tecnologia principal empregada no projeto: Next.js (framework React).
* Seguir o mais fielmente possível (com exceções julgadas interessantes) o [wireframe](https://www.figma.com/design/TDuhDdbwdzIVQjNV3GF9Qi/Radio?node-id=0-1&node-type=canvas&t=OcoUJYt2kTyTRN1q-0) disponibilizado pela apresentação do desafio.
* Versões desktop e mobile contam com botões azuis para abrir/fechar a sidebar.
* Utilização de localStorage para persistência de lista de estações favoritas e suas informações editáveis.
* Impossibilidade de customizar ordenação ou filtro visual na busca de estações.
* Formulário de edição é exibido na própria lista de estações favoritas, com os campos nome e tags.
    * Confirmação do formulário pode ser feita ao pressionar a tecla Enter ou NumpadEnter, ao tirar a seleção dos campos de texto ou clicar no botão com ícone de prancheta.
* Seguindo integridade com Bootstrap, padronizou-se que qualquer visualidade ou interatividade própria de aparelhos móveis seria disponibilizada no caso da largura da tela ser inferior a 576px.
* Julgando o conjunto de dados da API como pequeno, a paginação foi feita localmente, com a possibilidade de pular para a última página a qualquer momento.
### Diário de mudanças e decisões
### 04/10/2024 - Initial commit (Commit inicial)
##### Changelog
* Fork do repositório descritivo [Radio Browser Challenge](https://github.com/coodesh/frontend-radio-browser)
##### Decisões
* O projeto-desafio aqui presente compõe avaliação técnica para processo seletivo de cargo Frontend React Developer (desenvolvedora front-end com tecnologia React). Com base nisso e em critérios propostos no [README do desafio](https://github.com/coodesh/frontend-radio-browser/blob/main/README.md) decidiu-se utilizar como base o framework Next.js.
###### Descrição do Next.js
> The React Framework for the Web. Used by some of the world's largest companies, Next.js enables you to create high-quality web applications with the power of React components.

Em tradução livre:
React Framework para Web. Usado por algumas das maiores empresas do mundo, Next.js permite que você crie aplicações Web de alta qualidade com o poder de componentes React.
### 08/10/2024 - Inicializado app com Next.js padrão
##### Changelog
* `npx coodesh-radio@latest` - criação de aplicação Next.js básica
* Primeira versão deste `README.md`
### 08/10/2024 - Iniciada criação da aplicação a partir do Next.js
##### Changelog
* Desenhado e aplicado favicon próprio
* Iniciada página principal
* Alterada fonte padrão para Inter
##### Decisões
* Desde a escolha da fonte padrão Inter (amplamente utilizada na aplicação Figma), decidiu-se seguir ao máximo o [design apresentado](https://www.figma.com/design/TDuhDdbwdzIVQjNV3GF9Qi/Radio?node-id=0-1&node-type=canvas&t=OcoUJYt2kTyTRN1q-0) na descrição do desafio.
### 09/10/2024 - Adicionado fetch da api
##### Changelog
* Adicionada sidebar
* Implementado consumo da [API](https://de1.api.radio-browser.info/) para popular sidebar
* Implementada lista de estações favoritas
* Adicionadas funções de adicionar, visualizar e remover estação favorita
* Estilizada página para se parecer com o wireframe de referência
##### Decisões
* Pela aplicação contar com apenas umas página, optou-se por também unificar a utilização de arquivos específicos por linguagem durante a fase de desenvolvimento. Espera-se muitas alterações inespecíficas no código e essa escolha visa reduzir o esforço empenhado em realizar essas alterações.
### 09/10/2024 - Atualizado README
##### Changelog
* Alterado arquivo `README.md` para uma versão MVP (mínimo produto viável, em tradução do inglês)
##### Decisões
* Aproxima-se o prazo de entrega previsto e fez-se necessário viabilizar essa entrega. O que foi feito com a atualização do único requisito que estava atrasado.
### 10/10/2024 - Finalizado desenho desktop da página
##### Changelog
* Implementadas rolagens separadas para sidebar e lista de estações favoritas
* Adicionadas interatividades gráficas para melhorar a experiência de utilização
* Incrementados elementos da seção principal para tornar a apresentação ainda mais parecida com o disposto no design de referência
* Adicionado botão com ícone de lixeira, criando mais um fluxo possível para remover a estação da lista de favoritas (antes possível apenas pela sidebar, com um clique "liga/desliga")
* Adicionado botão de edição para futura e prevista implementação
### 10/10/2024 - Adicionada função de abrir e fechar sidebar
##### Changelog
* Adicionada mudança de cursor e interação gráfica nos botões de abrir/fechar sidebar
* Adicionada função de abrir e fechar a sidebar efetivamente, com reorganização dos elementos visíveis
##### Decisões
* Interpretativamente, a lógica de visualização da sidebar girou em torno dos botões azuis do wireframe apresentado. Como, na versão mobile, o botão da lupa ocupa o mesmo espaço do botão de menu, com a diferença do conteúdo apresentado no resto da tela, fez-se com que cada um deles mudasse essa apresentação.
Mantendo a integridade, a versão desktop seguiu a mesma lógica, com diferença no posicionamento dos botões e no fato de que o botão de abrir a sidebar é composto pela lupa e pelo texto "Search stations".
### 10/10/2024 - Adicionado localStorage para salvar os favoritos
##### Changelog
* Adicionada persistência da lista de favoritos utilizando o localStorage
##### Decisões
* Dado o requisito de salvar as informações de utilização da aplicação, escolheu-se o localStorage por ser uma solução nativa e simples de implementar.
### 10/10/2024 - Implementada busca
##### Changelog
* Adicionada função de buscar estações de rádio para preencher a sidebar até o máximo de 10 registros
##### Decisões
* A busca, presente no design no Figma, foi utilizada para atender à demanda de filtrar as estações por nome da rádio, país ou idioma.
* De forma prática, o filtro é incremental entre: nome da rádio, nome do país, código do país, idioma e tags. Em que os resultados são combinados e mantêm-se exibindo apenas os 10 primeiros.
* O primeiro critério de ordenação é o pertencimento a cada um dos filtros acima, respectivamente. O critério de desempate é a própria ordenação da API, descrita como multifatorial.
* Buscando fidelidade ao wireframe, não se fez possível customizar nem ordenação nem filtro ao utilizar a presente aplicação.
### 10/10/2024 - Feita interface para iniciar e parar de tocar rádio
##### Changelog
* Adicionado espaço para exibir qual estação é reproduzida
* Adicionado botão de play, que esmaece e fica em cima do ícone da rádio enquanto o ponteiro do mouse sobrevoa qualquer parte das informações da estação favorita
* Adicionado botão de stop, para alternar com o botão de play de acordo com qual estação é reproduzida
* Adicionada interação de play/stop, ainda sem efetivamente reproduzir qualquer som
### 10/10/2024 - Adicionada função de efetivamente iniciar som das radios
##### Changelog
* Implementada reprodução de áudio a partir da url da estação selecionada para tal
##### Decisões
* Optou-se novamente por uma solução nativa, utilizando a classe Audio.
### 10/10/2024 - Adicionada função de editar rádio da lista de favoritas
##### Changelog
* Adicionada função de habilitar edição de nome e tags de estação favorita ao clicar no botão com ícone de lápis
* Adicionado formulário simples para realizar tal edição
* Adicionada resposta de mover a barra de rolagem para o final quando é adicionada uma estação à lista de favoritas que excede o tamanho exibido
##### Decisões
* Atendendo ao requisito de editar informações de uma rádio, implementou-se um formulário, com os campos de nome e tags, que aparece no lugar em que antes havia tais informações consolidadas.
* Focando, por ora, na versão da aplicação para desktop, decidiu-se que a confirmação do formulário acontece ao pressionar a tecla Enter.
### 11/10/2024 - Ajustado estilo para melhor responsividade no mobile
##### Changelog
* Alteradas medidas de elementos (e suas unidades) para manter a visualização desejada entre diferentes tamanhos de tela
* Adicionadas regras específicas de estilo para (tamanhos referentes a) telas de dispositivos móveis
* Aprimorada interface da lista de estações favoritas para, em telas pequenas, sempre exibir os botões de play, edição e remoção
* Adicionadas classes bootstrap em elementos para que se adaptem a diferentes tamanhos de tela
##### Decisões
* Para manter a integridade com as classes bootstrap, definiu-se para toda a aplicação que seria considerado aparelho móvel qualquer tela com largura menor que 576px.
* Diferente do que foi apresentado na proposta do desafio, decidiu-se que a lista de estações favoritas mostrasse o tempo todo, na versão mobile, não só o botão de remoção, como o de edição e play também.
### 11/10/2024 - Aprimorada edição das rádios favoritas
##### Changelog
* Adicionado fluxos alternativos para confirmar formulário de edição baseados em tirar a seleção do mesmo
##### Decisões
* Considerando a experiência mobile e diferentes tipos de utilizadores, o formulário de edição agora pode ser confirmado clicando em um (novo) botão de confirmação ou simplemente clicando fora de qualquer um dos campos (nome ou tags).
### 12/10/2024 - Adicionada paginação na busca de estações
##### Changelog
* Adicionada interface de paginação abaixo da lista de estações buscadas
    * Inserida informação textual com número da página atual e número total de páginas
    * Inseridos botões para ir para a primeira página, retroceder uma página, avançar uma página e ir para a última página
* Alterado consumo da API para trazer todos os registros (de acordo com o critério de busca)
* Paginação feita localmente
##### Decisões
* Julgou-se importante apresentar a informação de número total de páginas.
* Para obter esse total, a única forma cogitada — dado que a função não existe na API — foi capturar todos os registros e realizar a devida conta.
* Uma vez que o conjunto total de registros já seria pego, decidiu-se por armazená-los em variável local não persistida e fazer a paginação na própria lógica de programação da aplicação.
* Em posse de todos esses dados, optou-se por adicionar botões de navegação individual pelas páginas, bem como botões de "primeira" e "última", lembrando a interface de reprodutores de áudio.