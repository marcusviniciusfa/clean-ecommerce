<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { Order } from '../entities/order';
import { Product } from '../entities/product';
import { CheckoutOutput } from '../gateways/checkout-gateway';
import { CheckoutGatewayHttp } from '../gateways/checkout-gateway-http';

// ref torna a variável reativa, logo ele observa o estado e atualiza a variável quando existe uma atualização
const products = ref<Array<Product>>([])
const order = ref<Order>(new Order('987.654.321-00'))
const output = ref<CheckoutOutput>({ total: 0, freight: 0 })
const checkoutGateway = inject('checkoutGateway') as CheckoutGatewayHttp

function formatMoney(value: number) {
  return new Intl.NumberFormat('pt-br', { currency: 'BRL', style: 'currency'}).format(value).replace(/\s/, ' ')
}

async function checkout(order: Order) {
  output.value = await checkoutGateway.checkout(order)
}

// onMonted realiza alguma coisa quando o componente é montado
onMounted(async () => {
  products.value = await checkoutGateway.getProducts()
})
</script>

<template>
  <div>
    <div class="title-name">Checkout</div>
    <div class="product" v-for="product in products">
      <div class="product-description">{{ product.description }}</div>
      <div class="product-price">{{ formatMoney(product.price) }}</div>
      <button class="product-add" @click="order.addItem(product)">Add</button>
      <button class="product-remove" @click="order.removeItem(product)">Remove</button>
    </div>
    <div>
      <div class="total">{{ formatMoney(order.total) }}</div>
      <div class="order-item" v-for="item in order.items">
        {{ item.id }} {{ item.getQuantity() }}
      </div>
      <button class="checkout" @click="checkout(order)">Checkout</button>
      <div class="output-total">{{ output.total }}</div>
      <div class="output-freight">{{ output.freight }}</div>
    </div>
  </div>
</template>

<style scoped></style>
