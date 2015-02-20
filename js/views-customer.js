
var MenuItemView = Backbone.View.extend({
  template: _.template($('[data-template="menu-item"]').text()),
  events: {
    'click .add' : 'addToOrder'
  },
  addToOrder: function() {},
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var MenuItemsList = Backbone.View.extend({
  render: function() {
    var self = this;
    this.collection.forEach(function(item) {
        var newModel = new MenuItemView({model: item});
        newModel.render();
        self.$el.append(newModel.el);
    });
    return this;
  }
});



$(document).ready(function() {

var collection = new MenuItems();
var menuList = new MenuItemsList({
  el: '.menu-item-list',
  collection: collection
});

collection.fetch().done(function() {
  menuList.render();
    
});
  


});

