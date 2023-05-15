import { Checkout } from './application/use-cases/checkout'
import { CouponRepositoryDatabase } from './coupon-repository-database'
import { CliController } from './infra/cli/cli-controller'
import { CliHandlerNode } from './infra/cli/cli-handler-node'
import { PgAdapter } from './infra/database/pg-adapter'
import { OrderRepositoryDatabase } from './infra/database/repositories/order-repository-database'
import { CurrencyGatewayHttp } from './infra/gateway/currency-gateway-http'
import { ProductRepositoryDatabase } from './product-repository-database'

const databaseConnection = new PgAdapter()
const currencyGateway = new CurrencyGatewayHttp()
const productRepository = new ProductRepositoryDatabase(databaseConnection)
const couponRepository = new CouponRepositoryDatabase(databaseConnection)
const orderRepository = new OrderRepositoryDatabase(databaseConnection)
const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository)
const handler = new CliHandlerNode()
new CliController(handler, checkout)
