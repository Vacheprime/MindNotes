let notepages = JSON.parse(localStorage.getItem("NotePages"))
if (notepages == null) {
	notepages = [];
}
let startPageIndex = 0;
let pageAmount = 8;

function linkNotePages() {
	// Create the list of referenced pages
	
	// Get all notepages
	const allNotepages = JSON.parse(localStorage.getItem("NotePages"));

	// filter by those who have links
	const linkedPages = allNotepages.filter(p => p.links.length != 0);
	console.log(linkedPages)
	
}

function loadNotePagesForward() {
	const viewContainer = document.getElementById("ViewNotepagesContainer");
	viewContainer.replaceChildren(); // Clear

	for (let i = startPageIndex; i < Math.min(notepages.length, startPageIndex + pageAmount); i++) {
		const page = generateNotePageContainer(notepages[i]);
		viewContainer.appendChild(page);
	}
}

function load() {
	document.getElementById("NextPagesButton").addEventListener("click", () => {
		getNextPages();
	})

	document.getElementById("PreviousPagesButton").addEventListener("click", () => {
		getPreviousPages();
	})

	// Listen for screen resize
	addEventListener("resize", reloadOnResize);

	// link pages
	linkNotePages();

	// Load initial notepages
	loadNotePagesForward();
}

function getNextPages() {
	if (startPageIndex + pageAmount >= notepages.length) {
		return;
	}
	startPageIndex += pageAmount
	loadNotePagesForward();
}

function getPreviousPages() {
	if (startPageIndex - pageAmount < 0) {
		startPageIndex = startPageIndex + -1 * (startPageIndex - pageAmount);
	}
	startPageIndex -= pageAmount
	loadNotePagesForward();
}

function reloadOnResize() {
	if (innerWidth <= 1024) {
		pageAmount = 4;
	} else {
		pageAmount = 8;
	}
	loadNotePagesForward();
}

function generateNotePageContainer(notepage) {
	// Create container
	const container = document.createElement("div");
	container.classList.add("NotepageContainer");

	// Create the title
	const title = document.createElement("h2");
	title.innerText = notepage.title;

	// Create the preview
	const preview = document.createElement("p");
	const previewText = getTextFromDelta(notepage.content);
	preview.innerText = previewText.slice(0, 25).trim() + "...";

	// Create the concept
	const concept = document.createElement("h3");
	concept.innerText = notepage.concept

	// Create the category
	const category = document.createElement("h3");
	category.innerText = notepage.category;

	container.appendChild(title);
	container.appendChild(preview);
	container.appendChild(concept);
	container.appendChild(category);

	container.addEventListener("click", () => {
		const params = new URLSearchParams()
		params.set("id", notepage.id);
		location.href="view_notepage.html?" + params.toString();
	})
	return container;
}

function getTextFromDelta(delta) {
	let text = "";
	if (delta == null || delta == "") {
		return ""
	}
	delta.ops.forEach(op => {
		if (op.insert) {
			text += op.insert;
		}
	});
	return text;
}

function getAllCategories() {
	const categorySet = new Set();
	for	(let i = 0; i < notepages.length; i++) {
		categorySet.add(notepages[i].category);
	}
	return Array.from(categorySet);
}
