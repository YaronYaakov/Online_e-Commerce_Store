import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/Users.service';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/Product';
import { CategoriesService } from 'src/app/services/categories.service';
import { CartItem } from 'src/app/models/CartItem';
import { CartItemsService } from 'src/app/services/cartItems.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { Check } from 'src/app/models/Check';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public categoryId: number;
  public productName: string;

  //Injecting Services(Dependency Injection - DESGIN PATTERN)
  constructor(private dialog: MatDialog, public productsService: ProductsService, public categoriesService: CategoriesService, private cartItemsService: CartItemsService, public shoppingCartService: ShoppingCartService) { }


  //a callback in LIFE CYCLE HOOKS of the component where we initilze
  ngOnInit(): void {

    this.initVariables()
    this.retrieveAllProducts()
    this.retrieveAllCategories()
  }

//initializes class variables
  public initVariables(): void {
    this.categoryId = 0;
    this.productName = "";
    this.shoppingCartService.productName = "";
    this.productChosenAmountInit()
  }


//callback where we add product to cart
  public onAddToCartClicked(product: Product): void {
    if (this.shoppingCartService.isCustomer) {
      this.addToCart(product);
    }

    else {
      this.productsService.product = new Product(product.product_id, product.name, product.price, product.category_id, product.picture)
      console.log(this.productsService.product)
      this.productsService.state = "editing";
    }
  }


//adds product to cart
  public addToCart(product: Product): void {
    let cartItem = new CartItem(product.product_id, product.amount, product.name, product.picture, product.price, product.price * product.amount)
    let cartItemToServer = new CartItem(product.product_id, product.amount)

    if (product.amount > 0) {

      const observable = this.cartItemsService.addCartItem(cartItemToServer)
      observable.subscribe(() => {
        this.checkIfCartItemExist(cartItem)
        this.cartItemsService.cartItems.push(cartItem)
        this.cartItemsService.sumCartItems()
        this.cartItemsService.updateUserDataTotalPrice()
        this.shoppingCartService.setIsCartEmpty()

        console.log(this.cartItemsService.cartItems)
        console.log(`cart sum ${this.cartItemsService.sum}`)
      }
        , serverErrorResponse => { // Reaching here means that the server had failed
          // serverErrorResponse is the object returned from the ExceptionsHandler
          this.showErrorMessage(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)

        });
    }
    else {
      this.showErrorMessage(false, "Please select some products to your cart!", 'WARNING!', false, null)
    }
  }



//checks if the product already exists in cart
  public checkIfCartItemExist(cartItem: CartItem): void {

    for (let item of this.cartItemsService.cartItems) {
      if (item.name == cartItem.name) {
        cartItem.quantity += item.quantity;
        cartItem.total_price += +item.total_price;

        this.cartItemsService.cartItems = this.cartItemsService.cartItems.filter(cartItem => cartItem.name != item.name);

        return;
      }
    }
  }


//retrieves all products
  public retrieveAllProducts(): void {
    if (this.productsService.products.length == 0 || this.productsService.products == null) {
      const observable = this.productsService.getAllProducts()

      observable.subscribe((allProducts) => {

        this.productsService.products = allProducts;
        console.log(this.productsService.products)
        this.productChosenAmountInit()

      }
        , serverErrorResponse => { // Reaching here means that the server had failed
          // serverErrorResponse is the object returned from the ExceptionsHandler
          this.showErrorMessage(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)

        });
    }
  }

//callback where we substract amount of products
  public onSubstrctAmountClicked(product: Product): void {
    if (product.amount > 0) {
      product.amount--;
    }
  }

//callback where we add amount of products
  public onAddAmountClicked(product: Product): void {
    product.amount++;
  }

//gets all categories
  public retrieveAllCategories(): void {
    if (this.categoriesService.categories.length == 0 || this.categoriesService.categories == null) {
      const observable = this.categoriesService.getAllCategories()

      observable.subscribe((categories) => {
        this.categoriesService.categories = categories
        console.log(this.categoriesService.categories)
      }
        , serverErrorResponse => { // Reaching here means that the server had failed
          // serverErrorResponse is the object returned from the ExceptionsHandler
          this.showErrorMessage(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)
        });
    }
  }

//callback where choose a category
  public onClickCategory(category_id: number): void {
    this.categoryId = category_id;
  }

//initailizes of product's chosen amount
  public productChosenAmountInit(): void {
    for (let product of this.productsService.products) {
      product.amount = 0;
    }
  }

  //shows modal 
  public showErrorMessage(isError: boolean, content: string, title: string, isShown: boolean, check: Check): void {
    this.dialog.open(MyDialogComponent, {
      data: { isError: isError, content: content, isShown: isShown, check: check, title: title }
    })
  }
}


