import refs from './selectors';
import Notiflix from 'notiflix';

refs.form.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onLoadMoreImages);

let page = 1;
const perPage = 40;
let inputData = '';

function onSubmitForm(event) {
  event.preventDefault();
  clearMarkup();
  resetPageNumber();
  hideLoadMoreBtn();
  inputData = event.target.elements.searchQuery.value.trim();
  if (!inputData) {
    Notiflix.Notify.failure('The fild can`t be empty. Please type your query!');
    return;
  }
  getImages(inputData)
    .then(saveData)
    .then(renderMarkup)
    .catch(error => console.log(error));
}

function onLoadMoreImages() {
  incrementPageNumber();
  getImages(inputData)
    .then(saveData)
    .then(renderMarkup)
    .catch(error => console.log(error));
}

async function getImages(data) {
  const API_KEY = '32301233-c2367e943ef8e7de3293c27a6';
  const baseUrl = 'https://pixabay.com/api/';
  const axios = require('axios');

  try {
    const response = await axios.get(
      `${baseUrl}?key=${API_KEY}&q=${data}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    showLoadMoreBtn();
    return response;
  } catch (error) {
    console.error(error);
  }
}

function saveData(response) {
  if (Math.ceil(response.data.totalHits / perPage) < page && page > 1) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    hideLoadMoreBtn();
  }
  if (response.data.hits.length === 0 && page === 1) {
    hideLoadMoreBtn();
    clearMarkup();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  const imagesArray = response.data.hits;
  return imagesArray;
}

function renderMarkup(response) {
  const markup = response
    .map(
      elem =>
        `<div class="photo-card"><img class="gallery-image" src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" /><div class="info"><p class="info-item"><b>Likes</b>${elem.likes}</p><p class="info-item"><b>Views</b>${elem.views}</p><p class="info-item"><b>Comments</b>${elem.comments}</p><p class="info-item"><b>Downloads</b>${elem.downloads}</p></div></div>`
    )
    .join('');
  refs.div.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  refs.div.innerHTML = '';
}

function incrementPageNumber() {
  page += 1;
}

function resetPageNumber() {
  page = 1;
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}