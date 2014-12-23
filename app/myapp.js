(function() {
  // Model
  var Task = Backbone.Model.extend({
    defaults: {
      title: "do something!",
      completed: false
    },
    validate: function(attrs) {
      if(_.isEmpty(attrs.title)) { return "Title must not be empty."; }
    }, 
    initialize: function() {
      this.on('invalid', function(model, error) {
        $('#error').html(error);
      })
    },
    toggle: function() {this.set('completed', !this.get('completed')); },
    finish: function() {this.set('completed', true); }
  });
  var Tasks = Backbone.Collection.extend({ model: Task });

  var TaskView = Backbone.View.extend({
    tagName: "li",
    initialize: function() { 
      this.model.on('destroy', this.remove, this);
      this.model.on('change', this.render, this);
    },
    className: 'task',
    events: {
      'click .command': "sayHello",
      'click .delete': "destroy",
      'click .toggle': 'toggle'
    },
    destroy: function() {
      if(confirm('Are you sure?')) {
        this.model.destroy();
      }
    },
    remove: function() { this.$el.remove(); },
    template: _.template($('#task-template').html()),
    toggle: function() {
      this.model.toggle();
    },
    render: function() {
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    }
  });

  var TasksView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
      this.collection.on('add', this.addNew, this);
    },
    addNew: function(task) {
      var taskView = new TaskView({model: task});
      this.$el.append(taskView.render().el);
    },
    render: function() {
      this.collection.each(function(task) {
        var taskView = new TaskView({model: task});
        this.$el.append(taskView.render().el);
      }, this);
      return this;
    }, 
  });

  var AddTaskView = Backbone.View.extend({
    el: '#addTask',
    events: {
      'submit': 'submit'
    },
    submit: function(e) {
      e.preventDefault();
      var task = new Task();
      if(task.set({'title': $('#title').val()}, {validate: true})) {
        this.collection.add(task);
      }
    },
  });

  var task1 = new Task({title: 'buy milk.'});
  var task2 = new Task({title: 'learn coffee.'});
  var task3 = new Task({title: 'wash dishes'});
  task1.finish();
  var tasks = new Tasks([task1, task2, task3]);

  var addTaskView = new AddTaskView({collection: tasks});
  var tasksView = new TasksView({collection: tasks});
  $('#tasks').html(tasksView.render().el);

})();
