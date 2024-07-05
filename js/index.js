"use strict"

let gamesList = document.querySelector(`.games-list`);
let details = document.querySelector(`.details`);
let categories = document.querySelectorAll(`.nav-link`);
let boxes ;
let closeBTN = document.querySelector(`.btn-close`);
console.log(closeBTN);
let cateList = [`mmorpg`,`shooter`,`sailing`,`permadeath`,`superhero`,`pixel`];
let randomNumber = Math.floor(Math.random() * cateList.length)

class Apis  {
    
    constructor (category, element, games) {
        this.category = category;
        this.element = element;
        this.games = games;
    }

    showDetails() {
        gamesList.classList.add(`d-none`);
        details.classList.remove(`d-none`);
    }

    hideDetails () {
        gamesList.classList.remove(`d-none`);
        details.classList.add(`d-none`);
    }
    loading () {
        let lodaingContainer = document.querySelector(`.loading-container`)
        let loadingDivs = lodaingContainer.children;
        let randomload = Math.floor(Math.random() * loadingDivs.length);
        for (let i = 0 ; i < loadingDivs.length;i++) {
            if(!loadingDivs[i].classList.contains(`d-none`)) {
                loadingDivs[i].classList.add(`d-none`)
            }
        }
        document.body.classList.toggle(`overflow-y-hidden`);
        lodaingContainer.classList.toggle(`d-none`);
        loadingDivs[randomload].classList.toggle(`d-none`)
    }

    async displayGames() {
        document.title = `home`;
        this.loading();
        let response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games?category=${this.category}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '0084dacfb0msh8efecae4ca7b4eap1640c5jsn2da6b3366800',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }});
       let data =  await response.json();
        let container = ``;
        for(let i = 0; i < data.length; i++) {
            
            container += `<div class="col" data-id="${data[i].id}">
                        <div class="card grayscaled bg-transparent h-100">
                            <div class="card-body">
                                <figure>
                                    <img  src="${data[i].thumbnail}" alt="${data[i].title} image"/>
                                </figure>
                                <figcaption>
                                    <div class="d-flex justify-content-between align-items-center text-capitalize">
                                        <h2 class="my-small ">${data[i].title}</h2>
                                        <span class="bg-primary my-small p-2 rounded-2">free</span>
                                    </div>
                                    <p class="card-text text-center opacity-50 small">${(data[i].short_description).split(` `).splice(0, 8).join(` `)}</p>
                                </figcaption>
                            </div>
                            <footer class="card-footer my-small d-flex align-items-center justify-content-between">
                                <span class="p-1 my-small">${data[i].genre}</span>
                                <span class="p-1 my-small">${data[i].platform}</span>
                            </footer>
                        </div>
                    </div>`;

        }
        gamesContainer.innerHTML = container;
        boxes = document.querySelectorAll(`.col`);
        console.log(boxes);
        this.displayDetails();
        this.loading();
    }
    async displayDetails() {
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].addEventListener(`click`, async e => { 
                this.loading();
                this.element= boxes[i].getAttribute(`data-id`);
                console.log(this.element);
                let elements = document.querySelector(`.details .col-md-8`).children;
                let response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${this.element}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '0084dacfb0msh8efecae4ca7b4eap1640c5jsn2da6b3366800',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }})
            let data = await response.json();
            document.title = `${data.title}`;
            document.querySelector(`.details .col-md-4`).children[0].src = data.thumbnail;
            elements[0].innerHTML = `title: ${data.title}`;
            elements[1].children[0].innerHTML = data.genre;
            elements[2].children[0].innerHTML = data.platform;
            elements[3].children[0].innerHTML = data.status;
            elements[4].innerHTML = data.description;
            console.log(data.game_url);
            elements[5].href = data.game_url;
            this.showDetails();
            this.loading();
            closeBTN.addEventListener(`click`,  _ => {
                document.title = `home`;
                this.hideDetails();
            });
        })
        }
    }
}


let list = new Apis(cateList[randomNumber]);
document.querySelector(`a.active`).classList.remove(`active`);
categories[randomNumber].classList.add(`active`);

list.hideDetails();
list.displayGames();



for (let i = 0 ; i < categories.length;i++) {
    categories[i].addEventListener(`click` , e => {
        document.querySelector(`a.active`).classList.remove(`active`);
        e.target.classList.add(`active`);
        list.category = e.target.innerHTML;
        list.displayGames();

    })
}

