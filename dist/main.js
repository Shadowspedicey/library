/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
let formOpened = false;
let infoOpened = false;
const formContainer = document.querySelector("#form-container");
const infoContainer = document.querySelector("#info-container");
let shelfIndex = 1;
let currentShelf = document.querySelector("#shelf" + shelfIndex);

const book1 = new Book("Utopia", "Ahmed Khaled Tawfik", 186, "Yup", "A good book that you should read");
const book2 = new Book("A Brief History of Time", "Stephen Hawking", 256, "Kinda", "Very fucking confusing");

//localStorage.removeItem("books");
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
	inputArray.forEach(input =>
	{
		if (input.id === "submit") return;
		input.value = null;
	});
}
submit.addEventListener("click", () =>
{
	if (!checkForm()) return alert("Please fill all fields.");
	ToggleForm();
	let title = document.querySelector("#title").value;
	let author = document.querySelector("#author").value;
	let nOfPages = document.querySelector("#numberofpages").value;
	let read = document.querySelector("#read").value;
	let notes = document.querySelector("#notes").value;
	let book = new Book(title, author, nOfPages, read, notes);
	AddBookToArray(book);
	ClearForm();
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
				if (domBooksArray[i].dataset.index === books.indexOf(book)) return true;
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
				//fontsize = "xx-small"
				Book.style.fontSize = fontsize + "px";
				Book.textContent.height = 80 + "%";
			}
		}

		AddRemoveButtons(book);
		AddInfoWindows(book);
	});
}

let checkForm = function()
{
	const inputArray = [...document.querySelectorAll("input")];
	for (let i = 0; i < inputArray.length; i++)
	{
		if (inputArray[i].hasAttribute("required"))
		{
			if (inputArray[i].value === "")
			{
				return false;
			}
		}
	}
	return true;
};

function AddRemoveButtons(_book)
{
	const domBooks = document.querySelectorAll(".book");
	
	const removeButtons = document.querySelectorAll("#remove");
	removeButtons.forEach(button =>
	{
		if(button.parentElement.dataset.index !== books.indexOf(_book)) return;
		button.addEventListener("click", (e) =>
		{
			e.stopPropagation();
			e.target.parentElement.remove();
			books.splice(e.target.parentElement.dataset.index, 1);
			console.log(e.target.parentElement.dataset.index);
			localStorage.setItem("books", JSON.stringify(books));
		});
	});

	if (/Mobi|Android/i.test(navigator.userAgent)) 
	{
		const removeButtons = document.querySelectorAll("#remove");
		removeButtons.forEach(button =>
		{
			button.classList.remove("hidden");
		});
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
		if(book.dataset.index !== books.indexOf(_book)) return;
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
		ClearForm();
	}

	if (e.target.id === "info-container") ToggleInfo();
});

