import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.component.html',
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [{
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 1,
    id: 1,
  },
  {
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 3,
    id: 2,
  }]};
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ]
  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onCleartCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckout(): void {
    this.http.post('http://loclahost:4242/che ckout', {
      items: this.cart.items
    }).subscribe(async(res: any) => {
      let stripe = await loadStripe('pk_test_51NX2GmCWFz2aspdrXsWd13efuTyI9AvF5wjYkeHGSStfDtCbWAsRZB3IwZEfTdOQvMyEtPFfTRUb85xHgdzKmPfh006CpIY1LF');
      stripe?.redirectToCheckout({
        sessionId: res.id
      });
    })
  }
}


