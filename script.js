const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const speed = 0.4;

const words = [
	"bulles", "net art", "internet", "installations", "écume", "dispositif", "plurisphère", "cross média", "Peter Sloterdijk", "Jean-Pierre Balpe", "Raymond Bellour", "Clément Rosset", "Pierre Musso", "Norbert Hillaire", "microsphère", "macrosphère", "transmédia", "multifenêtrage", "in/visibilisation", "co-fragilité", "habitat", "espace fictif", "co-habitant","panopticon", "[corps/machine]", "sphère", "immersion", "hypervivant", "hypermédialités", "individu", "Anne-Marie Duguet", "Méga-machine (Lewis Mumford/1963)", "Principe de Cruauté (1988)", "espaces de subjectivation", "Michel Foucault (1975)", "Gorgio Agamben", "hypermédia", "rétiologie", "identification", "Maurice Merleau-Ponty", "réticule", "discours", "territoire", "dispositif ouvert", "trajection", "hyperconnexion", "espace flottant", "e-SPACE", "entre-espace", "information", "horizontalité", "corps", "réseau(x)", "dé-subjectivation"
];

let particlesArray;

// get mouse position
let mouse = {
	x: null,
	y: null,
	radius: (canvas.height / 100) * (canvas.width / 100)		// normal = 80, 80
}

window.addEventListener('mousemove', function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
});

// create particle
class Particle {
	constructor(x, y, directionX, directionY, size, color, text) {
		this.x = x;
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		this.size = size;
		this.color = color;
		this.text = text;
	}

	// method to draw individual particle
	draw() {
		// Dessine une cercle
		/* ⚠️ J'ai modifié le code ici ! Trace a première particules */
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color; /* Couleur de remplissage de la petite particule (voir ligne 104)*/
		ctx.fillStyle = 'rgba(252, 186, 3)';
		ctx.globalAlpha = 0.2;
		ctx.fill();

		/* Trace la seconde particule */
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size * 7, 0, Math.PI * 2, false); /* Prend a taille de la particule et la multiplie par 5*/
		ctx.fillStyle = 'rgba(255, 0, 21)'; /* Couleur de remplissage de la grande particule 255, 0, 8*/
		ctx.fill();
		/* ⚠️ Les modifications se terminent ici */

		// Trace le texte
		ctx.font = "13px Arial";
		ctx.globalAlpha = 1;
		ctx.textAlign = "center";
		ctx.fillStyle = this.color;
		ctx.fillText(this.text, this.x, this.y);
	}
	// check particle position, check mouse position, move the particle, draw the particle
	update() {
		// check if particle is winthin canvas
		if (this.x > canvas.width || this.x < 0) {
			this.directionX = -this.directionX;
		}
		if (this.y > canvas.height || this.y < 0) {
			this.directionY = -this.directionY;
		}

		// check collision direction - mouse position / particle position
		let dx = mouse.x - this.x;
		let dy = mouse.y - this.y;
		let distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < mouse.radius + this.size) {
			if (mouse.x < this.x && this.x < canvas.widht - this.size * 10) {
				this.x += 10;
			}
			if (mouse.x > this.x && this.x > this.size * 10) {
				this.x -= 10;
			}
			if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
				this.y += 10;
			}
			if (mouse.y > this.y && this.y > this.size * 10) {
				this.y -= 10;
			}
		}
		// move particle
		this.x += this.directionX * speed;
		this.y += this.directionY * speed;
		// draw particle
		this.draw();

	}
}

// create particle array
function init() {
	particlesArray = [];
	for (let i = 0; i < words.length; i++) {
		let size = (Math.random() * 3) + 0.1; // Change particles size (basic : * 5) + 1;
		let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
		let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
		let directionX = (Math.random() * 5) - 2.5;
		let directionY = (Math.random() * 5) - 2.5;
		let color = '#ffffff';				// ["#BD10E0","#B8E986","#50E3C2","#FFD300","#E86363"]
		let text = words[i];

		particlesArray.push(new Particle(x, y, directionX, directionY, size, color, text));
	}
}

// check if particles are close enough to draw line between them
function connect() {
	let opacityValue = 1;
	for (let a = 0; a < particlesArray.length; a++) {
		for (let b = a; b < particlesArray.length; b++) {
			let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
			if (distance < (canvas.width / 7) * (canvas.height / 7)) {
				opacityValue = 0.9 - (distance / 20000);
				ctx.strokeStyle = 'rgba(255, 0, 0,' + opacityValue + ')'; // Change interlines color
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
				ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
				ctx.stroke();

				/* ⚠️ J'ai rajouté les lignes suivantes */
				opacityValue = 0.5 - (distance / 10000);
				ctx.strokeStyle = 'rgba(50, 13, 62)'; // Change interlines color
				ctx.lineWidth = 1.2;		// change la taille des lignes entre les particules
				ctx.beginPath();
				ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
				ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
				ctx.stroke();
				/* ⚠️ Jusqu'ici */
			}
		}
	}
}

// animation loop
function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, innerWidth, innerHeight);

	for (let i = 0; i < particlesArray.length; i++) {
		particlesArray[i].update();
	}
	connect();
}
// resize event
window.addEventListener('resize', function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
	init();
});

// mouse out event
window.addEventListener('mouseout', function() {
	mouse.x = undefined;
	mouse.x = undefined;
});

init();
animate();
