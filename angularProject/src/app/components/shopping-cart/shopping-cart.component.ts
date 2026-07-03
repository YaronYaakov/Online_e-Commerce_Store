import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/Users.service';
import { CartItemsService } from 'src/app/services/cartItems.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductsService } from 'src/app/services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessfulAddedCartDetails } from 'src/app/models/SuccessfulAddedCartDetails';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { Check } from 'src/app/models/Check';
import { CategoriesService } from 'src/app/services/categories.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from 'src/app/models/Product';
import { HttpEventType, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { of } from "rxjs";




@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  @ViewChild("fileUpload", { static: false })
  fileUpload: ElementRef;

  public adminFormGroup: FormGroup;
  public productName: FormControl;
  public productPrice: FormControl;
  public productCategory: FormControl;
  public files: any[];
  public uploadedImageName: any;

  //Injecting Services(Dependency Injection - DESGIN PATTERN)
  constructor(private dialog: MatDialog, public categoriesService: CategoriesService, private router: Router, public cartItemsService: CartItemsService, public shoppingCartsService: ShoppingCartService, private usersService: UsersService, public ordersService: OrdersService, public productsService: ProductsService) { }

  //a callback in LIFE CYCLE HOOKS of the component where we initilze
  ngOnInit(): void {
    this.initVariables();
    this.checkUserType();
  }



  //initalizes class variables
  public initVariables() {
    this.ordersService.isCheckSearchShown = false;
    this.productsService.product = new Product();
    this.productsService.state = "adding"
    this.files = [];
  }


  //checks user type
  public checkUserType(): void {
    let userData = JSON.parse(sessionStorage.getItem("storedUserData"))

    if (userData.userType == 'CUSTOMER') {
      this.shoppingCartsService.isCustomer = true;
      this.shoppingCartsService.isShown = true;
      this.checkCartState(userData.isCheckedOut)
    }

    else {
      this.shoppingCartsService.isShown = false;
      this.shoppingCartsService.isCustomer = false;
      this.formControlInit();
      this.formGroupInit();
    }
  }


  //checks user cart state
  public checkCartState(isCheckedOut: number): void {
    if (isCheckedOut == 0) {
      this.retrieveAllMyProducts()
    }
    else {
      this.createShoppingCart()
    }
  }



  //gets all user's products
  public retrieveAllMyProducts(): void {
    console.log(this.cartItemsService.cartItems)
    if (this.cartItemsService.cartItems.length == 0 || this.cartItemsService.cartItems == null) {

      const observable = this.cartItemsService.getMyProducts()
      observable.subscribe((cartItems) => {
        this.usersService.buttonValue = "resume shopping"
        this.cartItemsService.cartItems = cartItems;
        console.log(`your sum${this.cartItemsService.sum}`)
        this.cartItemsService.sumCartItems()
        this.cartItemsService.updateUserDataTotalPrice()
        this.shoppingCartsService.setIsCartEmpty()

        console.log(this.cartItemsService.cartItems)

      }
        , serverErrorResponse => { // Reaching here means that the server had failed
          // serverErrorResponse is the object returned from the ExceptionsHandler
          this.showErrorMessage(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)

        });
    }
  }


  //creates a new shopping cart
  public createShoppingCart(): void {

    this.cartItemsService.cartItems = []
    const observable = this.shoppingCartsService.createShoppingCart()

    observable.subscribe((successfulAddedCartDetails) => {
      this.ordersService.caughtOrders = [];
      this.usersService.buttonValue = "resume shopping"
      this.cartItemsService.sum = 0;
      this.updateUserData(successfulAddedCartDetails);
      this.shoppingCartsService.setIsCartEmpty()

    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.showErrorMessage(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)

      });
  }


  //callback where we delete all cart items
  public onDeleteAllCartItemsClicked(): void {

    if (this.cartItemsService.sum > 0) {
      const observable = this.cartItemsService.deleteAllCartItems()
      observable.subscribe(() => {

        this.cartItemsService.sum = 0;
        this.cartItemsService.cartItems = []
        this.cartItemsService.updateUserDataTotalPrice();
        this.shoppingCartsService.setIsCartEmpty()

        console.log(this.cartItemsService.cartItems)
        console.log(`your sum ${this.cartItemsService.sum}`)
      }
        , serverErrorResponse => { // Reaching here means that the server had failed
          // serverErrorResponse is the object returned from the ExceptionsHandler
          this.showErrorMessage(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)

        });
    }
    else {
      this.showErrorMessage(false, "There are no products in your cart to remove!", 'WARNING!', false, null)
    }
  }


  //callback where we delete a cart item
  public onDeleteCartItemClicked(productId: number): void {

    const observable = this.cartItemsService.deleteCartItem(productId)
    observable.subscribe(() => {

      this.cartItemsService.cartItems = this.cartItemsService.cartItems.filter(cartItem => cartItem.productId != productId);
      this.cartItemsService.sumCartItems();
      this.cartItemsService.updateUserDataTotalPrice()
      this.shoppingCartsService.setIsCartEmpty()

      console.log(this.cartItemsService.cartItems)
      console.log(`your sum ${this.cartItemsService.sum}`)

    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.showErrorMessage(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)

      });
  }


  //callback where we go to Order component
  public onOrderClicked(): void {
    if (this.cartItemsService.sum > 0) {

      this.shoppingCartsService.isShown = false;
      this.ordersService.isCheckSearchShown = true;
      this.router.navigate(["/buying/order"]);
    }
    else {
      this.showErrorMessage(false, "Your cart is empty, please choose some products!", 'WARNING!', false, null)
    }
  }



  //updates session storage(cache)
  public updateUserData(successfulAddedCartDetails: SuccessfulAddedCartDetails): void {
    let userData = JSON.parse(sessionStorage.getItem("storedUserData"))
    console.log(successfulAddedCartDetails)

    userData.isCheckedOut = successfulAddedCartDetails.isCheckedOut
    userData.cartDate = successfulAddedCartDetails.cartDate
    userData.totalPrice = successfulAddedCartDetails.totalPrice
    userData.orderDate = successfulAddedCartDetails.orderDate
    sessionStorage.setItem("storedUserData", JSON.stringify(userData))
  }


  //shows modal
  public showErrorMessage(isError: boolean, content: string, title: string, isShown: boolean, check: Check): void {
    this.dialog.open(MyDialogComponent, {
      data: { isError: isError, content: content, isShown: isShown, check: check, title: title }
    })
  }


  //ALL ADMIN FUNCTIONS




  //initializes form controls
  public formControlInit(): void {

    let productNameRegex = /^[a-zA-Z\s0-9]+$/;
    let priceRegex = /^(?!$)(?!0+$)\d{0,3}(?:\.(?!={1,2}$)\d{1,2})?$/;

    // Initializing form controls with validators
    this.productPrice = new FormControl("", [Validators.required, Validators.pattern(priceRegex)]);
    this.productName = new FormControl("", [Validators.required, Validators.pattern(productNameRegex)]);
    this.productCategory = new FormControl("", [Validators.required]);

  }


  //initializes form group
  public formGroupInit(): void {
    // Initializing the from groups
    this.adminFormGroup = new FormGroup({
      productPrice: this.productPrice,
      productName: this.productName,
      productCategory: this.productCategory
    });
  }



//adds new product
  public addNewProduct(): void {
    // this.productName.value, this.productPrice.value, this.productCategory.value, this.productImage.value
    let newProduct = new Product();
    newProduct.name = this.productName.value;
    newProduct.price = this.productPrice.value;
    newProduct.picture = this.uploadedImageName;
    newProduct.category_id = this.productCategory.value;

    const observable = this.productsService.addProduct(newProduct)

    observable.subscribe((allProducts) => {
      this.productsService.products = allProducts;
      console.log(this.productsService.products)
    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.showErrorMessage(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)
      });
  }





//callback where we add new product
  public onAddNewProductClicked(): void {
    this.adminFormGroup.reset()
    this.productsService.state = "adding";
    this.productsService.product = new Product();
    console.log(this.productsService.product)
  }



//updates existing product
  public updateExistingProduct(): void {

    console.log(this.productsService.product)
    const observable = this.productsService.updateProduct(this.productsService.product)

    observable.subscribe(() => {

      this.productsService.products.forEach((product, index) => {
        if (product.product_id == this.productsService.product.product_id) {
          console.log("here")
          this.productsService.products[index].name = this.productsService.product.name;
          this.productsService.products[index].price = this.productsService.product.price;
          this.productsService.products[index].category_id = this.productsService.product.category_id;
          this.productsService.products[index].picture = this.productsService.product.picture

        }
      })
      console.log(this.productsService.products)
    }
      , serverErrorResponse => { // Reaching here means that the server had failed
        // serverErrorResponse is the object returned from the ExceptionsHandler
        this.showErrorMessage(true, serverErrorResponse.error.error, 'Error has occurred!', false, null)
      });
  }



//callback where we upload an image
  public onUploadImageClicked(): void {
    // Clearing the files from previous upload
    console.log("here")
    // Extracting a reference to the DOM element named #fileUpload
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        console.log("Uploaded file :" + file);
        this.files.push({
          name: file.name,
          data: file,
          inProgress: false,
          progress: 0,
        });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }



//uploads files
  public uploadFiles(): void {
    this.fileUpload.nativeElement.value = "";

    this.files.forEach((file) => {
      this.uploadFile(file);
    });
  }


//uploads a file
  public uploadFile(file): any {
    const formData = new FormData();
    formData.append("file", file.data);
    file.inProgress = true;
    let observable = this.productsService.uploadImage(formData);

    // Updating the view's precentage, based on the size of the current
    // uploaded block
    observable.pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round((event.loaded * 100) / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed.`);
      })
    );

    observable.subscribe((event: any) => {
      if (typeof event === "object" && event.body) {
        console.log(event)
        console.log(event.body)
        this.uploadedImageName = event.body;
        this.productsService.product.picture = event.body;
      }
    });
  }


//callback where we save the changes
  public onSaveClicked() {

    console.log(this.productsService.state);
    if (this.productsService.state === "adding") {
      this.addNewProduct();
    } else if (this.productsService.state === "editing") {
      this.updateExistingProduct();
    }
  }
}

