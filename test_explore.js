fetch('http://localhost:5001/api/records/explore/all')
  .then(res => res.json())
  .then(data => {
    console.log(JSON.stringify(data.records[0].user, null, 2));
  })
  .catch(err => console.error(err));
