const fs = require('fs');

const data = ['127.0.0.2']
const d = fs.appendFileSync('./domain.json', JSON.stringify(data), {}, (err) => {
    console.log(err)
})

console.log(d)
