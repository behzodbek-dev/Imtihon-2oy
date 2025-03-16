const elBookList = document.querySelector(".js-book-list");
const elBookTemp = document.querySelector(".js-book-temp").content;
const elSavedBookList = document.querySelector(".js-save-book-list");
const elForm = document.querySelector(".js-book-search-form");
const elBookSearch = elForm.querySelector(".js-book-search-input");
const elMinYearInp = elForm.querySelector(".js-book-min-year-input");
const elMaxYearInp = elForm.querySelector(".js-book-max-year-input");
const elSortBooksByCountry = elForm.querySelector(".js-book-contry-sort-select");
const elSortBooks = elForm.querySelector(".js-book-sort-select");
const elSavedBookCount = document.querySelector(".js-saveBook-status");

books = books.map((item, idx) => {
    item['id'] = idx + 1;
    return item;
});

let store = window.localStorage.getItem("saveBook") ? JSON.parse(window.localStorage.getItem("saveBook")) : [];

const count = (arr) => {
    return elSavedBookCount.textContent = `Saved books : ${arr.length}`;
};

const handleRenderBooks = (arr, {savedList, bookList}) => {
    if(savedList && !bookList) elSavedBookList.innerHTML = '';
    if(!savedList && bookList) elBookList.innerHTML = '';
    const docFragment = document.createDocumentFragment();
    arr.forEach(book => {
        let clone = elBookTemp.cloneNode(true);
        clone.querySelector(".js-book-img").src = book?.imageLink;
        clone.querySelector(".js-book-title").textContent = book?.title;
        clone.querySelector(".js-book-year").textContent = book?.year;
        clone.querySelector(".js-book-pages").textContent = book?.pages;
        clone.querySelector(".js-book-lang").textContent = book?.country;
        clone.querySelector(".js-book-author").textContent = book?.author;
        clone.querySelector(".js-book-about-link").href = book?.link;
        let btn = clone.querySelector(".js-save-book-btn").dataset.id = book?.id;
        docFragment.append(clone);
    });
    if(savedList && !bookList) elSavedBookList.append(docFragment);
    if(!savedList && bookList) elBookList.append(docFragment);
};

function handleSortBooksCountry(arr){
    let countries = [];
    for(let obj of arr){
        if(!(countries.includes(obj.country))) countries.push(obj.country);
    };
    createOption(countries);
};

const createOption = function(arr){
    arr.forEach(country => {
        let newOption = document.createElement('option');
        newOption.value = country;
        newOption.textContent = country;
        elSortBooksByCountry.append(newOption);
    });
};

const handleSearchBooks = function(regex, value){
    let filterBooks;
    const result = books.filter(({author, title, year, country}) => {
        filterBooks = (value == '' || author.match(regex) || title.match(regex)) && 
        (elMinYearInp.value.trim() == '' || elMinYearInp.value.trim() <= year) && 
        (elMaxYearInp.value.trim() == '' || elMaxYearInp.value.trim() >= year) &&
        (elSortBooksByCountry.value == 'all' || country.includes(elSortBooksByCountry.value));
        return filterBooks;
    });
    return result;
};

const sortObj = {
    ['a-z']: function(a, b){
        const titleA = a.title.toLowerCase().charCodeAt(0);
        const titleB = b.title.toLowerCase().charCodeAt(0);
        if(titleA > titleB) return 1
        else return -1
    },
    ['z-a']: function(a, b){
        const titleA = a.title.toLowerCase().charCodeAt(0);
        const titleB = b.title.toLowerCase().charCodeAt(0);
        if(titleA < titleB) return 1
        else return -1
    },
    ['min-page']: (a, b) => {
        const pageA = a.pages;
        const pageB = b.pages;
        if(pageA > pageB) return 1
        else return -1
    },
    ['max-page']: (a, b) => {
        const pageA = a.pages;
        const pageB = b.pages;
        if(pageA < pageB) return 1
        else return -1
    }, 
    ['old-year']: (a, b) => {
        const yearA = new Date(a.year);
        const yearB = new Date(b.year);
        if(yearA > yearB) return 1
        else return -1
    },
    ['new-year']: (a, b) => {
        const yearA = new Date(a.year);
        const yearB = new Date(b.year);
        if(yearA < yearB) return 1
        else return -1
    }
};

function saveFn(evt){
    if(evt.target.matches(".js-save-book-btn")){
        const btnId = evt.target.dataset.id;
        const checkStore = store.some(({id}) => id == btnId);
        if(!checkStore){
            const findBook = books.find(({id}) => id == btnId);
            store.unshift(findBook);
            window.localStorage.setItem('saveBook', JSON.stringify(store));
            handleRenderBooks(store, {savedList: true, bookList: false});
            count(store);
        };
    };
};

function delFn(evt){
    if(evt.target.matches(".js-save-book-btn")){
        const btnId = evt.target.dataset.id;
        const bookIndex = store.findIndex(({id}) => id == btnId);
        store.splice(bookIndex, 1);
        window.localStorage.setItem('saveBook', JSON.stringify(store));
        handleRenderBooks(store, {savedList: true, bookList: false});
        count(store)
    };
};

handleRenderBooks(books, {savedList: false, bookList: true});
handleRenderBooks(store, {savedList: true, bookList: false});
elForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const searchValue = elBookSearch.value.trim();
    const regex = new RegExp(searchValue, 'gi');
    if(elSortBooks.value){
        books.sort(sortObj[elSortBooks.value]);
    };
    const result = handleSearchBooks(regex, searchValue);
    handleRenderBooks(result, {savedList: false, bookList: true});
});
handleSortBooksCountry(books);
elBookList.addEventListener("click", saveFn);
elSavedBookList.addEventListener("click", delFn);
count(store);