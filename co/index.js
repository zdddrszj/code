

function * gen() {
  let data1 = yield Promise.resolve(1000)
  let data2 = yield Promise.resolve(data1)
  return data2;
}

// gen().next().value.then(data => {
//   console.log(data)
// })

function co (it) {
  return new Promise((resolve, reject) => {
    function next (data) {
      let {value, done} = it.next(data)
      if (!done) {
        value.then(data => {
          next(data)
        }, reject)
      } else {
        resolve(value)
      }
    }
    next()
  })
}

co(gen()).then(data => {
  console.log(data)
})


