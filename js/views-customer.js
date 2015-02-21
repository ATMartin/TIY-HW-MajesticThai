
var MenuItemView = Backbone.View.extend({
  currentQty: 0,
  template: _.template($('[data-template="menu-item"]').text()),
  initialize: function(opts) {
    this.orderCollection = opts.orderCollection;
    this.on('change', this.render);
  },
  events: {
    'click .add' : 'addToOrder',
    'click .remove' : 'removeFromOrder',
  },
  addToOrder: function() {
    this.currentQty += 1;
    App.currentOrder.attributes.items.push(this.model.get('title'));
    
    App.currentOrder.incrementPrice(+this.model.get('price'));
    //App.currentOrder.set('totalPrice', +App.currentOrder.get('totalPrice') + +this.model.get('price'));
  },
  removeFromOrder: function() {
    if (this.currentQty === 0) { console.log("No items remaining!"); return; }
    this.currentQty -= 1;
  
    var items = App.currentOrder.get('items');
    console.log(App.currentOrder.get('items'));
    var index = items.indexOf(this.model.get('title'));
    //<-- Silly JS .slice() hack to empty array with length of 1.
    //if (items.length === 1 && index === 0) { index = 1; }     
    items.splice(index, 1);
    App.currentOrder.set('items', items);
    console.log(App.currentOrder.get('items'));
    
    App.currentOrder.incrementPrice(+this.model.get('price'), true);
    //App.currentOrder.setPrice("20.00"); 
    //App.currentOrder.set('totalPrice',  +App.currentOrder.get('totalPrice') - +this.model.get('price'));
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$('.qty').val(this.currentQty);
    return this;
  }
});

var MenuItemsList = Backbone.View.extend({
  initialize: function(opts) {
    this.menuCollection = opts.menuCollection;
  },
  render: function() {
    var self = this;
    this.menuCollection.forEach(function(item) {
        var newModel = new MenuItemView({model: item});
        newModel.render();
        self.$el.append(newModel.el);
    });
    return this;
  }
});

var MenuOrderFooter = Backbone.View.extend({
  template: _.template($('[data-template="footer"]').text()),
  initialize: function(opts) {
    App.currentOrder = App.currentOrder || new Order();
    this.ordersCollection = opts.ordersCollection;
    this.listenTo(App.currentOrder, 'change:totalPrice', this.render);
  },
  events: {
    'click .place-order' : 'submitOrder'
  },
  submitOrder: function() {
    console.log(App.currentOrder);  
    var items = App.currentOrder.get('items');
    var countObj = _.countBy(items, function(item) {
        return item;
    });
    console.log(countObj);
    
    /*
    console.log(App.currentOrder.get('items').countBy(function(item) { return item; }));
    this.ordersCollection.create(App.currentOrder);
    App.currentOrder.remove();
    App.currentOrder = new Order();
    */
  },
  render: function() {
    //var totalPrice = this.ordersCollection.reduce(function(acc, item) {
    //  return acc + item.price;
    //}, 0);
    var totalPrice = App.currentOrder.get('totalPrice');
    this.$el.empty();
    this.$el.append(this.template({total: totalPrice}));
    return this;
  }
});

$(document).ready(function() {
window.App = window.App || {};

var ordersCollection = new Orders();
var menuCollection = new MenuItems();
var menuList = new MenuItemsList({
  el: '.menu-item-list',
  menuCollection: menuCollection,
  ordersCollection: ordersCollection
});
var menuFooter = new MenuOrderFooter({
  el: '#footer',
  ordersCollection: ordersCollection
});

menuCollection.fetch().done(function() {
  menuList.render(); 
});
ordersCollection.fetch().done(function() {
  menuFooter.render();
});
  


});

