(function () {
  "use strict";

  var dc = {};
  var categories = [
    {name: "Lunch", short_name: "L"},
    {name: "Dinner", short_name: "D"},
    {name: "Sushi", short_name: "S"},
    {name: "Specials", short_name: "SP"}
  ];

  var menuItems = {
    L: ["Kung Pao Chicken", "Sweet and Sour Chicken", "Beef with Broccoli"],
    D: ["Peking Duck", "Mongolian Beef", "General Tso's Chicken"],
    S: ["California Roll", "Salmon Sushi", "Shrimp Tempura Roll"],
    SP: ["Chef's Special", "Crispy Chicken", "House Special Noodles"]
  };

  function insertHtml(selector, html) {
    document.querySelector(selector).innerHTML = html;
  }

  function chooseRandomCategory(categories) {
    var randomArrayIndex = Math.floor(Math.random() * categories.length);
    return categories[randomArrayIndex];
  }

  function buildHome() {
    fetch("snippets/home-snippet.html")
      .then(function (response) { return response.text(); })
      .then(function (homeHtml) {
        var chosen = chooseRandomCategory(categories).short_name;
        var quoted = "'" + chosen + "'";
        homeHtml = homeHtml.replace(/{{randomCategoryShortName}}/g, quoted);
        insertHtml("#main-content", homeHtml);
      })
      .catch(function () {
        insertHtml("#main-content", "<p class='error'>Could not load the home page.</p>");
      });
  }

  dc.loadMenuCategories = function () {
    var html = "<h2 class='page-title'>Menu Categories</h2><section class='category-grid'>";
    categories.forEach(function (category) {
      html += "<a class='category-card' href='#' onclick=\"$dc.loadMenuItems('" +
              category.short_name + "'); return false;\"><h3>" +
              category.name + "</h3><p>View " + category.name + " menu</p></a>";
    });
    html += "</section>";
    insertHtml("#main-content", html);
  };

  dc.loadMenuItems = function (categoryShort) {
    var category = categories.find(function (c) { return c.short_name === categoryShort; });
    var items = menuItems[categoryShort] || [];
    var html = "<h2 class='page-title'>" + category.name + "</h2><section class='items'>";
    items.forEach(function (item, i) {
      html += "<article class='item'><div><h3>" + item + "</h3><p>Delicious restaurant special made fresh for you.</p></div><strong>$" +
              (10 + i * 2 + 0.99).toFixed(2) + "</strong></article>";
    });
    html += "</section><p><a href='#' id='backHome'>← Back to Home</a></p>";
    insertHtml("#main-content", html);
    document.querySelector("#backHome").onclick = function (e) {
      e.preventDefault();
      buildHome();
    };
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#homeLink").onclick = function (e) {
      e.preventDefault();
      buildHome();
    };
    document.querySelector("#menuLink").onclick = function (e) {
      e.preventDefault();
      dc.loadMenuCategories();
    };
    document.querySelector("#menuToggle").onclick = function () {
      document.querySelector("#navList").classList.toggle("open");
    };
    buildHome();
  });

  window.$dc = dc;
})();