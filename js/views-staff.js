var StaffOrderView = Backbone.View.extend({
  tagName: 'li',
  className: 'order-listing',
  template: _.template($('[data-template="order-listing"]').text()),
  initialize: function() {
    
  },
  events: {
    'click .complete': 'completeOrder'  
  },
  completeOrder: function() {
    // var now = new Date().toISOString();
    //this.model.set('completedAt', {
    //   __type: 'Date',
    //  iso: now  
    // });
    this.model.set('completed', true);
    this.model.save();
    console.log("COMPLETED!");
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }  
  
});

var StaffOrderListView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.collection, 'add destroy sync', this.render);  
  },
  render: function() {
    var self = this;
    this.$el.empty();
      this.collection.where({'completed': false}).forEach(function(order) {
        var orderObj = new StaffOrderView({model: order});
        orderObj.render();
        self.$el.append(orderObj.el);
      });
    return this;
  }  
});

$(document).ready(function() {
  window.App = window.App || {};
  App.vent = App.vent || _.extend({}, Backbone.Events);
  App.vent.on('all', function(e) { console.log(e); });
  var orders = new Orders();
  var staffOrderList = new StaffOrderListView({
    el: '.order-list',
    collection: orders
  }); 
  
  orders.fetch().done(function() {
    staffOrderList.render();  
  });

  console.log("Done");
});
