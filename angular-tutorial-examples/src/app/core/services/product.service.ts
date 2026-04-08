import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductCategory } from '../models/tutorial.models';

/**
 * ProductService - demonstrates signals, filtering, and derived state
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>([
    { id: 1, name: 'Mechanical Keyboard', price: 149.99, category: 'electronics', inStock: true, rating: 4.5, description: 'Tactile feedback with RGB backlighting.' },
    { id: 2, name: 'Wireless Headphones', price: 199.99, category: 'electronics', inStock: true, rating: 4.7, description: 'Noise-cancelling over-ear headphones.' },
    { id: 3, name: 'Angular T-Shirt', price: 29.99, category: 'clothing', inStock: false, rating: 4.2, description: 'Official Angular developer t-shirt.' },
    { id: 4, name: 'TypeScript Deep Dive', price: 39.99, category: 'books', inStock: true, rating: 4.9, description: 'Comprehensive guide to TypeScript.' },
    { id: 5, name: 'Running Shoes', price: 89.99, category: 'sports', inStock: true, rating: 4.3, description: 'Lightweight road running shoes.' },
    { id: 6, name: 'Ergonomic Mouse', price: 79.99, category: 'electronics', inStock: true, rating: 4.4, description: 'Vertical ergonomic wireless mouse.' },
    { id: 7, name: 'Coffee Blend', price: 19.99, category: 'food', inStock: true, rating: 4.6, description: 'Premium dark roast coffee beans.' },
    { id: 8, name: 'Yoga Mat', price: 49.99, category: 'sports', inStock: false, rating: 4.1, description: 'Non-slip eco-friendly yoga mat.' },
  ]);

  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<ProductCategory | 'all'>('all');
  readonly sortBy = signal<'price-asc' | 'price-desc' | 'rating'>('rating');
  readonly showInStockOnly = signal<boolean>(false);

  readonly products = this._products.asReadonly();

  readonly filteredProducts = computed(() => {
    let result = [...this._products()];
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    const sort = this.sortBy();
    const inStockOnly = this.showInStockOnly();

    if (query) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    switch (sort) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
    }
  });

  readonly totalValue = computed(() =>
    this.filteredProducts().reduce((sum, p) => sum + p.price, 0)
  );

  readonly categories = computed((): Array<ProductCategory | 'all'> => {
    const cats = [...new Set(this._products().map(p => p.category))];
    return ['all', ...cats] as Array<ProductCategory | 'all'>;
  });
}
