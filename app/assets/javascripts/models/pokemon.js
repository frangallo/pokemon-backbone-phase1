window.Pokedex.Models.Pokemon = Backbone.Model.extend({
  urlRoot: "/pokemon",

  toys: function () {
    if (typeof this._toys === "undefined") {
      this._toys = new window.Pokedex.Collections.Toys({pokemon: this});
    }
    return this._toys;
  },

  parse: function(payload){
    if(payload.toys){
      this.toys().set(payload.toys);
      delete payload.toys;
    }
    return payload;
  },


});
