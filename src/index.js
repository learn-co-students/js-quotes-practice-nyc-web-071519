document.addEventListener("DOMContentLoaded", () => {
  // URL'S
  const quotesURL = "http://localhost:3000/quotes";
  const likesURL = "http://localhost:3000/likes";
  const container = document.getElementById("container");

  // DOM ELEMENT'S
  const quoteContainer = document.getElementById("quote-list");
  const formContainer = document.getElementById("new-quote-form");
  // ARRAY OF OBJECTS
  quotesCollection = [];

  // CONTAINER EVENT LISTENER / BUTTON ACTIONS

  document.addEventListener("click", e => {
    e.preventDefault();
    switch (e.target.dataset.action) {
      case "like":
        let parsedID = parseInt(e.target.dataset.id);
        let found = quotesCollection.find(
          q => q.id === parseInt(e.target.dataset.id)
        );

        let like = {
          quoteId: parsedID
        };

        fetch(likesURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(like)
        })
          .then(res => res.json())
          .then(res => {
            found.likes.push(1);
            console.log(found.likes.length);
            const span = document.getElementById(`like${found.id}`);
            span.innerText = found.likes.length;
          });

        break;
      case "delete":
        fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
          method: "DELETE"
        }).then(() => {
          e.target.parentElement.remove();
        });
        break;
      default:
        break;
    }
  });

  // FORM EVENT LISTENER / ACTION
  formContainer.addEventListener("submit", e => {
    e.preventDefault();
    let quoteField = e.target.quote.value;
    let authorField = e.target.author.value;

    let newQuote = {
      author: authorField,
      quote: quoteField
    };

    fetch(quotesURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newQuote)
    })
      .then(res => res.json())
      .then(res => {
        quoteContainer.insertAdjacentHTML(
          "beforeend",
          `
            <li data-id=${res.id} class='quote-card'>
             <blockquote class="blockquote">
              <p class="mb-0">${res.quote}</p>
                <footer class="blockquote-footer">${res.author}</footer>
              <br>
                <button data-action="like" data-id=${res.id} class='btn-success'>Likes: <span id="like${res.id}" data-id=${res.id}>0</span></button>
                <button data-action="delete" data-id=${res.id} class='btn-danger'>Delete</button>
            </blockquote>
        </li>
          `
        );
      });
  });

  //  INITIAL FETCH
  fetch(quotesURL + "?_embed=likes")
    .then(resp => resp.json())
    .then(data => {
      quotesCollection = data;
      console.log(data);

      data.forEach(quote => {
        const card = `
            <li data-id=${quote.id} class='quote-card'>
             <blockquote class="blockquote">
              <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
              <br>
                <button data-action="like" data-id=${quote.id} class='btn-success'>Likes: <span id="like${quote.id}" data-id=${quote.id}>${quote.likes.length}</span></button>
                <button data-action="delete" data-id=${quote.id} class='btn-danger'>Delete</button>
            </blockquote>
        </li>
          `;
        quoteContainer.insertAdjacentHTML("beforeend", card);
      });
    });
});
