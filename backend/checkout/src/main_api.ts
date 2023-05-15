import { Checkout } from './application/use-cases/checkout'
import { GetProducts } from './application/use-cases/get-products'
import { PgAdapter } from './infra/database/pg-adapter'
import { CouponRepositoryDatabase } from './infra/database/repositories/coupon-repository-database'
import { OrderRepositoryDatabase } from './infra/database/repositories/order-repository-database'
import { ProductRepositoryDatabase } from './infra/database/repositories/product-repository-database'
import { CurrencyGatewayHttp } from './infra/gateway/currency-gateway-http'
import { ExpressAdapter } from './infra/http/express-adapter'
import { HttpController } from './infra/http/http-controller'

const httpServer = new ExpressAdapter()
const databaseConnection = new PgAdapter()
const currencyGateway = new CurrencyGatewayHttp()
const productRepository = new ProductRepositoryDatabase(databaseConnection)
const couponRepository = new CouponRepositoryDatabase(databaseConnection)
const orderRepository = new OrderRepositoryDatabase(databaseConnection)
const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository)
const getProducts = new GetProducts(productRepository)
new HttpController(httpServer, checkout, getProducts)
httpServer.listen(3000)
