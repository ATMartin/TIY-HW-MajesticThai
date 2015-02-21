
var MenuItemView = Backbone.View.extend({
  currentQty: 0,
  template: _.template($('[data-template="menu-item"]').text()),
  initialize: function(opts) {
    this.orderCollection = opts.orderCollection;;
    this.listenTo(this, "change:currentQty", this.render);
    this.listenTo(App.vent, 'reset', this.reset);
  },
  events: {
    'click .add' : 'addToOrder',
    'click .remove' : 'removeFromOrder',
  },
  addToOrder: function() {
    this.currentQty += 1;
    this.trigger('change:currentQty');
    App.currentOrder.attributes.items.push(this.model.get('title')); 
    App.currentOrder.incrementPrice(+this.model.get('price'));
  },
  removeFromOrder: function() {
    if (this.currentQty === 0) { console.log("No items remaining!"); return; }
    this.currentQty -= 1;
    this.trigger('change:currentQty');
  
    var items = App.currentOrder.get('items');
    var index = items.indexOf(this.model.get('title'));
    items.splice(index, 1);
    App.currentOrder.set('items', items);
    
    App.currentOrder.incrementPrice(+this.model.get('price'), true);
    //App.currentOrder.setPrice("20.00"); 
    //App.currentOrder.set('totalPrice',  +App.currentOrder.get('totalPrice') - +this.model.get('price'));
  },
  reset: function() {
    this.currentQty = 0;
    this.render();  
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
    this.listenTo(App.vent, 'reset', this.reset);
  },
  events: {
    'click .place-order' : 'submitOrder'
  },
  submitOrder: function() {
    var items = App.currentOrder.get('items');
    if (items.length === 0) { console.log("No items to order!"); return; }
    var itemsObj = _.countBy(items, function(item) {
        return item;
    });
    App.currentOrder.set('items', itemsObj);
    this.ordersCollection.create(App.currentOrder);
    App.vent.trigger('reset');
    //delete App.currentOrder;
    //App.currentOrder = new Order();
  },
  reset: function() {
    this.stopListening(App.currentOrder);
    delete App.currentOrder;
    App.currentOrder = new Order();
    this.listenTo(App.currentOrder, 'change:totalPrice', this.render);
    this.render();
  },
  render: function() {
    var totalPrice = App.currentOrder.get('totalPrice');
    this.$el.empty();
    this.$el.append(this.template({total: totalPrice}));
    return this;
  }
});

$(document).ready(function() {
window.App = window.App || {};
App.vent = App.vent || _.extend({}, Backbone.Events);

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

