let formOpened = false;
let infoOpened = false;
const formContainer = document.querySelector("#form-container");
const infoContainer = document.querySelector("#info-container");
let shelfIndex = 1;
let currentShelf = document.querySelector("#shelf" + shelfIndex);

const book1 = new Book("kosm", "ana", 255, "nope");
const book2 = new Book("a7a", "m4 3arf", 125, "yes");
let books = [];

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
  AddInfoWindows(book);
}
AddBookToArray(book1)
AddBookToArray(book2);

let addButton = document.querySelector("#add-button");
addButton.addEventListener("click", () =>
{
  formContainer.classList.toggle("hidden");
});

let inputs =
{
}

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
          if (domBooksArray[i].dataset.index == books.indexOf(book)) return true;
        }
        return false;
      }
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
      AddRemoveButtons();
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
        return false
      }
    }
  }
  return true;
}

function AddRemoveButtons()
{
  const domBooks = document.querySelectorAll(".book");
  domBooks.forEach(book => book.addEventListener("mouseover", () => book.querySelector("#remove").classList.remove("hidden")));
  domBooks.forEach(book => book.addEventListener("mouseout", () => book.querySelector("#remove").classList.add("hidden")));

  const removeButtons = document.querySelectorAll("#remove");
  removeButtons.forEach(button =>
    {
      button.addEventListener("click", (e) =>
      {
        e.stopPropagation();
        button.parentElement.remove();
        books.splice(button.parentElement.dataset.index, 1);
      });
    });
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
console.log(isOverflown(currentShelf));

window.addEventListener("click", (e) =>
{
  if (e.target.id === "form-container") 
  {
    ToggleForm();
    ClearForm();
  }

  if (e.target.id === "info-container") ToggleInfo();
});