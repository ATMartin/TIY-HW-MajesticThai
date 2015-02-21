
var NewItemView = Backbone.View.extend({
  events: {
    'submit' : 'makeNewItem'
  },
  makeNewItem: function(e) {
    e.preventDefault();
    var title = this.$('.mi-title').val();
    var descrip = this.$('.mi-description').val();
    var price = this.$('.mi-price').val();
    var category = this.$('.mi-category').val();
    this.collection.create({title:title, description:descrip, price:price, category:category});
    this.$('.mi-title').val('');
    this.$('.mi-description').val('');
    this.$('.mi-price').val('');
    this.$('.mi-category').val('');
  }
});

var AllItemsView = Backbone.View.extend({
  template: _.template($('[data-template="menu-item-row"]').text()),
  initialize: function() {
    this.listenTo(this.collection, 'destroy sync add', this.render);  
  }, 
  render: function() {
    var self = this;
    self.$el.empty();
    this.collection.forEach(function(item) {
      self.$el.append(self.template(item.toJSON()));
    });
    return this;
  }
});

var OrderListing = Backbone.View.extend({
  tagName: 'tr',
  template: _.template($('[data-template="order-row"]').text()),  
  events: {
    'click .toggle' : 'toggleDone',
    'click .remove' : 'removeOrder'  
  },
  toggleDone: function() {
    var state = this.model.get('completed') ? false : true;
    this.model.set('completed', state);
    this.model.save();  
  },
  removeOrder: function() {
    this.model.destroy();
  },
  render: function() {
    this.$el.append(this.template(this.model.toJSON()));
    return this;  
  }
});

var AllOrdersView = Backbone.View.extend({  
  initialize: function() {
    this.listenTo(this.collection, 'destroy sync add', this.render);
  },
  render: function() {
    var self = this;
    self.$el.empty();
    self.collection.forEach(function(order) {
      var orderListing = new OrderListing({model: order});
      orderListing.render();
      self.$el.append(orderListing.el);  
    });  
    return this;
  }
});

$(document).ready(function() {
  var menuItems = new MenuItems();
  var orders = new Orders();
  var newItemView = new NewItemView({
    el: '.new-menu-item',
    collection: menuItems
  });
  var allItemsView = new AllItemsView({
    el: '.menu-items',
    collection: menuItems
  });
  var allOrdersView = new AllOrdersView({
    el: '.orders',
    collection: orders
  });

  menuItems.fetch().done(function() {
    newItemView.render();
    allItemsView.render();
  });
  orders.fetch().done(function() {
    allOrdersView.render();  
  });
});
