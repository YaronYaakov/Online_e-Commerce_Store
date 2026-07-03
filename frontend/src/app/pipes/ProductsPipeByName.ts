import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/Product';

@Pipe({
  name: 'byProductNamePipe',
  standalone: true
})
export class ProductsPipeByName implements PipeTransform {

  transform(products: Product[], productName: string): Product[] {
    if (!products || !productName) {
      return products;
    }

    return products.filter(product =>
      product.name?.toLowerCase().includes(productName.toLowerCase())
    );
  }
}