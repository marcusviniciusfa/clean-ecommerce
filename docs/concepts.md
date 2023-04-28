<h2 align="center">Conceitos</h2>

* Testes
  * Estrutura
    * Given/Arrange
      * Definição de todas as informações necessárias para executar o comportamento que será testado
    * When/Act
      * Executar o comportamento
    * Then/Assert
      * Verificar o que aconteceu após a execução, comparando as informações retornadas com a expectativa que foi criada
  * Pirâmide de testes
    * Quanto mais próximo do topo da pirâmide mais o teste é complexo e lento para executar
    * Quanto mais próximo da base da pirâmide mais o teste é simples de implementar e rápido para executar
    * Testes end-to-end (topo da pirâmide)
      * Replicam o ambiente do usuário final, ou seja, são testes executados de ponta a ponta. Pelas suas características acabam sendo mais lentos e frágeis, sendo quebrados facilmente caso a interface com o usuário final seja modificada
    * Testes de integração (meio da pirâmide)
      * Testam componentes pertencentes à múltiplas camadas e normalmente envolvem recursos externos, sejam eles reais ou não, ou seja, o fato de utilizar um Test Pattern (Test Double) como um stub ou mock não torna o teste de unidade. Em geral são mais lentos por fazerem I/O
    * Testes unitários (base da pirâmide)
      * São testes de unidade, não necessariamente unitários, que podem ou não envolver vários componentes pertencentes à mesma camada e sem qualquer interação com recursos externos como um banco de dados, uma API ou o sistema de arquivos. Por não consumirem recursos externos são muito rápidos, sendo executados em poucos milissegundos
  * FIRST
    * Fast
      * Os testes devem executar rapidamente
    * Independent
      * Não devem existir dependências entre os testes, eles devem poder ser executados de forma isolada
    * Repeatable
      * O resultado deve ser o mesmo independente da quantidade de vezes que seja executado
    * Self-validating
      * O próprio teste deve ter uma saída bem definida que é válida ou não fazendo com que ele passe ou falhe
    * Timely
      * Os testes devem ser escritos antes do código
  * TDD
    * Red
      * Escrever um teste que falhe
    * Green
      * Fazer o código passar no teste
    * Refactor
      * Refatorar o código
    * Três leis do TDD
      * Você não pode escrever nenhum código até ter escrito um teste que detecte uma possível falha
      * Você não pode escrever mais testes de unidade do que o suficiente para detectar a falha
      * Você não pode escrever mais código do que o suficiente para passar nos testes
  * Test Doubles
    * São objetos que substituem as dependências (DOC - Dependency Of Concerns) reais de um sistema durante os testes. Eles são usados para isolar o código que está sendo testado e garantir que os testes sejam executados de forma consistente e previsível
    * Dummy
      * Objetos que criamos apenas para completar a lista de parâmetros que precisamos passar para invocar um determinado método
    * Stubs
      * Objetos que retornam respostas prontas, definidas para um determinado teste, por questão de performance ou segurança
    * Spies
      * Objetos que "espionam" a execução do método e armazenam os resultados para verificação posterior
    * Mocks
      * Objetos similares a stubs e spies, permitem que você diga exatamente o que quer que ele faça e o teste vai quebrar se isso não acontecer
    * Fake
      * Objetos que tem implementações que simulam o funcionamento da instância real, que seria utilizada em produção
* Design de Código
  * É a estrutura (organização dos relacionamentos) que suporta o comportamento (funcionalidade). Design tem mais a ver com separação de responsabilidades e dua distribuição, enquanto a arquitetura se preocupa com as restrições
* Ports and Adapters ou Arquitetura Hexagonal
  * Design de Código que visa separar as responsabilidade de Drivers (clientes) e Driven (recursos) da aplicação em si, criando uma porta de comunicação padrão para os clientes e adaptadores que irão implementar um contrato para o consumo dos recursos
* Inversão de Dependência
  * Uma forma de organizar relacionamentos para que uma dependência possa ser inserida em tempo de execução. A estratégia é depender de uma interface (contrato) e receber alguma classe que implemente essa interface por meio do construtor, removendo assim o acoplamento de classes concretas e permitindo variar a implementação da dependência. Injeção de Dependência nada mais é do que a forma como será inserida a dependência. DI (Dependency Inversion) é muito útil para os testes, por permitir o controle sobre as dependências ao remover o acoplamento.
* Relações em Orientação a Objetos
  * Associação (Agregação/Composição)
    * Relação "têm um", caracteriza-se por atributos de classe que fazem referência a outra classe ou interface
    * Exemplo
      ~~~ts
      class Contract {
        custumer: Custumer
        // ...
      }
      ~~~
  * Herança
    * Relação "é um", ou seja, uma classe herda de outra, geralmente usando a palavra reservada `extends`
    * Exemplo
      ~~~ts
      class Lion extends Animal {
        // ...
      }
      ~~~
  * Dependência
    * Caracterizada por parâmetros de um método de classe que fazem referência para outra classe ou interface
    * Exemplo
      ~~~ts
      class Order {
        code: string
        lines: Line[]

        addProduct (product: Product, quantity: number) {
          this.lines.push(new Line(product.idProduct, product.price, quantity))
        }
      }
      ~~~