AddArraytoLibrary();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IsMEJBQTBCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZUFBZSxRQUFROzs7QUFHL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsdUJBQXVCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBmb3JtT3BlbmVkID0gZmFsc2U7XG5sZXQgaW5mb09wZW5lZCA9IGZhbHNlO1xuY29uc3QgZm9ybUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZm9ybS1jb250YWluZXJcIik7XG5jb25zdCBpbmZvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNpbmZvLWNvbnRhaW5lclwiKTtcbmxldCBzaGVsZkluZGV4ID0gMTtcbmxldCBjdXJyZW50U2hlbGYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NoZWxmXCIgKyBzaGVsZkluZGV4KTtcblxuY29uc3QgYm9vazEgPSBuZXcgQm9vayhcIlV0b3BpYVwiLCBcIkFobWVkIEtoYWxlZCBUYXdmaWtcIiwgMTg2LCBcIll1cFwiLCBcIkEgZ29vZCBib29rIHRoYXQgeW91IHNob3VsZCByZWFkXCIpO1xuY29uc3QgYm9vazIgPSBuZXcgQm9vayhcIkEgQnJpZWYgSGlzdG9yeSBvZiBUaW1lXCIsIFwiU3RlcGhlbiBIYXdraW5nXCIsIDI1NiwgXCJLaW5kYVwiLCBcIlZlcnkgZnVja2luZyBjb25mdXNpbmdcIik7XG5cbi8vbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJib29rc1wiKTtcbmxldCBib29rcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJib29rc1wiKSkgfHwgW2Jvb2sxLCBib29rMl07XG5jb25zb2xlLmxvZyhib29rcyk7XG5cblxuZnVuY3Rpb24gQm9vayh0aXRsZSwgYXV0aG9yLCBuT2ZQYWdlcywgcmVhZCwgbm90ZXMpXG57XG5cdHRoaXMudGl0bGUgPSB0aXRsZTtcblx0dGhpcy5hdXRob3IgPSBhdXRob3I7XG5cdHRoaXMubk9mUGFnZXMgPSBuT2ZQYWdlcztcblx0dGhpcy5yZWFkID0gcmVhZDtcblx0dGhpcy5ub3RlcyA9IG5vdGVzO1xuXG5cdHRoaXMuaGVpZ2h0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMzApICsgNjg7XG5cdHRoaXMuY29sb3IgPSBcInJnYihcIiArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTUpICsgMSkgKyBcIiwgXCIgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU1KSArIDEpICsgXCIsIFwiICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NSkgKyAxKSArIFwiKVwiO1xufVxuXG5mdW5jdGlvbiBBZGRCb29rVG9BcnJheShib29rKVxue1xuXHRib29rcy5wdXNoKGJvb2spO1xuXHRBZGRBcnJheXRvTGlicmFyeSgpO1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJvb2tzXCIsIEpTT04uc3RyaW5naWZ5KGJvb2tzKSk7XG59XG5cbmxldCBhZGRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FkZC1idXR0b25cIik7XG5hZGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XG57XG5cdGZvcm1Db250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGRlblwiKTtcbn0pO1xuXG5sZXQgc3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdWJtaXRcIik7XG5mdW5jdGlvbiBUb2dnbGVGb3JtKClcbntcblx0Zm9ybUNvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIpO1xuXHRmb3JtT3BlbmVkID0gIWZvcm1PcGVuZWQ7XG59XG5mdW5jdGlvbiBDbGVhckZvcm0oKVxue1xuXHRjb25zdCBpbnB1dEFycmF5ID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKV07XG5cdGlucHV0QXJyYXkuZm9yRWFjaChpbnB1dCA9PlxuXHR7XG5cdFx0aWYgKGlucHV0LmlkID09PSBcInN1Ym1pdFwiKSByZXR1cm47XG5cdFx0aW5wdXQudmFsdWUgPSBudWxsO1xuXHR9KTtcbn1cbnN1Ym1pdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cbntcblx0aWYgKCFjaGVja0Zvcm0oKSkgcmV0dXJuIGFsZXJ0KFwiUGxlYXNlIGZpbGwgYWxsIGZpZWxkcy5cIik7XG5cdFRvZ2dsZUZvcm0oKTtcblx0bGV0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aXRsZVwiKS52YWx1ZTtcblx0bGV0IGF1dGhvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXV0aG9yXCIpLnZhbHVlO1xuXHRsZXQgbk9mUGFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI251bWJlcm9mcGFnZXNcIikudmFsdWU7XG5cdGxldCByZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZWFkXCIpLnZhbHVlO1xuXHRsZXQgbm90ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25vdGVzXCIpLnZhbHVlO1xuXHRsZXQgYm9vayA9IG5ldyBCb29rKHRpdGxlLCBhdXRob3IsIG5PZlBhZ2VzLCByZWFkLCBub3Rlcyk7XG5cdEFkZEJvb2tUb0FycmF5KGJvb2spO1xuXHRDbGVhckZvcm0oKTtcbn0pO1xuXG5mdW5jdGlvbiBBZGRBcnJheXRvTGlicmFyeSgpXG57XG5cdGJvb2tzLmZvckVhY2goYm9vayA9PlxuXHR7XG5cdFx0bGV0IEJvb2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGxldCBkb21Cb29rc0FycmF5ID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYm9va1wiKV07XG5cblx0XHRsZXQgZG9lc0Jvb2tFeGlzdCA9IGZ1bmN0aW9uKClcblx0XHR7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRvbUJvb2tzQXJyYXkubGVuZ3RoOyBpKyspXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChkb21Cb29rc0FycmF5W2ldLmRhdGFzZXQuaW5kZXggPT09IGJvb2tzLmluZGV4T2YoYm9vaykpIHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cdFx0aWYgKGRvZXNCb29rRXhpc3QoKSkgeyBCb29rLnJlbW92ZSgpOyByZXR1cm47IH1cblxuXG5cdFx0Qm9vay5kYXRhc2V0LmluZGV4ID0gYm9va3MuaW5kZXhPZihib29rKTtcblx0XHRCb29rLmNsYXNzTGlzdC5hZGQoXCJib29rXCIpO1xuXHRcdEJvb2suc3R5bGUuaGVpZ2h0ID0gYm9vay5oZWlnaHQgKyBcIiVcIjtcblx0XHRCb29rLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJvb2suY29sb3I7XG5cdFx0Qm9vay50ZXh0Q29udGVudCA9IGJvb2sudGl0bGU7XG5cblx0XHRsZXQgcmVtb3ZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cdFx0cmVtb3ZlQnV0dG9uLmlkID0gXCJyZW1vdmVcIjtcblx0XHRyZW1vdmVCdXR0b24uY2xhc3NMaXN0LmFkZChcIm1hdGVyaWFsLWljb25zXCIpO1xuXHRcdHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXHRcdHJlbW92ZUJ1dHRvbi5pbm5lclRleHQgPSBcImNsb3NlXCI7XG5cdFx0Qm9vay5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b24pO1xuXG5cdFx0aWYgKGlzT3ZlcmZsb3duKGN1cnJlbnRTaGVsZikpXG5cdFx0e1xuXHRcdFx0c2hlbGZJbmRleCsrO1xuXHRcdFx0Y3VycmVudFNoZWxmID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzaGVsZlwiICsgc2hlbGZJbmRleCk7XG5cdFx0fVxuXHRcdGN1cnJlbnRTaGVsZi5hcHBlbmRDaGlsZChCb29rKTtcblxuXHRcdGxldCBmb250c2l6ZSA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoQm9vaywgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImZvbnQtc2l6ZVwiKSk7XG5cdFx0aWYgKGlzT3ZlcmZsb3duKEJvb2spKVxuXHRcdHtcblx0XHRcdHdoaWxlIChpc092ZXJmbG93bihCb29rKSlcblx0XHRcdHtcblx0XHRcdFx0Zm9udHNpemUgLT0gMi41O1xuXHRcdFx0XHQvL2ZvbnRzaXplID0gXCJ4eC1zbWFsbFwiXG5cdFx0XHRcdEJvb2suc3R5bGUuZm9udFNpemUgPSBmb250c2l6ZSArIFwicHhcIjtcblx0XHRcdFx0Qm9vay50ZXh0Q29udGVudC5oZWlnaHQgPSA4MCArIFwiJVwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdEFkZFJlbW92ZUJ1dHRvbnMoYm9vayk7XG5cdFx0QWRkSW5mb1dpbmRvd3MoYm9vayk7XG5cdH0pO1xufVxuXG5sZXQgY2hlY2tGb3JtID0gZnVuY3Rpb24oKVxue1xuXHRjb25zdCBpbnB1dEFycmF5ID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKV07XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRBcnJheS5sZW5ndGg7IGkrKylcblx0e1xuXHRcdGlmIChpbnB1dEFycmF5W2ldLmhhc0F0dHJpYnV0ZShcInJlcXVpcmVkXCIpKVxuXHRcdHtcblx0XHRcdGlmIChpbnB1dEFycmF5W2ldLnZhbHVlID09PSBcIlwiKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gQWRkUmVtb3ZlQnV0dG9ucyhfYm9vaylcbntcblx0Y29uc3QgZG9tQm9va3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJvb2tcIik7XG5cdFxuXHRjb25zdCByZW1vdmVCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNyZW1vdmVcIik7XG5cdHJlbW92ZUJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT5cblx0e1xuXHRcdGlmKGJ1dHRvbi5wYXJlbnRFbGVtZW50LmRhdGFzZXQuaW5kZXggIT09IGJvb2tzLmluZGV4T2YoX2Jvb2spKSByZXR1cm47XG5cdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT5cblx0XHR7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0ZS50YXJnZXQucGFyZW50RWxlbWVudC5yZW1vdmUoKTtcblx0XHRcdGJvb2tzLnNwbGljZShlLnRhcmdldC5wYXJlbnRFbGVtZW50LmRhdGFzZXQuaW5kZXgsIDEpO1xuXHRcdFx0Y29uc29sZS5sb2coZS50YXJnZXQucGFyZW50RWxlbWVudC5kYXRhc2V0LmluZGV4KTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYm9va3NcIiwgSlNPTi5zdHJpbmdpZnkoYm9va3MpKTtcblx0XHR9KTtcblx0fSk7XG5cblx0aWYgKC9Nb2JpfEFuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSBcblx0e1xuXHRcdGNvbnN0IHJlbW92ZUJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3JlbW92ZVwiKTtcblx0XHRyZW1vdmVCdXR0b25zLmZvckVhY2goYnV0dG9uID0+XG5cdFx0e1xuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0ZG9tQm9va3MuZm9yRWFjaChib29rID0+IGJvb2suYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCAoKSA9PiBib29rLnF1ZXJ5U2VsZWN0b3IoXCIjcmVtb3ZlXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIikpKTtcblx0ZG9tQm9va3MuZm9yRWFjaChib29rID0+IGJvb2suYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsICgpID0+IGJvb2sucXVlcnlTZWxlY3RvcihcIiNyZW1vdmVcIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKSkpO1xuXG59XG5cbmZ1bmN0aW9uIFRvZ2dsZUluZm8oKVxue1xuXHRpbmZvQ29udGFpbmVyLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIik7XG5cdGluZm9PcGVuZWQgPSAhaW5mb09wZW5lZDtcbn1cbmZ1bmN0aW9uIEFkZEluZm9XaW5kb3dzKF9ib29rKVxue1xuXHRjb25zdCBkb21Cb29rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYm9va1wiKTtcblx0ZG9tQm9va3MuZm9yRWFjaChib29rID0+XG5cdHtcblx0XHRpZihib29rLmRhdGFzZXQuaW5kZXggIT09IGJvb2tzLmluZGV4T2YoX2Jvb2spKSByZXR1cm47XG5cdFx0Ym9vay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cblx0XHR7XG5cdFx0XHRUb2dnbGVJbmZvKCk7XG5cdFx0XHRpbmZvQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIjdGl0bGUtaW5mb1wiKS5pbm5lclRleHQgPSBib29rc1tib29rLmRhdGFzZXQuaW5kZXhdLnRpdGxlO1xuXHRcdFx0aW5mb0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiI2F1dGhvci1pbmZvXCIpLmlubmVyVGV4dCA9IGJvb2tzW2Jvb2suZGF0YXNldC5pbmRleF0uYXV0aG9yO1xuXHRcdFx0aW5mb0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiI25PZlBhZ2VzLWluZm9cIikuaW5uZXJUZXh0ID0gYm9va3NbYm9vay5kYXRhc2V0LmluZGV4XS5uT2ZQYWdlcztcblx0XHRcdGluZm9Db250YWluZXIucXVlcnlTZWxlY3RvcihcIiNyZWFkLWluZm9cIikuaW5uZXJUZXh0ID0gYm9va3NbYm9vay5kYXRhc2V0LmluZGV4XS5yZWFkO1xuXHRcdFx0aW5mb0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiI25vdGVzLWluZm9cIikuaW5uZXJUZXh0ID0gYm9va3NbYm9vay5kYXRhc2V0LmluZGV4XS5ub3Rlcztcblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGlzT3ZlcmZsb3duKGVsZW1lbnQpIFxue1xuXHRyZXR1cm4gZWxlbWVudC5zY3JvbGxIZWlnaHQgPiBlbGVtZW50LmNsaWVudEhlaWdodCB8fCBlbGVtZW50LnNjcm9sbFdpZHRoID4gZWxlbWVudC5jbGllbnRXaWR0aDtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT5cbntcblx0aWYgKGUudGFyZ2V0LmlkID09PSBcImZvcm0tY29udGFpbmVyXCIpIFxuXHR7XG5cdFx0VG9nZ2xlRm9ybSgpO1xuXHRcdENsZWFyRm9ybSgpO1xuXHR9XG5cblx0aWYgKGUudGFyZ2V0LmlkID09PSBcImluZm8tY29udGFpbmVyXCIpIFRvZ2dsZUluZm8oKTtcbn0pO1xuXG5BZGRBcnJheXRvTGlicmFyeSgpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==