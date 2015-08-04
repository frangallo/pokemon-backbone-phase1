window.Pokedex.Collections.Pokemon = Backbone.Collection.extend({
  url: "/pokemon",
  model: window.Pokedex.Models.Pokemon,
});
