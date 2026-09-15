Component({
  properties: {
    show: Boolean,
    items: { type: Array, value: [] },
    totalPrice: { type: String, value: '0.00' },
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },
    onPlus(e) {
      const key = e.currentTarget.dataset.key;
      const items = this.data.items.map(i =>
        i.key === key ? { ...i, quantity: i.quantity + 1 } : i
      );
      this.triggerEvent('update', { cart: items });
    },
    onMinus(e) {
      const key = e.currentTarget.dataset.key;
      let items = this.data.items.map(i =>
        i.key === key ? { ...i, quantity: i.quantity - 1 } : i
      ).filter(i => i.quantity > 0);
      this.triggerEvent('update', { cart: items });
    },
    onClear() {
      this.triggerEvent('update', { cart: [] });
    },
    onCheckout() {
      if (this.data.items.length === 0) return;
      this.triggerEvent('checkout');
    },
  },
});
