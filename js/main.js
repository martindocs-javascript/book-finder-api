const BOOK_API = 'https://www.googleapis.com/books/v1/volumes?q=';
let QUERY_RESULT = 40;

const userInput = document.querySelector('#book-search');
const result = document.querySelector('.result');
const theme = document.querySelector('.theme');
const popupWinContainer = document.querySelector('.popup-container');
const bookInfo = document.querySelector('.book-info');

async function getBooks(str){        
    try{        
        const response = await fetch(`${BOOK_API}${str.target.value}+intitle:${str.target.value}&maxResults=${QUERY_RESULT}`);    
        const responseData = await response.json(); 
        if(str.key === 'Enter'){
            createBookList(responseData);
        }   
    }catch(error){        
        apiError(error);
       
    }    
}

function apiError(e){
    result.innerHTML = `<span class="error">No books found</span>`;
}

function createBookList(books){  
    const bookInfo = Object.values(books)[2].map((items)=>{
        return {
            'title': items.volumeInfo.title,
            'author': items.volumeInfo.hasOwnProperty('authors') ? items.volumeInfo.authors[0] : 'Anonymous',
            'pub': items.volumeInfo.hasOwnProperty('publishedDate') ? items.volumeInfo.publishedDate : '-',
            'desc': items.volumeInfo.hasOwnProperty('description') ? items.volumeInfo.description : 'no description available',
            'isbn10': items.volumeInfo.hasOwnProperty('industryIdentifiers') ? items.volumeInfo.industryIdentifiers[0].identifier : '-',
            'thumbnail': items.volumeInfo.hasOwnProperty('imageLinks') ? items.volumeInfo.imageLinks.smallThumbnail : 'img/no-image.png',
            'ratings': items.volumeInfo.hasOwnProperty('averageRating') ? items.volumeInfo.averageRating : '-',
        }    
    });
    
    updateBookUI(bookInfo);
}

function updateBookInfo(prop, len, ...args){
    let bookUpdates = '';
    this.prop = prop;

    if(prop.length > len){
        bookUpdates = `${this.prop.substring(0, len)}${args}`;
    }else{
        bookUpdates = this.prop;
    }
    // shorten the length of the displayed text
    return bookUpdates;
}

function updateBookUI(info){
    // delete the result content with each new search
    result.innerHTML = '';
    
    info.map((item)=>{ 
        return result.innerHTML += 
        `
        <div class="box">        
            <div class="book-header">
                <i class="star fas fa-star fa-xs"><span class="book-rating">${item.ratings}</span></i>
                <img class="book-img" src="${item.thumbnail}" alt="${item.title}">	
                <div class="book-details">
                    <div class="details-txt">View details</div>
                </div>
            </div>
            <div class="book-content">
                <h2>${updateBookInfo(item.title, 20, '...')}</h3>
                    <h3>by ${item.author}</h2>
                    <div class="book-release">
                        <i class="far fa-calendar-alt"><span class="pub">${updateBookInfo(item.pub, 4)}</span></i>					
                        <p>ISBN<span class="isbn">${updateBookInfo(item.isbn10, 13, '...')}</span></p>						
                    </div>	
            </div>	
            <div class="book-desc">${item.desc}</div>				
        </div>	        
        `;
    });
}

function bookDetails(e){ 
    if(e.target.classList.contains('details-txt')){      
        // 'box' class container 
        const bookContent = e.target.parentNode.parentNode.parentNode;
        const image = bookContent.children[0].children[1];
        const title = image.alt;
        // use 'book-content' class container to get author
        const author = (bookContent.children[1].children[1].innerText).split('by')[1];
        // use 'book-release' class container to get text of release date & ISBN
        const release = (bookContent.children[1].children[2].innerText).split('ISBN');
        const desc = bookContent.children[2].innerText;

        // move modal window up/down when scrolling
        popupWinContainer.style.top = `${50+ window.scrollY}px`;
        document.addEventListener('scroll', ()=>{
            popupWinContainer.style.top = `${50+ window.scrollY}px`;            
        });
        
        popupWinContainer.style.display = 'block';

        popupWinContainer.innerHTML = `                 
            <div class="popup-info">
                <div class="popup-header">
                    <h2>${title}</h2>
                    <i class="close fas fa-times"></i>
                </div>
                <div class="popup-content">
                    <div class="popup-img">
                        <img src="${image.src}" />
                    </div>
                    
                    <div class="popup-author">
                        <p>Author: ${author}</p>
                        <p>Released: ${release[0]}</p>   
                        <p>ISBN 10: ${release[1]}</p>
                    </div>
                                                         
                </div>  
                <div class="popup-desc">${desc}</div>            
            </div>
        `;
    }
}

function setTheme(theme) {
    // override the localStorage theme every time user click button
    localStorage.setItem('theme', theme);
    // returns the Element that is the root element of the document, in our case the <html> element
    document.documentElement.className = theme;    
}

function toggleTheme(){
    // if there is no theme in localStorage or the theme is dark, set theme to light theme
    if(localStorage.getItem('theme') === 'dark-theme'){
        setTheme('light-theme');
    // otherwise set to dark theme
    }else{
        setTheme('dark-theme');
    }
}

userInput.addEventListener('keydown', getBooks);
theme.addEventListener('click', toggleTheme);
result.addEventListener('click', bookDetails);
popupWinContainer.addEventListener('click', (e)=>{
    if(e.target.classList.contains('close')){
        popupWinContainer.style.display = 'none';
    }
});
// setup default theme with each page reload
window.addEventListener('DOMContentLoaded', ()=>{
    if(localStorage.getItem('theme') === 'dark-theme'){
        setTheme('dark-theme');
    }else{
        setTheme('light-theme');
    }
});