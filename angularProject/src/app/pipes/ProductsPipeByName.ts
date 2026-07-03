import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/Product';

@Pipe({
    name: 'byProductNamePipe'
})

//Filter products by product name.
//Implementaion of PipeTransfom Interface
export class ProductsPipeByName implements PipeTransform {

    // a method that has to be implemented (interface eqauls to a contract)
    transform(products: Product[], productName: string): any {


        return products.filter(product => product.name.includes(productName));
    }
}


