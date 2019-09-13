document.addEventListener("DOMContentLoaded", event => {
  console.log("DOM fully loaded and parsed");
  let quoteList = document.querySelector("#quote-list");
  let quotesArray = [];
  let likeButton = document.querySelector(".btn-success");
  let newForm = document.querySelector("#new-quote-form");
  let newQuote = document.querySelector("#new-quote");
  let newAuthor = document.querySelector("#author");
  function renderQuotes() {
    return fetch("http://localhost:3000/quotes?_embed=likes").then(function(
      response
    ) {
      response.json().then(function(data) {
        quotesArray = data;
        debugger;
        // console.log(data);
        quoteList.innerHTML = "";
        data.forEach(quote => {
          quoteList.insertAdjacentHTML(
            "beforeend",
            `<li id= ${quote.id} class='quote-card'>
                <blockquote id= ${quote.id} class="blockquote">
                  <p class="mb-0">${quote.quote}</p>
                  <footer class="blockquote-footer">${quote.author}</footer>
                  <br>
                  <button id= ${quote.id} class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                  <button class='btn-danger'>Delete</button>
                </blockquote>
              </li>`
          );
        });
      });
    });
  }
  renderQuotes();

  quoteList.addEventListener("click", function(e) {
    if (e.target.className === "btn-danger") {
      elementToRemove = e.target.closest("li");
      //   console.log(elementToRemove);

      fetch(`http://localhost:3000/quotes/${parseInt(elementToRemove.id)}`, {
        method: "DELETE"
      })
        .then(r => r.json())
        .then(renderQuotes);
    }
  });

  /// new quote:::

  newForm.addEventListener("submit", function(e) {
    e.preventDefault();
    // console.log(e.target);
    // console.log(newQuote.value);
    // console.log(newAuthor.value);

    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json"
      },
      body: JSON.stringify({
        quote: `${newQuote.value}`,
        author: `${newAuthor.value}`
      })
    }).then(function(response) {
      response.json().then(renderQuotes);
    });
    newQuote.value = "";
    newAuthor.value = "";
  });

  // likes::::

  quoteList.addEventListener("click", function(e) {
    e.preventDefault();

    if (e.target.className === "btn-success") {
      let likes = parseInt(e.target.querySelector("span").innerText);
      likes += 1;

      fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accepts: "application/json"
        },
        body: JSON.stringify({
          quoteId: parseInt(e.target.id)
        })
      }).then(function(response) {
        response.json().then(() => {
          e.target.querySelector("span").innerText = likes;
        });
      });
    }
  });
});
