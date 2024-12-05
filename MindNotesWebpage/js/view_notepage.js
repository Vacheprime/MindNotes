// Load the editor with the saved notes 
function loadEditor() {
	// Get the notepage requested
	const notepage = getNotePageRequested();

	// Initialize the editor
	const quill = new Quill('#Editor', {
		theme: 'snow'
	});
	
	// Initialize the editor with content from notepage
	quill.setContents(notepage.content)

	// Set event handler to save when text changes
	quill.on("text-change", () => {
		saveText(quill, notepage);
		updateWordCount(quill);
	})

	// Add a click event handler for the link to page button
	document.getElementById("LinkPageButton").addEventListener("click", () => {
		const linkablePages = getLinkablePages(notepage);
		if (linkablePages.length != 0) {
			createLinkToPageModal(notepage, linkablePages);
		} else {
			createModal("Link a Page", "No pages can be linked at the moment.");
		}
	})

	// Add a click event handler for the bookmark notepage button
	document.getElementById("BookmarkButton").addEventListener("click", () => {
		if (!notepage.bookmarked) {
			setBookmarkPage(notepage, true);
			createModal("Bookmark Page", "The page has been added to bookmarks.")
		} else {
			setBookmarkPage(notepage, false);
			createModal("Bookmark Page", "The page has been removed from bookmarks.");
		}
	})

	// Add a click event handler for the controls button
	const controlsButton = document.getElementById("ShowControlsButton");
	controlsButton.addEventListener("click", () => {
		const sidePanel = document.getElementById("SidePanel");
		const editorContainer = document.getElementById("EditorContainer");
		if (sidePanel.style.display == "none") {
			editorContainer.style.setProperty("display", "none");
			sidePanel.style.setProperty("display", "grid");
		} else {
			editorContainer.style.setProperty("display", "flex");
			sidePanel.style.setProperty("display", "none");
		}
	})

	// Display the notepage information
	displayNotePageInfo(quill, notepage);
}

// Save the current notes of the editor to local storage
function saveText(quill, notepage) {
	// Get the current content and update it
	const currentContents = quill.getContents();
	notepage.content = currentContents;

	// Get the notepages and update them
	const notepages = JSON.parse(localStorage.getItem("NotePages"));
	for (let i = 0; i < notepages.length; i++) {
		if (notepages[i].id == notepage.id) {
			notepages[i] = notepage;
			break;
		}
	}

	// Store the updated notepages
	localStorage.setItem("NotePages", JSON.stringify(notepages));
}

// Display the note page information
function displayNotePageInfo(quill, notepage) {
	document.getElementById("NotepageNameLabel").innerText = "Title: " + notepage.title;
	document.getElementById("ConceptLabel").innerText = "Concept: " + notepage.concept;
	document.getElementById("CategoryLabel").innerText = "Category: " + notepage.category;

	updateWordCount(quill);
}

// Update the word count of the text
function updateWordCount(quill) {
	const wordCount = quill.getText().trim().split(" ").filter((e) => e != "").length;
	document.getElementById("TotalWordsLabel").innerText = "Word Count: " + wordCount;
}

// Get the notepage object that corresponds to the one requested by 
// the query string.
function getNotePageRequested() {
	// Get the query string
	const params = new URLSearchParams(location.search);
	// Get id parameter
	const id = Number.parseInt(params.get("id"));

	// Load the notepages
	const notepages = JSON.parse(localStorage.getItem("NotePages"));

	// Loop over every notepage and find the one with the
	// id requested
	for (let i = 0; i < notepages.length; i++) {
		if (notepages[i].id == id) {
			return notepages[i];
		}
	}
}

// Bookmark the current notepage
function setBookmarkPage(notepage, bookmark) {
	notepage.bookmarked = bookmark;

	let notepages = JSON.parse(localStorage.getItem("NotePages"));
	notepages = notepages.map(page => {
		if (page.id == notepage.id) {
			return notepage;
		} else {
			return page;
		}
	});

	localStorage.setItem("NotePages", JSON.stringify(notepages));
}

