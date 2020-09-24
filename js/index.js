
const bookTitleUl = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')
const body = document.querySelector('body')

const main = () => {
  fetchBooks()
  addClickListener()
}

const renderBookLis = books => {
  books.forEach(book => {
    // create outer li and add title+id to inner li
    const bookLi = `<li class=book-li data-book-id=${book.id}>${book.title}</li>`
    // add li to ul
    bookTitleUl.innerHTML += bookLi
  })
}

const fetchBooks = () => {
  fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(books => renderBookLis(books));
}

const addClickListener = () => {
  body.addEventListener('click', event => {
    if(event.target.className === 'book-li'){
      fetchMatchingBook(event)
    }
  })
}

const fetchMatchingBook = event => {
  fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(books => findMatch(books, event) );
}

const findMatch = (books, event) => {
  const bookId = parseInt(event.target.dataset.bookId)
  const matchingBook = books.filter(book => book.id === bookId);
  const usersLi = matchingBook[0].users.map(user => {
    return `<li>${user.username}</li>`
  }).join('')
  // if pouros user has already liked the book, 
    // render the unlike button
    // else render the like button
  if ( matchingBook[0].users.some(user => user.username === 'pouros') ){
   bookButton = `<button class=unlike-btn data-id=${matchingBook[0].id}>UNLIKE</button>`
  }
  else {
    bookButton =`<button class=like-btn data-id=${matchingBook[0].id}>LIKE</button>`
  }

  showPanel.innerHTML =
  `<div class=book-${matchingBook[0].id}>
  <h1>${matchingBook[0].title}</h1>
  <h4>${matchingBook[0].subtitle}</h4>
  <h4>${matchingBook[0].author}</h4>
  <img src=${matchingBook[0].img_url} height=200px />
  <p>${matchingBook[0].description}</p>
  <p>Liked by:</p>
  <ul>${usersLi}</ul>
  ${bookButton}
  </div>`

  let userArray = matchingBook[0].users
  body.addEventListener('click', likeEvent => {
    if (likeEvent.target.className === 'like-btn') {
      likeBook(userArray, likeEvent);
    }
    else if (likeEvent.target.className === 'unlike-btn'){
      unlikeBook(userArray, likeEvent);
    }
  })

}

const likeBook = (userArray, likeEvent) => {
  const bookId = parseInt(likeEvent.target.dataset.id)
  const updatedUserArray = [
    ...userArray,
    {"id":1, "username":"pouros"}
  ]

  const reqObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({users: updatedUserArray})
  }
  fetch(`http://localhost:3000/books/${bookId}`, reqObj)
    .then(res => res.json())
    .then(updatedBook => renderUpdatedBook(updatedBook));
}

const renderUpdatedBook = updatedBook => {
  const usersLi = updatedBook.users.map(user => {
    return `<li>${user.username}</li>`
  }).join('')
  showPanel.innerHTML =
  `<div class=book-${updatedBook.id}>
  <h1>${updatedBook.title}</h1>
  <h4>${updatedBook.subtitle}</h4>
  <h4>${updatedBook.author}</h4>
  <img src=${updatedBook.img_url} height=200px />
  <p>${updatedBook.description}</p>
  <p>Liked by:</p>
  <ul>${usersLi}</ul>
  <button class=unlike-btn data-id=${updatedBook.id}>UNLIKE</button>
  </div>`
}

const unlikeBook = (userArray, likeEvent) => {
  //remove last item from the array
  userArray.pop()
  const bookId = parseInt(likeEvent.target.dataset.id)

  const updatedUserArray = userArray

  const reqObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    ///adjust this
    body: JSON.stringify({users: updatedUserArray})
  }
  fetch(`http://localhost:3000/books/${bookId}`, reqObj)
    .then(res => res.json())
    .then(updatedBook => renderUpdatedBook2(updatedBook));
}

const renderUpdatedBook2 = updatedBook => {
  const usersLi = updatedBook.users.map(user => {
    return `<li>${user.username}</li>`
  }).join('')
  showPanel.innerHTML =
  `<div class=book-${updatedBook.id}>
  <h1>${updatedBook.title}</h1>
  <h4>${updatedBook.subtitle}</h4>
  <h4>${updatedBook.author}</h4>
  <img src=${updatedBook.img_url} height=200px />
  <p>${updatedBook.description}</p>
  <p>Liked by:</p>
  <ul>${usersLi}</ul>
  <button class=like-btn data-id=${updatedBook.id}>LIKE</button>
  </div>`

}


main()

