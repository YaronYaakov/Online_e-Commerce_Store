import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { CartItemsService } from '../../services/cartItems.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Product } from '../../models/Product';
import { CartItem } from '../../models/CartItem';
import { MyDialogComponent } from '../modal/modal.component';
import { Check } from '../../models/Check';
import { FormsModule } from '@angular/forms';
import { ProductsPipeByCategory } from '../../pipes/ProductsPipeByCategory';
import { ProductsPipeByName } from '../../pipes/ProductsPipeByName';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, ProductsPipeByCategory, ProductsPipeByName],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  private dialog = inject(MatDialog);
  public productsService = inject(ProductsService);
  public categoriesService = inject(CategoriesService);
  private cartItemsService = inject(CartItemsService);
  public shoppingCartService = inject(ShoppingCartService);

  public categoryId = signal<number>(0);
  public productName = signal<string>("");

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
  }

  public onAddToCartClick(product: Product): void {
    if (this.shoppingCartService.isCustomer()) {
      this.addToCart(product);
    } else {
      this.productsService.product.set(new Product(product.id, product.name, product.price, product.category_id, product.picture));
      this.productsService.state.set("editing");
    }
  }

  public addToCart(product: Product): void {
    if ((product.amount ?? 0) <= 0) {
      this.showErrorMessage(true, "Please select some products!", 'Error', false, null);
      return;
    }

    const amount = product.amount ?? 0;
    const price = product.price ?? 0;

    const cartItem = new CartItem(product.id, amount, product.name, product.picture, price, price * amount);
    const cartItemToServer = new CartItem(product.id, product.amount);

    this.cartItemsService.addCartItem(cartItemToServer).subscribe({
      next: () => {
        this.checkIfCartItemExist(cartItem);
        
        this.productsService.products.update(products => 
          products.map(p => p.id === product.id ? { ...p, amount: 0 } : p)
        );
      },
      error: (err) => this.showErrorMessage(true, err.error.error, 'Error', false, null)
    });
  }

  public checkIfCartItemExist(cartItem: CartItem): void {
    this.cartItemsService.cartItems.update(items => {
      const foundItemIndex = items.findIndex(item => item.name === cartItem.name);

      if (foundItemIndex !== -1) {
        const updatedItems = [...items];
        const foundItem = { ...updatedItems[foundItemIndex] };

        foundItem.quantity = (foundItem.quantity ?? 0) + (cartItem.quantity ?? 0);
        foundItem.total_price = (foundItem.total_price ?? 0) + (cartItem.total_price ?? 0);

        updatedItems[foundItemIndex] = foundItem;
        return updatedItems;
      } else {
        return [...items, cartItem];
      }
    });
  }

  public getAllProducts(): void {
    if (this.productsService.products().length === 0) {
      this.productsService.getAllProducts().subscribe({
        next: (products) => {
          this.productsService.products.set(products.map(p => ({ ...p, amount: 0 })));
        },
        error: (err) => this.showErrorMessage(true, err.error.error, 'Error', false, null)
      });
    }
  }

  public getAllCategories(): void {
    if (this.categoriesService.categories().length === 0) {
      this.categoriesService.getAllCategories().subscribe({
        error: (err) => this.showErrorMessage(true, err.error.error, 'Error', false, null)
      });
    }
  }

  public onSubstrctAmountClick(product: Product): void {
    if ((product.amount ?? 0) > 0) {
      this.productsService.products.update(products =>
        products.map(p => p.id === product.id ? { ...p, amount: (p.amount ?? 0) - 1 } : p)
      );
    }
  }

  public onAddAmountClick(product: Product): void {
    this.productsService.products.update(products =>
      products.map(p => p.id === product.id ? { ...p, amount: (p.amount ?? 0) + 1 } : p)
    );
  }

  public onCategoryClick(category_id: number): void {
    this.categoryId.set(category_id);
  }

  private showErrorMessage(isError: boolean, content: string, title: string, isShown: boolean, check: Check | null): void {
    this.dialog.open(MyDialogComponent, {
      data: { isError, content, isShown, check, title }
    });
  }
}