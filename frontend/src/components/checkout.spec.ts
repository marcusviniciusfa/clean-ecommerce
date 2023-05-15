import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Order } from '../entities/order';
import { Product } from '../entities/product';
import { CheckoutGateway, CheckoutOutput } from '../gateways/checkout-gateway';
import Checkout from './Checkout.vue';

function sleep(time: number) {
  return new Promise(resolve => {
    return setTimeout(() => resolve(true), time)
  })
}

describe('', () => {
  it('deve testar a tela de checkout', async () => {
    const checkoutGateway: CheckoutGateway = {
      getProducts: async (): Promise<Array<Product>> => {
        return Promise.resolve([
          new Product('1', 'a', 5000),
          new Product('2', 'b', 1000),
          new Product('3', 'c', 30)
        ]);
      },

      checkout: async (_order: Order): Promise<CheckoutOutput> => {
        return Promise.resolve({
          total: 6090,
          freight: 280
        })
      }
    }

    const wrapper = mount(Checkout, {
      global: {
        provide: {
          checkoutGateway
        }
      }
    })

    await sleep(200)
    expect(wrapper.get('.title-name').text()).toBe('Checkout')

    // buscar products
    expect(wrapper.findAll('.product')).toHaveLength(3)

    expect(wrapper.findAll('.product-description').at(0)?.text()).toBe('a')
    expect(wrapper.findAll('.product-price').at(0)?.text()).toBe('R$ 5.000,00')

    expect(wrapper.findAll('.product-description').at(1)?.text()).toBe('b')
    expect(wrapper.findAll('.product-price').at(1)?.text()).toBe('R$ 1.000,00')

    expect(wrapper.findAll('.product-description').at(2)?.text()).toBe('c')
    expect(wrapper.findAll('.product-price').at(2)?.text()).toBe('R$ 30,00')

    // adicionar product
    await wrapper.findAll('.product-add').at(0)?.trigger('click')
    await wrapper.findAll('.product-add').at(1)?.trigger('click')
    await wrapper.findAll('.product-add').at(2)?.trigger('click')
    await wrapper.findAll('.product-add').at(2)?.trigger('click')
    await wrapper.findAll('.product-add').at(2)?.trigger('click')
    await wrapper.findAll('.product-add').at(2)?.trigger('click')
    await wrapper.findAll('.product-remove').at(2)?.trigger('click')
    expect(wrapper.get('.total')?.text()).toBe('R$ 6.090,00')

    // adicionar item na order
    expect(wrapper.findAll('.order-item')).toHaveLength(3)
    expect(wrapper.findAll('.order-item').at(0)?.text()).toBe('1 1')
    expect(wrapper.findAll('.order-item').at(1)?.text()).toBe('2 1')
    expect(wrapper.findAll('.order-item').at(2)?.text()).toBe('3 3')

    // fazer checkout
    await wrapper.get('.checkout').trigger('click')
    await sleep(200)
    expect(wrapper.get('.output-total').text()).toBe('6090')
    expect(wrapper.get('.output-freight').text()).toBe('280')
  })
})
