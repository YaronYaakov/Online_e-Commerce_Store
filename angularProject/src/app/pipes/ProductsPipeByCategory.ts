import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/Product';

@Pipe({
    name: 'byCategoryPipe'
})

//Filter products by category.
//Implementaion of PipeTransfom Interface
export class ProductsPipeByCategory implements PipeTransform {

    // a method that has to be implemented (interface eqauls to a contract)
    transform(products: Product[], categoryId: number): any {

        if (categoryId == 0) {
            return products
        }
        else {
            return products.filter(product => product.category_id == categoryId);
        }
    }
}

