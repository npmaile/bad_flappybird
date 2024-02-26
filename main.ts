
let canvas = <HTMLCanvasElement>document.createElement("canvas");
let body = document.body.appendChild(canvas);

let height = window.innerHeight
let width = window.innerWidth
canvas.setAttribute("height", String(height))
canvas.setAttribute("width", String(width))
var ctx = canvas.getContext("2d");
if (!ctx) {
	throw "something bad happened"
}

let sprites = initSprites()

let birdX = height / 10
let birdY: number
let birdDeltaY: number

let lastTime: number

let start: number, previousTimeStamp: number
const pipeWidth = width / 10


type antiPipe = {
	x: number
	topPipeHeight: number
	bottomPipeHeight: number
}

let pipes: antiPipe[] = [{
	bottomPipeHeight: height / 4,
	x: width + 1 * width / 3,
	topPipeHeight: height / 3,
}, {
	bottomPipeHeight: height / 4,
	x: width + 2 * width / 3,
	topPipeHeight: height / 3,
}, {
	bottomPipeHeight: height / 4,
	x: width + 3 * width / 3,
	topPipeHeight: height / 3,
}]

const minimumGap = height * .2
flappybird(-1)

function newAntiPipe(): antiPipe {
	let bottomPipeHeight = Math.floor(Math.random() * ((.7 * height) - (height * .1) + 1) + height * .1)

	let topPipeMax = (height - bottomPipeHeight - minimumGap)

	return {
		x: width,
		bottomPipeHeight: bottomPipeHeight,
		topPipeHeight: Math.floor((Math.random() * (topPipeMax - (height * .1)) + 1) + height * .1)
	}
}

function initSprites() {
	let berd = document.createElement('img')
	berd.src = "./berd.png"
	let pipe = document.createElement('img')
	pipe.src = "./pipe.png"
	return {
		"berd": berd,
		"pipe": pipe
	}
}

function flappybird(timestamp: number): undefined {
	birdY = height / 2
	birdDeltaY = 0


	document.body.onkeydown = (e) => {
		if (e.code == "Space") {
			birdDeltaY = -200
		}
	}

	render(timestamp)
}

function render(timestamp: number) {
	console.log("new frame")
	ctx!.fillRect(0, 0, width, height)
	if (!lastTime || timestamp == 0) {
		lastTime = timestamp
	}
	let deltaTime = timestamp - lastTime
	lastTime = timestamp
	birdDeltaY = birdDeltaY + (25 * deltaTime / 100)
	birdY = birdY + (deltaTime / 1000 * birdDeltaY)
	ctx!.drawImage(sprites.berd, birdX, birdY, width / 20, height / 20)

	for (let i = 0; i < pipes.length; i++) {
		pipes[i].x -= .2 * deltaTime
		// draw top pipe
		ctx!.drawImage(sprites.pipe, pipes[i].x, 0, pipeWidth, pipes[i].topPipeHeight)
		// draw bottom pipe
		ctx!.drawImage(sprites.pipe, pipes[i].x, height - pipes[i].bottomPipeHeight, pipeWidth, pipes[i].bottomPipeHeight)

		if (pipes[i].x < birdX && (birdY < pipes[i].topPipeHeight || birdY > height - pipes[i].bottomPipeHeight)) {
			console.log(pipes[i])
			console.log(birdY)
			alert("you lose")
		}

		if (pipes[i].x < 0) {
			pipes[i] = newAntiPipe()
		}

	}

	if (birdY > height) {
		birdY = height / 2
		birdDeltaY = 0
	}
	requestAnimationFrame(render)
}



