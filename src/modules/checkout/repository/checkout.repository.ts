import ID from '../../@shared/domain/value-object/id.value-object';
import ClientModel from '../../client-adm/repository/client.model';
import ProductModel from '../../store-catalog/repository/product.model';
import Client from '../domain/client.entity';
import Order from '../domain/order.entity';
import Product from '../domain/product.entity';
import CheckoutGateway from '../gateway/checkout.gateway';
import OrderModel from './order.model';

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    const orderDB = await OrderModel.create({
      id: order.id.value,
      clientId: order.client.id.value,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });

    const productIDs = order.products.map(({ id }) => id.value);
    await orderDB.$add('products', productIDs);
  }

  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: { id },
      include: [{ model: ProductModel }, { model: ClientModel }],
    });

    if (!order) return undefined;

    return new Order({
      id: new ID(order.id),
      client: new Client({
        id: new ID(order.clientId),
        name: order.client.name,
        document: order.client.document,
        street: order.client.street,
        number: order.client.number,
        complement: order.client.complement,
        city: order.client.city,
        state: order.client.state,
        zipCode: order.client.zipCode,
      }),
      products: order.products.map(product => {
        return new Product({
          id: new ID(product.id),
          name: product.name,
          salesPrice: product.salesPrice,
        });
      }),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }
}
