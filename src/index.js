// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function(){
    const quotesList = document.getElementById("quote-list")

    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(data => {
        console.log(data)
        quotes = data
        for(let i = 0; i < quotes.length; i++){
            // console.log(quotes[i].author)
            const quote = quotes[i].quote
            const author = quotes[i].author
            const id = quotes[i].id
            // const likes = quotes[i].likes

            // console.log(quote, author, likes)

            const list = `
                <li class='quote-card' data-id="${id}">
                    <blockquote class="blockquote">
                    <p class="mb-0">${quote}</p>
                    <footer class="blockquote-footer">${author}</footer>
                    <br>
                    <button class='btn-success' id="button-${id}">Likes: <span id="likes-${id}">0</span></button>
                    <button class='btn-danger' id="del-${id}">Delete</button>
                    </blockquote>
                </li>
            `
            quotesList.insertAdjacentHTML("beforeend", list)

            const deleteButton = document.querySelector(`#del-${id}`)

            deleteButton.addEventListener("click", function(e){
                console.log("DELETE")
                e.preventDefault()

                fetch(`http://localhost:3000/quotes/${id}`,{
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(data)
                })
                .then(function(){
                    const toDelete = document.querySelector(`[data-id="${id}"]`)
                    toDelete.remove()
                })



            })

            const likeButton = document.querySelector(`#button-${id}`)

            likeButton.addEventListener("click", function(e){
                // console.log("like")
                const likeSpan = document.querySelector(`#likes-${id}`)
                
                let likesNum = parseInt(likeSpan.innerText)
                likesNum ++
                likeSpan.innerText = likesNum

                fetch("http://localhost:3000/likes", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({
                        "likes": `${likesNum}`
                    })
                })
            })
        }
    })
})

