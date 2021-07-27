/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9saWJyYXJ5Ly4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IsMEJBQTBCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixlQUFlLFFBQVE7OztBQUcvQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLDJDQUEyQztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwySUFBMkksWUFBWTtBQUN2Sjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZvcm1Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Zvcm0tY29udGFpbmVyXCIpO1xuY29uc3QgaW5mb0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5mby1jb250YWluZXJcIik7XG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImZvcm1cIik7XG5sZXQgZm9ybU9wZW5lZCA9IGZhbHNlO1xubGV0IGluZm9PcGVuZWQgPSBmYWxzZTtcbmxldCBzaGVsZkluZGV4ID0gMTtcbmxldCBjdXJyZW50U2hlbGYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NoZWxmXCIgKyBzaGVsZkluZGV4KTtcblxuY29uc3QgYm9vazEgPSBuZXcgQm9vayhcIlV0b3BpYVwiLCBcIkFobWVkIEtoYWxlZCBUYXdmaWtcIiwgMTg2LCBcIll1cFwiLCBcIkEgZ29vZCBib29rIHRoYXQgeW91IHNob3VsZCByZWFkXCIpO1xuY29uc3QgYm9vazIgPSBuZXcgQm9vayhcIkEgQnJpZWYgSGlzdG9yeSBvZiBUaW1lXCIsIFwiU3RlcGhlbiBIYXdraW5nXCIsIDI1NiwgXCJLaW5kYVwiLCBcIlZlcnkgZnVja2luZyBjb25mdXNpbmdcIik7XG5cbmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYm9va3NcIik7XG5sZXQgYm9va3MgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYm9va3NcIikpIHx8IFtib29rMSwgYm9vazJdO1xuY29uc29sZS5sb2coYm9va3MpO1xuXG5cbmZ1bmN0aW9uIEJvb2sodGl0bGUsIGF1dGhvciwgbk9mUGFnZXMsIHJlYWQsIG5vdGVzKVxue1xuXHR0aGlzLnRpdGxlID0gdGl0bGU7XG5cdHRoaXMuYXV0aG9yID0gYXV0aG9yO1xuXHR0aGlzLm5PZlBhZ2VzID0gbk9mUGFnZXM7XG5cdHRoaXMucmVhZCA9IHJlYWQ7XG5cdHRoaXMubm90ZXMgPSBub3RlcztcblxuXHR0aGlzLmhlaWdodCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMwKSArIDY4O1xuXHR0aGlzLmNvbG9yID0gXCJyZ2IoXCIgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU1KSArIDEpICsgXCIsIFwiICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NSkgKyAxKSArIFwiLCBcIiArIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTUpICsgMSkgKyBcIilcIjtcbn1cblxuZnVuY3Rpb24gQWRkQm9va1RvQXJyYXkoYm9vaylcbntcblx0Ym9va3MucHVzaChib29rKTtcblx0QWRkQXJyYXl0b0xpYnJhcnkoKTtcblx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJib29rc1wiLCBKU09OLnN0cmluZ2lmeShib29rcykpO1xufVxuXG5sZXQgYWRkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZGQtYnV0dG9uXCIpO1xuYWRkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9Plxue1xuXHRDbGVhckZvcm0oKTtcblx0Zm9ybUNvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZGVuXCIpO1xufSk7XG5cbmxldCBzdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3N1Ym1pdFwiKTtcbmZ1bmN0aW9uIFRvZ2dsZUZvcm0oKVxue1xuXHRmb3JtQ29udGFpbmVyLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRkZW5cIik7XG5cdGZvcm1PcGVuZWQgPSAhZm9ybU9wZW5lZDtcbn1cbmZ1bmN0aW9uIENsZWFyRm9ybSgpXG57XG5cdGNvbnN0IGlucHV0QXJyYXkgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpXTtcblx0aW5wdXRBcnJheS5mb3JFYWNoKGlucHV0ID0+IGlucHV0LnZhbHVlID0gbnVsbCk7XG59XG5zdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XG57XG5cdC8vaWYgKCFjaGVja0Zvcm0oKSkgcmV0dXJuIGFsZXJ0KFwiUGxlYXNlIGZpbGwgYWxsIGZpZWxkcy5cIik7XG5cdGlmICghY2hlY2tGb3JtKCkpIHJldHVybjtcblx0bGV0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aXRsZVwiKS52YWx1ZTtcblx0bGV0IGF1dGhvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXV0aG9yXCIpLnZhbHVlO1xuXHRsZXQgbk9mUGFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI251bWJlcm9mcGFnZXNcIikudmFsdWU7XG5cdGxldCByZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZWFkXCIpLnZhbHVlO1xuXHRsZXQgbm90ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25vdGVzXCIpLnZhbHVlO1xuXHRsZXQgYm9vayA9IG5ldyBCb29rKHRpdGxlLCBhdXRob3IsIG5PZlBhZ2VzLCByZWFkLCBub3Rlcyk7XG5cdFRvZ2dsZUZvcm0oKTtcblx0QWRkQm9va1RvQXJyYXkoYm9vayk7XG59KTtcblxuZnVuY3Rpb24gQWRkQXJyYXl0b0xpYnJhcnkoKVxue1xuXHRib29rcy5mb3JFYWNoKGJvb2sgPT5cblx0e1xuXHRcdGxldCBCb29rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRsZXQgZG9tQm9va3NBcnJheSA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJvb2tcIildO1xuXG5cdFx0bGV0IGRvZXNCb29rRXhpc3QgPSBmdW5jdGlvbigpXG5cdFx0e1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkb21Cb29rc0FycmF5Lmxlbmd0aDsgaSsrKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRcdGlmIChkb21Cb29rc0FycmF5W2ldLmRhdGFzZXQuaW5kZXggPT0gYm9va3MuaW5kZXhPZihib29rKSkgcmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblx0XHRpZiAoZG9lc0Jvb2tFeGlzdCgpKSB7IEJvb2sucmVtb3ZlKCk7IHJldHVybjsgfVxuXG5cblx0XHRCb29rLmRhdGFzZXQuaW5kZXggPSBib29rcy5pbmRleE9mKGJvb2spO1xuXHRcdEJvb2suY2xhc3NMaXN0LmFkZChcImJvb2tcIik7XG5cdFx0Qm9vay5zdHlsZS5oZWlnaHQgPSBib29rLmhlaWdodCArIFwiJVwiO1xuXHRcdEJvb2suc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYm9vay5jb2xvcjtcblx0XHRCb29rLnRleHRDb250ZW50ID0gYm9vay50aXRsZTtcblxuXHRcdGxldCByZW1vdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0XHRyZW1vdmVCdXR0b24uaWQgPSBcInJlbW92ZVwiO1xuXHRcdHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwibWF0ZXJpYWwtaWNvbnNcIik7XG5cdFx0cmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cdFx0cmVtb3ZlQnV0dG9uLmlubmVyVGV4dCA9IFwiY2xvc2VcIjtcblx0XHRCb29rLmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbik7XG5cblx0XHRpZiAoaXNPdmVyZmxvd24oY3VycmVudFNoZWxmKSlcblx0XHR7XG5cdFx0XHRzaGVsZkluZGV4Kys7XG5cdFx0XHRjdXJyZW50U2hlbGYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NoZWxmXCIgKyBzaGVsZkluZGV4KTtcblx0XHR9XG5cdFx0Y3VycmVudFNoZWxmLmFwcGVuZENoaWxkKEJvb2spO1xuXG5cdFx0bGV0IGZvbnRzaXplID0gcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShCb29rLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1zaXplXCIpKTtcblx0XHRpZiAoaXNPdmVyZmxvd24oQm9vaykpXG5cdFx0e1xuXHRcdFx0d2hpbGUgKGlzT3ZlcmZsb3duKEJvb2spKVxuXHRcdFx0e1xuXHRcdFx0XHRmb250c2l6ZSAtPSAyLjU7XG5cdFx0XHRcdEJvb2suc3R5bGUuZm9udFNpemUgPSBmb250c2l6ZSArIFwicHhcIjtcblx0XHRcdFx0Qm9vay50ZXh0Q29udGVudC5oZWlnaHQgPSA4MCArIFwiJVwiO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdEFkZFJlbW92ZUJ1dHRvbnMoYm9vayk7XG5cdFx0QWRkSW5mb1dpbmRvd3MoYm9vayk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjaGVja0Zvcm0oKVxue1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpLmxlbmd0aDsgaSsrKVxuXHR7XG5cdFx0aWYgKCFmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVtpXS5jaGVja1ZhbGlkaXR5KCkpIFxuXHRcdHtcblx0XHRcdFRocm93Rm9ybUVycm9yKGZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpW2ldKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBUaHJvd0Zvcm1FcnJvcihpbnB1dClcbntcblx0aWYgKGlucHV0LnZhbGlkaXR5LnR5cGVNaXNtYXRjaCkgaW5wdXQudmFsaWRpdHkuc2V0Q3VzdG9tVmFsaWRpdHkoXCJFbnRlciB0aGUgcmlnaHQgaW5wdXQgYW5kIGxldCdzIGJlIGRvbmUgd2l0aCBpdFwiKTtcblx0ZWxzZSBpZiAoaW5wdXQudmFsaWRpdHkucmFuZ2VPdmVyZmxvdyB8fCBpbnB1dC52YWxpZGl0eS5yYW5nZVVuZGVyZmxvdykgaW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkoYEhvbWllIHdoYXQgYm9vayBhcmUgeW91IHJlYWRpbmcgdGhhdCdzICR7aW5wdXQudmFsdWV9IHBhZ2VzYCk7XG59XG5cbmZ1bmN0aW9uIEFkZFJlbW92ZUJ1dHRvbnMoX2Jvb2spXG57XG5cdGNvbnN0IGRvbUJvb2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib29rXCIpO1xuXHRcblx0Y29uc3QgcmVtb3ZlQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcmVtb3ZlXCIpO1xuXHRyZW1vdmVCdXR0b25zLmZvckVhY2goYnV0dG9uID0+XG5cdHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0aWYoYnV0dG9uLnBhcmVudEVsZW1lbnQuZGF0YXNldC5pbmRleCAhPSBib29rcy5pbmRleE9mKF9ib29rKSkgcmV0dXJuO1xuXHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+XG5cdFx0e1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XG5cdFx0XHRib29rcy5zcGxpY2UoZS50YXJnZXQucGFyZW50RWxlbWVudC5kYXRhc2V0LmluZGV4LCAxKTtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYm9va3NcIiwgSlNPTi5zdHJpbmdpZnkoYm9va3MpKTtcblx0XHR9KTtcblx0fSk7XG5cblx0aWYgKC9Nb2JpfEFuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSBcblx0e1xuXHRcdGNvbnN0IHJlbW92ZUJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3JlbW92ZVwiKTtcblx0XHRyZW1vdmVCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRkb21Cb29rcy5mb3JFYWNoKGJvb2sgPT4gYm9vay5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsICgpID0+IGJvb2sucXVlcnlTZWxlY3RvcihcIiNyZW1vdmVcIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKSkpO1xuXHRkb21Cb29rcy5mb3JFYWNoKGJvb2sgPT4gYm9vay5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKCkgPT4gYm9vay5xdWVyeVNlbGVjdG9yKFwiI3JlbW92ZVwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpKSk7XG5cbn1cblxuZnVuY3Rpb24gVG9nZ2xlSW5mbygpXG57XG5cdGluZm9Db250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGRlblwiKTtcblx0aW5mb09wZW5lZCA9ICFpbmZvT3BlbmVkO1xufVxuZnVuY3Rpb24gQWRkSW5mb1dpbmRvd3MoX2Jvb2spXG57XG5cdGNvbnN0IGRvbUJvb2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib29rXCIpO1xuXHRkb21Cb29rcy5mb3JFYWNoKGJvb2sgPT5cblx0e1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRpZihib29rLmRhdGFzZXQuaW5kZXggIT0gYm9va3MuaW5kZXhPZihfYm9vaykpIHJldHVybjtcblx0XHRib29rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxuXHRcdHtcblx0XHRcdFRvZ2dsZUluZm8oKTtcblx0XHRcdGluZm9Db250YWluZXIucXVlcnlTZWxlY3RvcihcIiN0aXRsZS1pbmZvXCIpLmlubmVyVGV4dCA9IGJvb2tzW2Jvb2suZGF0YXNldC5pbmRleF0udGl0bGU7XG5cdFx0XHRpbmZvQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIjYXV0aG9yLWluZm9cIikuaW5uZXJUZXh0ID0gYm9va3NbYm9vay5kYXRhc2V0LmluZGV4XS5hdXRob3I7XG5cdFx0XHRpbmZvQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIjbk9mUGFnZXMtaW5mb1wiKS5pbm5lclRleHQgPSBib29rc1tib29rLmRhdGFzZXQuaW5kZXhdLm5PZlBhZ2VzO1xuXHRcdFx0aW5mb0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiI3JlYWQtaW5mb1wiKS5pbm5lclRleHQgPSBib29rc1tib29rLmRhdGFzZXQuaW5kZXhdLnJlYWQ7XG5cdFx0XHRpbmZvQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIjbm90ZXMtaW5mb1wiKS5pbm5lclRleHQgPSBib29rc1tib29rLmRhdGFzZXQuaW5kZXhdLm5vdGVzO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gaXNPdmVyZmxvd24oZWxlbWVudCkgXG57XG5cdHJldHVybiBlbGVtZW50LnNjcm9sbEhlaWdodCA+IGVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IGVsZW1lbnQuc2Nyb2xsV2lkdGggPiBlbGVtZW50LmNsaWVudFdpZHRoO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9Plxue1xuXHRpZiAoZS50YXJnZXQuaWQgPT09IFwiZm9ybS1jb250YWluZXJcIikgXG5cdHtcblx0XHRUb2dnbGVGb3JtKCk7XG5cdH1cblxuXHRpZiAoZS50YXJnZXQuaWQgPT09IFwiaW5mby1jb250YWluZXJcIikgVG9nZ2xlSW5mbygpO1xufSk7XG5cbkFkZEFycmF5dG9MaWJyYXJ5KCk7XG4iXSwic291cmNlUm9vdCI6IiJ9