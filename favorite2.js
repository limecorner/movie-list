const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'
const dataPanel = document.querySelector('#data-panel')
const movieModel = document.querySelector('#movie-model')
const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
      <div class="card mt-3" style="width: 21%">
        <img
          src=${POSTER_URL + item.image}
          class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#modal" data-id="${item.id}">
              More
            </button>
            <a href="#" class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</a>
          </div>
        </div>
      `
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('.modal-title')
  const modelImg = document.querySelector('.model-img')
  const modelDate = document.querySelector('.modal-date')
  const modalDescription = document.querySelector('.modal-description')
  axios.get(INDEX_URL + String(id))
    .then(function (response) {
      const movieData = response.data.results
      modalTitle.innerText = movieData.title
      modelImg.src = POSTER_URL + movieData.image
      modelDate.innerText = 'Release date : ' + movieData.release_date
      modalDescription.innerText = movieData.description
    })
    .catch(error => console.log(error))
}

function removeFromFavorite(id) {
  if (list.length === 0) return //
  const movieIndex = list.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return
  list.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  renderMovieList(list)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    const id = Number(event.target.dataset.id)
    removeFromFavorite(id)
  }
})

renderMovieList(list)
