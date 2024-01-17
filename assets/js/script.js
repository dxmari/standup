"use strict";


(function (self, undefined) {

   function uid(seperator) {
      return [
         "s",
         Date.now().toString(36),
         Math.random().toString(36).substring(2)
      ].join(seperator ? seperator : "");
   }

   var todosDefaults = {
      id: 0,
      title: "",
      body: "",
      completed: false
   };

   var todos = [
      {
         id: 1,
         title: "First checkbox",
         body: "With support text underneath to add more detail"
      },
      {
         id: 2,
         title: "Second checkbox",
         body: "Some other text goes here"
      },
      {
         id: 3,
         title: "Third checkbox",
         body: "And we end with another snippet of text",
         completed: true
      }
   ];

   var todosToday = [
      {
         id: 11,
         title: "First checkbox",
         body: "With support text underneath to add more detail"
      },
      {
         id: 12,
         title: "Second checkbox",
         body: "Some other text goes here"
      },
      {
         id: 13,
         title: "Third checkbox",
         body: "And we end with another snippet of text",
         completed: true
      }
   ];

   // templates
   var List = {
      template: "#view-home",
      data: function () {
         return {
            todos: todos,
            todosToday: todosToday,
            selected: [],
            selectedToday: [],
            searchKey: ""
         };
      },
      computed: {
         btnsDisabled: function () {
            return this.selected < 1;
         },
         btnsDisabledToday: function () {
            return this.selectedToday < 1;
         }
      },
      methods: {
         deleteTodos: function () {
            this.selected.forEach(function (todo) {
               todos.splice(todos.indexOf(todo), 1);
            });

            this.selected = [];
         },
         completeTodos: function (type) {
            this.selected.forEach(function (todo) {
               todo.completed = type;
            });

            this.$forceUpdate();
         },
         deleteTodosToday: function () {
            this.selectedToday.forEach(function (todo) {
               todosToday.splice(todosToday.indexOf(todo), 1);
            });

            this.selectedToday = [];
         },
         completeTodosToday: function (type) {
            this.selectedToday.forEach(function (todo) {
               todo.completed = type;
            });

            this.$forceUpdate();
         }
      }
   };

   var newTodo = {
      template: "#view-edit-todo",
      data: function () {
         var route = this.$route,
            todo = {
               id: "skk-todo-" + uid()
            };

         return {
            // Get a copy of the 'todo' without references to avoid reactive updating
            todo: _.extend({}, todosDefaults, todo),
            path: route.path
         };
      },
      computed: {
         btnsDisabled: function () {
            return this.todo.title.length < 1;
         }
      },
      methods: {
         updateTodo: function (e) {
            todos.push(this.todo);

            // prevent form from navigating away or console warning:
            // "Form submission canceled because the form is not connected"
            e.preventDefault();
            e.stopPropagation();

            myrouter.push("/");
         }
      }
   };

   var editTodo = {
      template: "#view-edit-todo",
      data: function () {
         var route = this.$route;
         const data = route.query.type === 'today' ? todosToday : todos;
         let todo = _.findWhere(data, { id: route.params.todo_id });

         return {
            // Get a copy of the 'todo' without references to avoid reactive updating
            todo: _.extend({}, todo),
            path: route.path
         };
      },
      computed: {
         btnsDisabled: function () {
            return this.todo.title ? this.todo.title.length < 1 : true;
         }
      },
      methods: {
         updateTodo: function (e) {
            var todo = this.todo,
               // get the references to the reactive object
               ref = _.findWhere(route.query.type === 'today' ? todosToday : todos, { id: this.$route.params.todo_id });

            ref.title = todo.title;
            ref.body = todo.body;
            ref.completed = todo.completed;

            // prevent form from navigating away or console warning:
            // "Form submission canceled because the form is not connected"
            e.preventDefault();
            e.stopPropagation();

            myrouter.push("/");
         }
      }
   };

   // Routes
   var myrouter = new VueRouter({
      routes: [
         { path: "/", component: List },
         { path: "/todo/new", component: newTodo, name: "new-todo" },
         { path: "/todo/:todo_id/edit", component: editTodo, name: "edit-todo" }
      ]
   });

   // Main App
   var App = new Vue({
      router: myrouter,
      el: "#app"
   });

})(window);
