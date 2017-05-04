import googleTrends from 'google-trends-api';

export const fetchInterestByKeyword = (keyword) => {
  return googleTrends.interestByRegion({
    geo: 'US',
    resolution: 'state',
    keyword: 'mormon'
  })
    .then((resp) => console.log(resp))
}
