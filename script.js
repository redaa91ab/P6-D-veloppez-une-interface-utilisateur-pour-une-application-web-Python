const ButtonSeeMore = document.querySelectorAll(".btn-see-more");

ButtonSeeMore.forEach((button) => {
    button.addEventListener("click", () => {
        const section = button.closest(".category");
        const movieList = section.querySelector(".movie-list");

        movieList.classList.toggle("expanded");
        
        if (movieList.classList.contains("expanded")) {
            button.textContent = "See less";
        } else {
            button.textContent = "See more";
        }
    });
});


async function GetMoviesCategory(url_category, number_of_movies) {
    const movies_url = []
    let response = await fetch(url_category)
    let data = await response.json()
    while (true) { 
        for (const movie of data["results"]) {
            movies_url.push(movie.url)
            if (movies_url.length === number_of_movies) {
                return movies_url
            }
        }
        if (data["next"]) {
            url_category = data["next"]
            response = await fetch(url_category)
            data = await response.json()
        }
        else {
            return movies_url
        }
    }
}

async function GetDetailsMovie(url_movie) {
    let response = await fetch(url_movie)
    let details_movie = await response.json()
    return details_movie
}

async function CreateMoviesBox(genre_html, movies_url) {
    const movie_list_html = genre_html.querySelector('.movie-list')
    movie_list_html.innerHTML = ""
    for (const movie_url of movies_url) {
        let movie_data = await GetDetailsMovie(movie_url)
        movie_list_html.innerHTML += `
        <article class="movie-box">
                <div class="transparent-rectangle">
                    <h4 class="text">${movie_data["title"]}</h4>
                    <button class="text">Details</button>
                </div>
                <img src="${movie_data["image_url"]}"
                onerror="this.src='images/image_not_found.jpeg'">
        </article>
    `
    }
}


async function FillBestMovie(url_api) {
    const movie_url = await GetMoviesCategory(url_api + "?sort_by=-imdb_score", 1)
    const details_movie = await GetDetailsMovie(movie_url)
    const h2 = document.querySelector("#big-movie-box .movie-info h2")
    h2.textContent = details_movie["title"]
    const short_description = document.querySelector("#big-movie-box .movie-info p")
    short_description.textContent = details_movie["description"]
    const image = document.querySelector("#big-movie-box img")
    image.src = details_movie["image_url"]
    image.addEventListener("error", function() {
        image.src = "images/image_not_found.jpeg";
    })
}

async function FillTopRatedMovies(url_api) {
    let movies_url  = await GetMoviesCategory(url_api + "?sort_by=-imdb_score",7)
    movies_url = movies_url.slice(1)
    const top_rated_html = document.querySelector(".top-rated") 
    await CreateMoviesBox(top_rated_html, movies_url)
}

async function FillCategoryNative(url_api) {
    const categories_html = document.querySelectorAll(".native")    
    for (const category_html of categories_html) {
        let category_name = category_html.id
        movies_url = await GetMoviesCategory(url_api + "?sort_by=-imdb_score&genre=" + category_name, 6)
        await CreateMoviesBox(category_html, movies_url)
    }
}

async function FillCategoryOthers(url_api) {
    const categories_html = document.querySelectorAll(".others")    
    for (const category_html of categories_html) {
        const select = category_html.querySelector(".select")
        let category_name = select.value
        console.log(category_name)
        select.addEventListener("change", async function() {
            category_name = select.value
            movies_url = await GetMoviesCategory(url_api + "?sort_by=-imdb_score&genre=" + category_name, 6)
            await CreateMoviesBox(category_html, movies_url)
        })
        movies_url = await GetMoviesCategory(url_api + "?sort_by=-imdb_score&genre=" + category_name, 6)
        await CreateMoviesBox(category_html, movies_url)
    }
}

async function main() {
    const url_api = "http://localhost:8000/api/v1/titles/"
    await FillBestMovie(url_api)
    await FillTopRatedMovies(url_api)
    await FillCategoryNative(url_api)
    await FillCategoryOthers(url_api)
}

main()