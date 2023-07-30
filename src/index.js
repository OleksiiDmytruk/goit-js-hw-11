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

function getImages(evt) {
  evt.preventDefault();
  value = evt.target.elements.searchQuery.value.trim();
  getSearch(value, page)
    .then(resp => {
      if (resp.hits.length === 0) {
        Notiflix.Report.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        if (resp.totalHits > 40) {
          elements.loadMoreBtnEl.classList.remove('hidden');
        }
        const galleyMarkup = addGalleryMarkup(resp);
        elements.galleryEl.innerHTML = galleyMarkup;
        const imagesQuantity = resp.totalHits;
        Notiflix.Notify.info(`Hooray! We found ${imagesQuantity} images.`);
        gallery.refresh();
      }
    })
    .catch(err => {
      Notiflix.Report.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function addMoreImage(evt) {
  page += 1;
  getSearch(value, page)
    .then(resp => {
      imgQuantity += resp.hits.length;
      if (imgQuantity === resp.totalHits) {
        elements.loadMoreBtnEl.classList.add('hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      const galleyMarkup = addGalleryMarkup(resp);
      elements.galleryEl.insertAdjacentHTML('beforeend', galleyMarkup);
      gallery.refresh();
    })
    .catch(err => {
      Notiflix.Report.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}
