const states = {
	0: 'pending',
	1: 'fulfilled',
	2: 'rejected'
  }
function MyPromise (cb) {
	if (typeof cb!== 'function') {
		throw new TypeError('callback must be a function')
	}
	let state = states[0]
	let value = null
	let handlers = []
  
	function fulfill (result) {
		state = states[1]
		value = result
		handlers.forEach(handle)
		handlers = null
  	}
	  
	function reject (error) {
		state = states[2]
		value = error
	  	handlers.forEach(handle)
	  	handlers = null
	}
	
	function resolve (value) {
		try {
			let then = getThen(value)
			if (then) {
				resolveAnotherPromise(then.bind(value), resolve, reject)
				return
			}
			fulfill(value)
		} catch (err) {
			reject(err) 
		}
	}
  
	function handle (handler) {
		if (state === states[0]) handlers.push(handler)
		else {
			if (state === states[1] && 
				typeof handler.onFulfill === 'function') {
				handler.onFulfill(value)
			}
			if (state === states[2] && 
				typeof handler.onReject === 'function') {
				handler.onReject(value)
			}
		}
	}
  
	this.done = function (onFulfill, onReject) {
		setTimeout(() => handle(onFulfill, onReject), 0)
  	}
  
	this.then = function (onFulfill, onReject) {
		let self = this
		return new Promise((resolve, reject) => {
	  		return self.done(result => {
				if (typeof onFulfill === 'function') {
		  			try {
						return resolve(onFulfill(result))
		  			} catch (err) {
						return reject(err)
		  			}
				} else {
		  			return resolve(result)
				}
	 		}, error => {
				if (typeof onReject === 'function') {
		  			try {
						return resolve(onReject(error))
		  			} catch (err) {
						return reject(err)
		  			}
				} else {
		  			return reject(error)
				}
	 		})
		})
  	}
}  
  
function getThen (value) {
	if (typeof(value) === 'object' 
		|| typeof(value) === 'function') {
		let then = value.then
		if (typeof(then) === 'function') return then
	}	
	return null
}
	  
function resolveAnotherPromise (cb, Onfulfill, Onreject) {
	let finished = false
	try {
		cb(value => {
			if (finished) return
			finished = true
			Onfulfill(value)
		}, reason => {
			if (finished) return
			finished = true
			Onreject(reason)
		})
	} catch (err) {
		if (finished) return
		finished = true
		Onreject(err)
	}
}


// USAGE
let p = new MyPromise( (resolve, reject) =>{
	setTimeout(() => {
	  let timeString = Date.now()
	  if (timeString % 2 === 0) {
		resolve(timeString)
	  } else {
		reject(timeString)
	  }
	}, 3000)
})

p.then(display(2))
.then(display(4))
.then(display(7))
.then(display(10))
.catch(displayNum(20))
.finally(() => {
  console.log(20)
  return 300
})

function display (value) {
  console.log('I am even', value)
  return value + 1
}

function displayNum (value) {
  console.log('I am odd', value)
  return value
}