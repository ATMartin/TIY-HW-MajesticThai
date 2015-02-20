$.ajaxSetup({headers: window.parseHeaders});

// MENU ITEMS
var MenuItem = Backbone.Model.extend({
  idAttribute: 'objectId',
  defaults: function(opts) {
    opts = opts || {};
    return _.defaults(opts, {
      title: 'TITLE',
      description: 'DESCRIP',
      price: 'PRICE',
      category: 'CATEGORY'
    });
  }
});

var MenuItems = Backbone.Collection.extend({
  model: MenuItem,
  url: "https://api.parse.com/1/classes/MenuItems",
  parse: function(res) { return res.results; }  
});

// CUSTOMER ORDERS
var Order = Backbone.Model.extend({
  idAttribute: 'objectId',
  defaults: function(opts) {
    opts = opts || {};
    return _.defaults(opts, {
      items: [],
      totalPrice: 0.00
    });
  }
});

var Orders = Backbone.Collection.extend({
  model: Order,
  url: "https://api.parse.com/1/classes/Orders",
  parse: function(res) { return res.results; }  
});
