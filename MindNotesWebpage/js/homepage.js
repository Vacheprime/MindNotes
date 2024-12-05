// Redirect to about page
function goToAbout() {
	location.href = "about.html";
}

// Redirect to statistics page
function goToStatistics() {
	location.href = "statistics.html";
}

// Redirect to create note page
function goToCreateNotePage() {
	location.href = "create_notepage.html";
} 

// Redirect to View Notepages
function goToViewNotePages() {
	location.href = "view/view_notepages.html";
}

// Fetch a quote from the qotes API
async function loadInspirationalQuote() {
	// Get the last fetch day and the current day
	const lastFetchDayStr = localStorage.getItem("LastQuoteFetchDay");
	const currentDay = new Date().getDate();

	// Check if it has been more than one day since the last quote
	if (lastFetchDayStr == null || (currentDay != Number.parseInt(lastFetchDayStr))) {
		// Fetch the daily quote
		const api = "https://api.quotable.io/random?tags=Motivational";
		const response = await fetch(api);
		const quoteResponse = await response.json();

		// Store the quote and day in local storage
		localStorage.setItem("DailyQuote", "“" + quoteResponse.content + "”" + " -" + quoteResponse.author);
		localStorage.setItem("LastQuoteFetchDay", currentDay);
	}

	// Load the quote into the html
	const quoteTag = document.getElementById("QuoteLabel");
	quoteTag.innerText = localStorage.getItem("DailyQuote");
}