// Display a message to the user 
function createLinkToPageModal(notepage, linkablePages) {
	// Create the main modal div 
	const mainModal = document.createElement("div");
	mainModal.classList.add("modal", "fade");
	mainModal.id = "MessageModal";
	mainModal.setAttribute("tabindex", "-1");
	mainModal.setAttribute("aria-labelledby", "ModalTitle")
	mainModal.setAttribute("aria-hidden", "true");

	// Create the dialog of the modal
	const mainDialog = document.createElement("div");
	mainDialog.classList.add("modal-dialog", "modal-dialog-centered");

	mainModal.appendChild(mainDialog); // Add to main modal

	// Create the content of the dialog
	const modalContent = document.createElement("div");
	modalContent.classList.add("modal-content");

	mainDialog.appendChild(modalContent); // Add to dialog

	// Create the header of the content
	const modalHeader = document.createElement("div");
	modalHeader.classList.add("modal-header");

	modalContent.appendChild(modalHeader); // Add header to content

	// Create the title of the header
	const modalTitle = document.createElement("h5");
	modalTitle.classList.add("modal-title");
	modalTitle.id = "ModalTitle";
	modalTitle.innerText = "Link a Notepage";

	modalHeader.appendChild(modalTitle) // Add title to header
	
	// Create the body of the content
	const modalBody = document.createElement("div");
	modalBody.classList.add("modal-body");

	modalContent.appendChild(modalBody) // Add body to content

	// Create the link pages form
	const form = document.createElement("form");

	// Create the label for the drop down for choosing the note to link
	const selectLabel = document.createElement("label");
	selectLabel.for = "LinkPageSelect";
	selectLabel.classList.add("col-form-label")
	selectLabel.innerText = "Select a notepage to link:"

	// Create the dropdown for choosing the note to link
	const select = document.createElement("select");
	select.id = "LinkPageSelect"
	select.classList.add("form-select")

	// Create all Options
	for (let i = 0; i < linkablePages.length; i++) {
		const option = document.createElement("option");
		option.value = linkablePages[i].id;
		option.innerText = linkablePages[i].title;
		select.appendChild(option)
	}
	form.appendChild(selectLabel);
	form.appendChild(select);
	modalBody.appendChild(form);

	// Create the footer of the content
	const modalFooter = document.createElement("div");
	modalFooter.classList.add("modal-footer");

	modalContent.appendChild(modalFooter); // Add footer to content
	
	// Create the link button
	const linkButton = document.createElement("button");
	linkButton.classList.add("btn", "btn-primary");
	linkButton.setAttribute("data-bs-dismiss", "modal");
	linkButton.innerText = "Link Page";
	linkButton.addEventListener("click", () => {
		linkPage(notepage, select.value);

	})

	// Create the close button
	const closeButton = document.createElement("button");
	closeButton.classList.add("btn", "btn-secondary")
	closeButton.setAttribute("data-bs-dismiss", "modal")
	closeButton.innerText = "Close"

	// Add the link page button to footer
	modalFooter.appendChild(linkButton);
	// Add close button to footer 
	modalFooter.appendChild(closeButton); // Add button to footer

	// Delete the modal from DOM when it is closed 
	mainModal.addEventListener("hidden.bs.modal", () => {
		mainModal.remove();
	});

	// Add the dialog element to the body of the document
	document.body.appendChild(mainModal);

	// Create the modal and display it
	const modal = new bootstrap.Modal(mainModal, {
		keyboard: false 
	})

	// Show the modal
	modal.show();
}

// Get the notepages that can be linked
function getLinkablePages(notepage) {
	const notepages = JSON.parse(localStorage.getItem("NotePages"));
	const linkablePages = [];
	for (let i = 0; i < notepages.length; i++) {
		// Check if the notepage can be linked
		const currentPage = notepages[i];
		if (currentPage.id != notepage.id && !notepage.links.includes(currentPage.id)) {
			linkablePages.push(currentPage);
		}
	}
	return linkablePages;
}

// Link a page to the current notepage
function linkPage(notepage, pageId) {
	// Add the pageId to the list of links
	notepage.links.push(Number.parseInt(pageId));

	// Fetch the list of notepages
	let notepages = JSON.parse(localStorage.getItem("NotePages"));
	
	notepages = notepages.map(page => {
		if (page.id == notepage.id) {
			return notepage;
		} else {
			return page;
		}
	});
	localStorage.setItem("NotePages", JSON.stringify(notepages));
}

// Display a message to the user 
function createModal(title, message) {
	// Create the main modal div 
	const mainModal = document.createElement("div");
	mainModal.classList.add("modal", "fade");
	mainModal.id = "MessageModal";
	mainModal.setAttribute("tabindex", "-1");
	mainModal.setAttribute("aria-labelledby", "ModalTitle")
	mainModal.setAttribute("aria-hidden", "true");

	// Create the dialog of the modal
	const mainDialog = document.createElement("div");
	mainDialog.classList.add("modal-dialog", "modal-dialog-centered");

	mainModal.appendChild(mainDialog); // Add to main modal

	// Create the content of the dialog
	const modalContent = document.createElement("div");
	modalContent.classList.add("modal-content");

	mainDialog.appendChild(modalContent); // Add to dialog

	// Create the header of the content
	const modalHeader = document.createElement("div");
	modalHeader.classList.add("modal-header");

	modalContent.appendChild(modalHeader); // Add header to content

	// Create the title of the header
	const modalTitle = document.createElement("h5");
	modalTitle.classList.add("modal-title");
	modalTitle.id = "ModalTitle";
	modalTitle.innerText = title;

	modalHeader.appendChild(modalTitle) // Add title to header
	
	// Create the body of the content
	const modalBody = document.createElement("div");
	modalBody.classList.add("modal-body");

	modalContent.appendChild(modalBody) // Add body to content
	
	// Create the message of the body
	const modalMessage = document.createElement("p");
	modalMessage.innerText = message;

	modalBody.appendChild(modalMessage); // Add message to body

	// Create the footer of the content
	const modalFooter = document.createElement("div");
	modalFooter.classList.add("modal-footer");

	modalContent.appendChild(modalFooter); // Add footer to content
	
	// Create the close button
	const closeButton = document.createElement("button");
	closeButton.classList.add("btn", "btn-primary")
	closeButton.setAttribute("data-bs-dismiss", "modal")
	closeButton.innerText = "Close"

	// Add close button to content
	modalFooter.appendChild(closeButton); // Add button to footer

	// Delete the modal from DOM when it is closed 
	mainModal.addEventListener("hidden.bs.modal", () => {
		mainModal.remove();
	});

	// Add the dialog element to the body of the document
	document.body.appendChild(mainModal);

	// Create the modal and display it
	const modal = new bootstrap.Modal(mainModal, {
		keyboard: false 
	})

	// Show the modal
	modal.show();
}
