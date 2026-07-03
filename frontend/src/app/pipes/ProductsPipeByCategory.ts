import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/Product';

@Pipe({
  name: 'byCategoryPipe',
  standalone: true
})
export class ProductsPipeByCategory implements PipeTransform {

  transform(products: Product[], categoryId: number): Product[] {
    if (categoryId === 0) {
      return products;
    }
    
    return products.filter(product => product.category_id === categoryId);
  }
}