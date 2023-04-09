<h2 align="center">Projeto - Parte 2</h2>

### Testes

* [x] Não deve aplicar cupom de desconto expirado
* [x] Ao fazer um pedido, a quantidade de um item não pode ser negativa
* [x] Ao fazer um pedido, o mesmo item não pode ser informado mais de uma vez
* [x] Nenhuma dimensão do item pode ser menor ou igual a zero
* [x] O peso do item não pode ser menor ou igual a zero
* [x] Deve calcular o valor do frete com base nas dimensões (altura, largura e profundidade em cm) e o peso dos produtos (em kg)
* [x] Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado

### Considerações

* O valor mínimo é de R$10,00
* A distância é fixa, de 1000 km

#### Fórmula de Cálculo do Frete

Valor do frete = distância (km) * volume (m3) * (densidade/100)

##### Exemplos de volume ocupado (cubagem)

* Camera: 20cm x 15 cm x 10 cm = 0,003 m3
* Guitarra: 100cm x 30cm x 10cm = 0,03 m3
* Geladeira: 200cm x 100cm x 50cm = 1 m3

##### Exemplos de densidade

* Câmera: 1kg / 0,003 m3 = 333kg/m3
* Guitarra: 3kg / 0,03 m3 = 100kg/m3
* Geladeira: 40kg / 1 m3 = 40kg/m3

##### Exemplos

produto: Câmera\
distância: 1000 (fixo)\
volume: 0,003\
densidade: 333\
preço: R$9,90 (1000 * 0,003 * (333/100))\
preço mínimo: R$10,00

produto: Guitarra\
distância: 1000 (fixo)\
volume: 0,03\
densidade: 100\
preço: R$30,00 (1000 * 0,03 * (100/100))

produto: Geladeira\
distância: 1000 (fixo)\
volume: 1\
densidade: 40\
preço: R$400,00 (1000 * 1 * (40/100))
