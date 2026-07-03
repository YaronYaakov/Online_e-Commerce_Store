import { Component, OnInit, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { of } from "rxjs";

// Services & Models
import { UsersService } from '../../services/users.service';
import { CartItemsService } from '../../services/cartItems.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { SuccessfulAddedCartDetails } from '../../models/SuccessfulAddedCartDetails';
import { MyDialogComponent } from '../modal/modal.component';
import { Check } from '../../models/Check';
import { Product } from '../../models/Product';
import { ProductsCheckPipeByName } from '../../pipes/ProductsCheckPipeByName';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ProductsCheckPipeByName
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload!: ElementRef;

  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  public readonly usersService = inject(UsersService);
  public readonly cartItemsService = inject(CartItemsService);
  public readonly shoppingCartsService = inject(ShoppingCartService);
  public readonly ordersService = inject(OrdersService);
  public readonly productsService = inject(ProductsService);
  public readonly categoriesService = inject(CategoriesService);

  public files = signal<any[]>([]);
  public uploadedImageName = signal<any>(null);

  public adminFormGroup!: FormGroup;
  public productName!: FormControl;
  public productPrice!: FormControl;
  public productCategory!: FormControl;

  ngOnInit(): void {
    this.initVariables();
    this.checkUserType();
  }

  public initVariables(): void {
    this.ordersService.isCheckSearchShown.set(false);
    this.productsService.product.set(new Product());
    this.productsService.state.set("adding");
    this.files.set([]);
  }

  public checkUserType(): void {
    const userData = JSON.parse(sessionStorage.getItem("storedUserData") || '{}');
    if (userData.user_type === 'CUSTOMER') {
      this.shoppingCartsService.isCustomer.set(true);
      this.shoppingCartsService.isShown.set(true);
      this.checkCartState(userData.is_checked_out);
    } else {
      this.shoppingCartsService.isShown.set(false);
      this.shoppingCartsService.isCustomer.set(false);
      this.formControlInit();
      this.formGroupInit();
    }
  }

  public checkCartState(is_checked_out: number): void {
    if (is_checked_out === 0) {
      this.getAllCartItems();
    } else {
      this.createShoppingCart();
    }
  }

  public getAllCartItems(): void {
    if (this.cartItemsService.cartItems().length === 0) {
      this.cartItemsService.getMyCartItems().subscribe({
        error: (serverErrorResponse) => this.showErrorMessage(true, serverErrorResponse.error.error, 'Error', false, null)
      });
    }
  }

  public createShoppingCart(): void {
    this.shoppingCartsService.createShoppingCart().subscribe({
      next: (successfulAddedCartDetails) => {
        this.ordersService.caughtOrders.set([]);
        this.updateUserData(successfulAddedCartDetails);
      },
      error: (serverErrorResponse) => this.showErrorMessage(true, serverErrorResponse.error.error, 'Error', false, null)
    });
  }

  public onDeleteAllCartItemsClick(): void {
    if (this.cartItemsService.sum() > 0) {
      this.cartItemsService.deleteAllCartItems().subscribe({
        error: (serverErrorResponse) => this.showErrorMessage(true, serverErrorResponse.error.error, 'Error', false, null)
      });
    } else {
      this.showErrorMessage(false, "There are no products in your cart to remove!", 'Error', false, null);
    }
  }

  public onDeleteCartItemClick(product_id: number): void {
    this.cartItemsService.deleteCartItem(product_id).subscribe({
      error: (serverErrorResponse) => this.showErrorMessage(true, serverErrorResponse.error.error, 'Error', false, null)
    });
  }

  public onOrderClick(): void {
    if (this.cartItemsService.sum() > 0) {
      this.shoppingCartsService.isShown.set(false);
      this.ordersService.isCheckSearchShown.set(true);
      this.router.navigate(["/buying/order"]);
    } else {
      this.showErrorMessage(false, "Your cart is empty, please choose some products!", 'Error', false, null);
    }
  }

  public updateUserData(successfulAddedCartDetails: SuccessfulAddedCartDetails): void {
    const userData = JSON.parse(sessionStorage.getItem("storedUserData") || '{}');
    userData.is_checked_out = successfulAddedCartDetails.is_checked_out;
    userData.cart_date = successfulAddedCartDetails.cart_date;
    userData.total_price = successfulAddedCartDetails.total_price;
    userData.order_date = successfulAddedCartDetails.order_date;
    sessionStorage.setItem("storedUserData", JSON.stringify(userData));
  }

  public showErrorMessage(isError: boolean, content: string, title: string, isShown: boolean, check: Check | null): void {
    this.dialog.open(MyDialogComponent, { data: { isError, content, isShown, check, title } });
  }

  public formControlInit(): void {
    const productNameRegex = /^[a-zA-Z\s0-9א-ת]+$/; 
    const priceRegex = /^(?!$)(?!0+$)\d{0,3}(?:\.\d{1,2})?$/;
    this.productPrice = new FormControl("", [Validators.required, Validators.pattern(priceRegex)]);
    this.productName = new FormControl("", [Validators.required, Validators.pattern(productNameRegex)]);
    this.productCategory = new FormControl("", [Validators.required]);
  }

  public formGroupInit(): void {
    this.adminFormGroup = new FormGroup({
      productPrice: this.productPrice,
      productName: this.productName,
      productCategory: this.productCategory
    });
  }

  public onEditProductSelect(selectedProduct: Product): void {
    this.productsService.state.set("editing");
    this.productsService.product.set(selectedProduct);
    this.uploadedImageName.set(selectedProduct.picture);
    
    this.adminFormGroup.patchValue({
      productName: selectedProduct.name,
      productPrice: selectedProduct.price,
      productCategory: selectedProduct.category_id
    });
  }

  public addNewProduct(): void {
    const newProduct = new Product();
    newProduct.name = this.productName.value;
    newProduct.price = this.productPrice.value;
    newProduct.picture = this.uploadedImageName();
    newProduct.category_id = this.productCategory.value;

    this.productsService.addProduct(newProduct).subscribe({
      next: (products) => { 
        this.productsService.products.set(products);
        this.resetAdminForm();
      },
      error: (serverErrorResponse) => this.showErrorMessage(true, serverErrorResponse.error.error, 'Error', false, null)
    });
  }

  public onAddNewProductClick(): void {
    this.resetAdminForm();
  }

  public updateExistingProduct(): void {
    const productToUpdate = new Product();
    productToUpdate.id = this.productsService.product().id;
    productToUpdate.name = this.productName.value;
    productToUpdate.price = this.productPrice.value;
    productToUpdate.category_id = this.productCategory.value;
    productToUpdate.picture = this.uploadedImageName() || this.productsService.product().picture;
    this.productsService.updateProduct(productToUpdate).subscribe({
      next: () => {
        this.productsService.products.update(currentProducts =>
          currentProducts.map(p => p.id === productToUpdate.id ? productToUpdate : p)
        );
        this.resetAdminForm();
      },
      error: (serverErrorResponse) => this.showErrorMessage(true, serverErrorResponse.error.error, 'Error', false, null)
    });
  }

  public onUploadImageClick(): void {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      if (!fileUpload.files || fileUpload.files.length === 0) return;
      
      const newFiles: any[] = [];
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        newFiles.push({ name: file.name, data: file, inProgress: false, progress: 0 });
      }
      this.files.set(newFiles);
      this.uploadFiles();
    };
    fileUpload.click();
  }

  public uploadFiles(): void {
    this.files().forEach((file) => { this.uploadFile(file); });
    this.fileUpload.nativeElement.value = "";
  }

  public uploadFile(file: any): void {
    const formData = new FormData();
    formData.append("file", file.data);
    file.inProgress = true;

    this.productsService.uploadImage(formData).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          file.progress = Math.round((event.loaded * 100) / event.total);
        } else if (event.type === HttpEventType.Response) {
          return event;
        }
        return null;
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed.`);
      })
    ).subscribe((event: any) => {
      if (event && typeof event === "object" && event.body) {
        file.inProgress = false;
        
        let imageName = event.body;
        if (typeof event.body === 'object') {
          imageName = event.body.filename || event.body.imageName || event.body.text;
        }
        
        this.uploadedImageName.set(imageName);
        this.productsService.product.update(current => ({ ...current, picture: imageName }));
      }
    });
  }

  public onSaveClick(): void {
    if (this.productsService.state() === "adding") {
      this.addNewProduct();
    } else if (this.productsService.state() === "editing") {
      this.updateExistingProduct();
    }
  }

  private resetAdminForm(): void {
    this.adminFormGroup.reset();
    this.uploadedImageName.set(null);
    this.files.set([]);
    this.productsService.product.set(new Product());
    this.productsService.state.set("adding");
  }
}