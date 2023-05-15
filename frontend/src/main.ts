import { createApp } from 'vue'
import App from './App.vue'
import { CheckoutGatewayHttp } from './gateways/checkout-gateway-http'
import { AxiosAdapter } from './infra/http/axios-adapter'
import './style.css'

const app = createApp(App)
const httpClient = new AxiosAdapter()
const checkoutGateway = new CheckoutGatewayHttp(httpClient, 'http://localhost:3000')
app.provide('checkoutGateway', checkoutGateway)
app.mount('#app')
