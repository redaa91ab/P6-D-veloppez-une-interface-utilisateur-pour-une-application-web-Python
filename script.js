async function GetBestMovies() {
    const best_movies = []
    let url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
    let response = await fetch(url)
    let data = await response.json()
    while (true) { 
        for (const movie of data["results"]) {
            best_movies.push(movie.url)
            if (best_movies.length === 7) {
                break
            }
        }
        if (data["next"] && best_movies.length < 7 ) {
            url = data["next"]
            response = await fetch(url)
            data = await response.json()
        }
        else {
            break
        }
    }
    return best_movies
}


async function print() {
    const best_movies = await GetBestMovies()
    console.log(best_movies)
}

print()