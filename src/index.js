const formContainer = document.querySelector("#form-container");
const infoContainer = document.querySelector("#info-container");
const form = document.querySelector("form");
let formOpened = false;
let infoOpened = false;
let shelfIndex = 1;
let currentShelf = document.querySelector("#shelf" + shelfIndex);

const book1 = new Book("Utopia", "Ahmed Khaled Tawfik", 186, "Yup", "A good book that you should read");
const book2 = new Book("A Brief History of Time", "Stephen Hawking", 256, "Kinda", "Very fucking confusing");

localStorage.removeItem("books");
let books = JSON.parse(localStorage.getItem("books")) || [book1, book2];
console.log(books);


function Book(title, author, nOfPages, read, notes)
{
	this.title = title;
	this.author = author;
	this.nOfPages = nOfPages;
	this.read = read;
	this.notes = notes;

	this.height = Math.floor(Math.random() * 30) + 68;
	this.color = "rgb(" + (Math.floor(Math.random() * 255) + 1) + ", " + (Math.floor(Math.random() * 255) + 1) + ", " + (Math.floor(Math.random() * 255) + 1) + ")";
}

function AddBookToArray(book)
{
	books.push(book);
	AddArraytoLibrary();
	localStorage.setItem("books", JSON.stringify(books));
}

let addButton = document.querySelector("#add-button");
addButton.addEventListener("click", () =>
{
	ClearForm();
	formContainer.classList.toggle("hidden");
});

let submit = document.querySelector("#submit");
function ToggleForm()
{
	formContainer.classList.toggle("hidden");
	formOpened = !formOpened;
}
function ClearForm()
{
	const inputArray = [...document.querySelectorAll("input")];
	inputArray.forEach(input => input.value = null);
}
submit.addEventListener("click", () =>
{
	//if (!checkForm()) return alert("Please fill all fields.");
	if (!checkForm()) return;
	let title = document.querySelector("#title").value;
	let author = document.querySelector("#author").value;
	let nOfPages = document.querySelector("#numberofpages").value;
	let read = document.querySelector("#read").value;
	let notes = document.querySelector("#notes").value;
	let book = new Book(title, author, nOfPages, read, notes);
	ToggleForm();
	AddBookToArray(book);
});

function AddArraytoLibrary()
{
	books.forEach(book =>
	{
		let Book = document.createElement("div");
		let domBooksArray = [...document.querySelectorAll(".book")];

		let doesBookExist = function()
		{
			for (let i = 0; i < domBooksArray.length; i++)
			{
				// eslint-disable-next-line eqeqeq
				if (domBooksArray[i].dataset.index == books.indexOf(book)) return true;
			}
			return false;
		};
		if (doesBookExist()) { Book.remove(); return; }


		Book.dataset.index = books.indexOf(book);
		Book.classList.add("book");
		Book.style.height = book.height + "%";
		Book.style.backgroundColor = book.color;
		Book.textContent = book.title;

		let removeButton = document.createElement("span");
		removeButton.id = "remove";
		removeButton.classList.add("material-icons");
		removeButton.classList.add("hidden");
		removeButton.innerText = "close";
		Book.appendChild(removeButton);

		if (isOverflown(currentShelf))
		{
			shelfIndex++;
			currentShelf = document.querySelector("#shelf" + shelfIndex);
		}
		currentShelf.appendChild(Book);

		let fontsize = parseFloat(window.getComputedStyle(Book, null).getPropertyValue("font-size"));
		if (isOverflown(Book))
		{
			while (isOverflown(Book))
			{
				fontsize -= 2.5;
				Book.style.fontSize = fontsize + "px";
				Book.textContent.height = 80 + "%";
			}
		}

		AddRemoveButtons(book);
		AddInfoWindows(book);
	});
}

function checkForm()
{
	for (let i = 0; i < form.querySelectorAll("input").length; i++)
	{
		if (!form.querySelectorAll("input")[i].checkValidity()) 
		{
			ThrowFormError(form.querySelectorAll("input")[i]);
			return false;
		}
	}
	return true;
}
function ThrowFormError(input)
{
	if (input.validity.typeMismatch) input.validity.setCustomValidity("Enter the right input and let's be done with it");
	else if (input.validity.rangeOverflow || input.validity.rangeUnderflow) input.setCustomValidity(`Homie what book are you reading that's ${input.value} pages`);
}

function AddRemoveButtons(_book)
{
	const domBooks = document.querySelectorAll(".book");
	
	const removeButtons = document.querySelectorAll("#remove");
	removeButtons.forEach(button =>
	{
		// eslint-disable-next-line eqeqeq
		if(button.parentElement.dataset.index != books.indexOf(_book)) return;
		button.addEventListener("click", (e) =>
		{
			e.stopPropagation();
			e.target.parentElement.remove();
			books.splice(e.target.parentElement.dataset.index, 1);
			localStorage.setItem("books", JSON.stringify(books));
		});
	});

	if (/Mobi|Android/i.test(navigator.userAgent)) 
	{
		const removeButtons = document.querySelectorAll("#remove");
		removeButtons.forEach(button => button.classList.remove("hidden"));
		return;
	}

	domBooks.forEach(book => book.addEventListener("mouseover", () => book.querySelector("#remove").classList.remove("hidden")));
	domBooks.forEach(book => book.addEventListener("mouseout", () => book.querySelector("#remove").classList.add("hidden")));

}

function ToggleInfo()
{
	infoContainer.classList.toggle("hidden");
	infoOpened = !infoOpened;
}
function AddInfoWindows(_book)
{
	const domBooks = document.querySelectorAll(".book");
	domBooks.forEach(book =>
	{
		// eslint-disable-next-line eqeqeq
		if(book.dataset.index != books.indexOf(_book)) return;
		book.addEventListener("click", () =>
		{
			ToggleInfo();
			infoContainer.querySelector("#title-info").innerText = books[book.dataset.index].title;
			infoContainer.querySelector("#author-info").innerText = books[book.dataset.index].author;
			infoContainer.querySelector("#nOfPages-info").innerText = books[book.dataset.index].nOfPages;
			infoContainer.querySelector("#read-info").innerText = books[book.dataset.index].read;
			infoContainer.querySelector("#notes-info").innerText = books[book.dataset.index].notes;
		});
	});
}

function isOverflown(element) 
{
	return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

window.addEventListener("click", (e) =>
{
	if (e.target.id === "form-container") 
	{
		ToggleForm();
	}

	if (e.target.id === "info-container") ToggleInfo();
});

AddArraytoLibrary();
