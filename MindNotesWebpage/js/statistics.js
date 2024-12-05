function loadStatistics() {
	const notepages = JSON.parse(localStorage.getItem("NotePages"));
	if (notepages == null) {
		fillWithZero();
		return;
	}
	
	const totalNotepagesSpan = document.getElementById("TotalNotePagesSpan");
	totalNotepagesSpan.innerText = notepages.length;

	const totalLinksSpan = document.getElementById("TotalLinksSpan");
	let sum = 0;
	for (let i = 0; i < notepages.length; i++) {
		sum += notepages[i].links.length;
	}
	totalLinksSpan.innerText = sum;

	const totalConceptsSpan = document.getElementById("TotalConceptsSpan");
	totalConceptsSpan.innerText = getNbrUniqueConcepts(notepages);

	const totalWordsSpan = document.getElementById("TotalWordsSpan")
	sum = 0;
	for (let i = 0; i < notepages.length; i++) {
		sum += getTextFromDelta(notepages[i].content).trim().split(" ").filter((e) => e != "").length;
	}
	totalWordsSpan.innerText = sum;
}

function fillWithZero() {
	document.getElementById("TotalNotePagesSpan").innerText = "0";
	document.getElementById("TotalLinksSpan").innerText = "0";
	document.getElementById("TotalConceptsSpan").innerText = "0";
	document.getElementById("TotalNotePagesSpan").innerText = "0";
	document.getElementById("TotalWordsSpan").innerText = "0";
}

function getNbrUniqueConcepts(notepages) {
	const concepts = new Set();
	for (let i = 0; i < notepages.length; i++) {
		concepts.add(notepages[i].concept);
	}
	return Array.from(concepts).length;
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
