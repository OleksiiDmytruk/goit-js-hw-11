import axios from 'axios';

const params = {
  key: '38485211-2ce599a273e65f72373582d0e',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params,
});

export function getSearch(value, page) {
  return instance.get(`?q=${value}&page=${page}`).then(resp => {
    return resp.data;
  });
}
