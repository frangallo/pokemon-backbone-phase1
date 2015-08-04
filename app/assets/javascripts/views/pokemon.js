Pokedex.Views.Pokemon = Backbone.View.extend({
  initialize: function () {
    this.$pokeList = this.$el.find('.pokemon-list');
    this.$pokeDetail = this.$el.find('.pokemon-detail');
    this.$newPoke = this.$el.find('.new-pokemon');
    this.$toyDetail = this.$el.find('.toy-detail');

    this.pokemon = new Pokedex.Collections.Pokemon();

    this.$pokeList.on("click", "li.poke-list-item", this.displayOnClick.bind(this));
    this.$newPoke.on("submit", this.submitPokemonForm.bind(this));
    this.$toyDetail.on("click", "li.toy-list-item", this.selectToyFromList.bind(this));
  },

  selectToyFromList: function(event){
    var listItem = $(event.currentTarget);
    var pokemonId = listItem.data("pokemon-id");
    var toyId = listItem.data("toy-id");
    var pokemon = this.pokemon.get(pokemonId);
    var toy = pokemon.toys().get(toyId);

    this.renderToyDetail(toy);
  },

  displayOnClick: function(event) {
    var currentListItem = $(event.currentTarget);
    var pokemonId = currentListItem.data("id");
    var pokemon = this.pokemon.get(pokemonId);
    var view = this;
    pokemon.fetch({
      success: view.renderPokemonDetail.bind(view, pokemon),
    });
  },

  submitPokemonForm: function(event){
    event.preventDefault();
    var form = $(event.currentTarget);
    var pokemonData = form.serializeJSON();
    this.createPokemon(pokemonData, this.renderPokemonDetail);
  },

  addPokemonToList: function (pokemon) {
    var $li = $("<li></li>");
    $li.addClass("poke-list-item");
    $li.attr("data-id", pokemon.get("id"));
    $li.text(pokemon.get("name") + ", " + pokemon.get("poke_type"));
    this.$pokeList.append($li);
  },

  refreshPokemon: function () {
    var view = this;
    view.pokemon.fetch({
      success: function () {
        view.pokemon.each(function (pokemon) {
          view.addPokemonToList(pokemon);
        });
      }
    });
  },

  renderPokemonDetail: function(pokemon){
    var $div = $("<div></div>");
    $div.addClass("detail");
    var $img = $("<img>");
    $img.attr("src", pokemon.get("image_url"));
    // debugger
    $div.append($img);
    var $ul = $("<ul></ul>");
    var $ulToys = $("<ul></ul>");
    $ulToys.addClass("toys");
    this.$toyDetail.html($ulToys);
    $div.append($ul);

    for(attr in pokemon.attributes){
      if (attr === "image_url") { continue; }
      var $li = $("<li></li>");
      $li.text(attr + ': ' + pokemon.attributes[attr]);
      $ul.append($li);
    }
    var view = this;

    pokemon.toys().each(function(toy) {
      view.addToyToList(toy);
    });

    this.$pokeDetail.html($div);
  },

  renderToyDetail: function (toy) {
    // debugger
    this.$toyDetail.find(".detail").remove();
    var $div = $("<div></div>");
    $div.addClass("detail");
    var $img = $("<img>");
    $img.attr("src", toy.get("image_url"));
    // debugger
    $div.append($img);
    for(attr in toy.attributes){
      if (attr === "image_url") { continue; }
      var $p = $("<p></p>");
      $p.text(attr + ': ' + toy.attributes[attr]);
      $div.append($p);
    }
    this.$toyDetail.append($div);
  },

  addToyToList: function(toy){
    var $li = $("<li></li>").addClass("toy-list-item");
    // debugger
    $li.attr("data-pokemon-id", toy.get("pokemon_id"));
    $li.attr("data-toy-id", toy.get("id"));
    $li.text("Name: " + toy.get("name") + "- " + "happiness: " + toy.get("happiness") + "- " + "Price: " + toy.get("price"));
    this.$toyDetail.find(".toys").append($li);
  },

  createPokemon: function(attributes, callback){
    var newPokemon = new Pokedex.Models.Pokemon();
    newPokemon.set(attributes);
    var view = this;
    newPokemon.save({}, {
      success: function (model, resp, options ) {
        view.pokemon.add(model);
        view.addPokemonToList(model);
        // debugger;
        callback.call(view,model);
      },
      error: function(){
        alert('Invalid');
      }
    });

  },

});
