
var MenuItemView = Backbone.View.extend({
  template: _.template($('[data-template="menu-item"]').text()),
  initialize: function(opts) {
    this.orderCollection = opts.orderCollection;
  },
  events: {
    'click .add' : 'addToOrder'
  },
  addToOrder: function() {
     
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
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
    this.ordersCollection = opts.ordersCollection;
    this.listenTo(this.ordersCollection, 'add sync destroy', this.render);
  },
  render: function() {
    var totalPrice = this.ordersCollection.reduce(function(acc, item) {
      return acc + item.price;
    }, 0);
    this.$el.append(this.template({total: totalPrice}));
    return this;
  }
});

$(document).ready(function() {

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

