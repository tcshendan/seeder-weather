import axios from './axios';

export async function load() {
  return axios.get('/api/weather/list')
}

export async function save(data) {
  return axios.post('/api/weather/save', data)
}

export async function generate(data) {
  return axios.post('/api/weather/generate', data)
}

export async function importFile(file) {
  return axios.post('/api/weather/import', file)
}