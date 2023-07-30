import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { params, getSearch } from './components/api';
import { elements } from './components/refs';
import { addGalleryMarkup } from './components/markup';

elements.searchFormEl.addEventListener('submit', getImages);
elements.loadMoreBtnEl.addEventListener('click', addMoreImage);

let value = '';
let page = 1;
let imgQuantity = 40;

const gallery = new SimpleLightbox('.gallery .photo-card a');

elements.loadMoreBtnEl.classList.add('hidden');

async function getImages(evt) {
  evt.preventDefault();
  value = evt.target.elements.searchQuery.value.trim();
  try {
    const respons = await getSearch(value, page);
    if (respons.hits.length === 0) {
      Notiflix.Report.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      if (respons.totalHits > 40) {
        elements.loadMoreBtnEl.classList.remove('hidden');
      }
      const galleyMarkup = addGalleryMarkup(respons);
      elements.galleryEl.innerHTML = galleyMarkup;
      const imagesQuantity = respons.totalHits;
      Notiflix.Notify.info(`Hooray! We found ${imagesQuantity} images.`);
      gallery.refresh();
      evt.target.reset();
    }
  } catch (err) {
    Notiflix.Report.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function addMoreImage() {
  page += 1;
  try {
    const respons = await getSearch(value, page);
    imgQuantity += respons.hits.length;
    if (imgQuantity === respons.totalHits) {
      elements.loadMoreBtnEl.classList.add('hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    const galleyMarkup = addGalleryMarkup(respons);
    elements.galleryEl.insertAdjacentHTML('beforeend', galleyMarkup);
    gallery.refresh();
  } catch (err) {
    Notiflix.Report.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
