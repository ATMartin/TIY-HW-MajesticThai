
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


$(document).ready(function() {
  var menuItems = new MenuItems();
  var newItemView = new NewItemView({
    el: '.new-menu-item',
    collection: menuItems
  });
  var allItemsView = new AllItemsView({
    el: '.menu-items',
    collection: menuItems
  });
  menuItems.fetch().done(function() {
    newItemView.render();
    allItemsView.render();
  });
});
