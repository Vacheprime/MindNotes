// Create a new notepage
function createNewNotePage() {
	// Validate the name input
	const nameInput = document.getElementById("NameInput");
	if (nameInput.validity.valueMissing) {
		createModal("Invalid Name", "You must enter a name for the Notepage.");
		return;
	}
	// Validate the main concept input
	const conceptInput = document.getElementById("ConceptInput")
	if (conceptInput.validity.valueMissing) {
		createModal("Invalid Concept", "You must enter a concept for the Notepage.");
		return;
	}
	// Validate the category input
	const categoryInput = document.getElementById("CategoryInput")
	if (categoryInput.validity.valueMissing) {
		createModal("Invalid Category", "You must enter a category for the Notepage.");
		return;
	}

	// Get the list of notepages
	let notepages = localStorage.getItem("NotePages");
	if (notepages == null) {
		// Create a new notepage
		const notepages = [
			{
				"id": 1,
				"title": nameInput.value,
				"concept": conceptInput.value,
				"category": categoryInput.value,
				"content": null,
				"links": [],
				"bookmarked": false
			}
		];
		// Store it in local storage
		localStorage.setItem("NotePages", JSON.stringify(notepages));

		// Redirect to view notepage
		const params = new URLSearchParams();
		params.set("id", 1);
		location.href = "view/view_notepage.html?" + params.toString();
	} else {
		// Convert the list of notepages into an object
		notepages = JSON.parse(notepages);

		// Create a new notepage
		const newNotepage = {
			"id": notepages.length + 1,
			"title": nameInput.value,
			"concept": conceptInput.value,
			"category": categoryInput.value,
			"content": null,
			"links": [],
			"bookmarked": false
		};

		// Append the new notepage
		notepages.push(newNotepage);

		// Store it in local storage
		localStorage.setItem("NotePages", JSON.stringify(notepages));

		// Redirect to view notepage
		const params = new URLSearchParams();
		params.set("id", newNotepage.id);
		location.href = "view/view_notepage.html?" + params.toString();
	}
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
