const movieForm = gE("movieForm");
const model = gE("model");
const updateMovBtn = gE("updateMovBtn");
const modelButton = gE("modelButton");
const addMovBtn = gE("addMovBtn");
const clodeModel = [...document.querySelectorAll(".close-model")];


const baseUrl = `https://posts-crud-c2796-default-rtdb.firebaseio.com`;
const moviesUrl = `${baseUrl}/movies.json`;


function gE(id) {
  return document.getElementById(id);
}



function handleSpinner(text = "") {
  const spinner = gE("spinner");
  spinner.innerHTML = `
    <button class="btn bg-white btn-white text-dark btn-sm" type="button" disabled>
      <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbsp;
      ${text}...
    </button>
  `;
  spinner.classList.toggle("d-none");
}



function snackBar(title, msg, icon) {
  Swal.fire({
    title: title,
    text: msg,
    icon: icon,
    timer: 3000,
  });
}

const localState = {
  moviesArray: [],
  editId: null,
};


//nested obj to array converter function 
function nesObjToArr(obj) {
  localState.moviesArray = Object.entries(obj).map(obj => ({ ...obj[1], id: obj[0] })).reverse();
}

//handle rating
function setRating(rating) {
  if (rating > 7) return "badge-success";
  if (rating >= 5) return "badge-warning";
  return "badge-danger"
}

//generic function for fetch
function makeApiRequest(url, method = "GET", body) {
  body = body ? JSON.stringify(body) : null;
  return fetch(url, {
    method: method,
    body: body,
    headers: {
      "Content-Type": "application/json",
      "security": "JWT Token"
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else{
        throw new Error(`Errro while making api call : ${res.status}`);
      }
    })
}


//read

function fetchMovies() {
  handleSpinner("Loading...")
  makeApiRequest(moviesUrl)
    .then(data => {
      nesObjToArr(data);
      renderMovies(localState.moviesArray)
    })
    .catch(err => {
      snackBar(`${err} : ${err.message}`, "error");
    })
    .finally(() => {
      handleSpinner()
    })
}

fetchMovies()
function renderMovies(arr) {
  const allMoviesContainer = document.getElementById("allMoviesContainer");
  let res = "";
  arr.forEach((movie) => {
    res += `
          <div class="col-md-3 mb-3" id="${movie.id}">
            <div class="card h-100" id="movieCard">
              <div class="card-header row">
                <div class="col-10">
                  <h3 id="movieTitle" class="m-0">${movie.title}</h3>
                </div>
                <div class="col-2">
                  <h4 class="badge ${setRating(movie.rating)} align-self-center p-2">
                    <span>${movie.rating}</span>
                  </h4>
                </div>
              </div>
              <small class="text-left pl-3">
              Updated at : ${movie.updatedAt ? new Date(movie.updatedAt).toLocaleString("en-IN") : "Not updated yet"}</small>
              
              <small class="text-left pl-3">
              Created at &nbsp;: ${new Date(movie.createdAt).toLocaleString("en-IN")} 
              </small>
              <div class="card-body p-2" id="movie-cardBody">
                <figure>
                  <img
                    src="${movie.poster}"
                    alt="${movie.title}"
                  />

                  <figcaption>
                    <h3>${movie.title}</h3>
                    <p><strong>Release Date : </strong>${movie.releaseDate}</p>
                    <h5 class="text-info"><strong>Genre : </strong>${movie.genre}</h5>
                    <p>
                      ${movie.description}
                    </p>
                  </figcaption>
                </figure>
              </div>

              <div class="card-footer d-flex justify-content-between">
                <button onclick="onEdit(this)" class="btn btn-sm sec-btn">Edit</button>
                <button onclick="onDelete(this)" class="btn btn-sm pri-btn">Remove</button>
              </div>
            </div>
          </div>
      `;
    allMoviesContainer.innerHTML = res;
  });
}




//create
function onSubmit(event) {
  event.preventDefault();
  console.log("djfkdjfkdjkfjdkfdf");
  const titleControl = gE("title");
  const allMoviesContainer = gE("allMoviesContainer");
  const genreControl = gE("genre");
  const posterControl = gE("poster");
  const ratingControl = gE("rating");
  const releaseDateControl = gE("releaseDate");
  const descriptionControl = gE("description");
  const newMovie = {
    createdAt: Date.now(),
    updatedAt: null,
    description: descriptionControl.value,
    genre: genreControl.value,
    poster: posterControl.value,
    rating: ratingControl.value,
    releaseDate: releaseDateControl.value || "Unknown",
    title: titleControl.value,
  }
  handleSpinner("Adding Movie")
  makeApiRequest(moviesUrl, "POST", newMovie)
    .then(res => {
      onModelToggle();
      newMovie.id = res.name;
      localState.moviesArray.unshift(newMovie);
      let newMovieCard = document.createElement("div");
      newMovieCard.className = "col-md-3 mb-3";
      newMovieCard.id = res.name;
      newMovieCard.innerHTML = `
          <div class="card h-100" id="movieCard">
              <div class="card-header row">
                <div class="col-10">
                  <h3 id="movieTitle" class="m-0">${newMovie.title}</h3>
                </div>
                <div class="col-2">
                  <h4 class="badge ${setRating(newMovie.rating)} align-self-center p-2">
                    <span>${newMovie.rating}</span>
                  </h4>
                </div>
              </div>
              <small class="text-left pl-3">
              Updated at : ${newMovie.updatedAt ? new Date(newMovie.updatedAt).toLocaleString("en-IN") : "Not updated yet"}</small>
              
              <small class="text-left pl-3">
              Created at &nbsp;: ${new Date(newMovie.createdAt).toLocaleString("en-IN")} 
              </small>
              <div class="card-body p-2" id="newMovie-cardBody">
                <figure>
                  <img
                    src="${newMovie.poster}"
                    alt="${newMovie.title}"
                  />

                  <figcaption>
                    <h3>${newMovie.title}</h3>
                    <p><strong>Release Date : </strong>${newMovie.releaseDate}</p>
                    <h5 class="text-info"><strong>Genre : </strong>${newMovie.genre}</h5>
                    <p>
                      ${newMovie.description}
                    </p>
                  </figcaption>
                </figure>
              </div>

              <div class="card-footer d-flex justify-content-between">
                <button onclick="onEdit(this)" class="btn btn-sm sec-btn">Edit</button>
                <button onclick="onDelete(this)" class="btn btn-sm pri-btn">Remove</button>
              </div>
            </div>
    `;
      allMoviesContainer.prepend(newMovieCard);
      snackBar("Added",`New movie with id : ${res.name} added successfylly...`, "success");

    })
    .catch(err => {
      snackBar(`${err} : ${err.message}`, "error");
    })
    .finally(() => {
      handleSpinner();
    })

}

//edit
function onEdit(ele) {
  const titleControl = gE("title");
  const genreControl = gE("genre");
  const posterControl = gE("poster");
  const ratingControl = gE("rating");
  const releaseDateControl = gE("releaseDate");
  const descriptionControl = gE("description");
  const addMovBtn = gE("addMovBtn");
  const changeUpdateAddText = gE("movieAddOrUpdateText");
  onModelToggle()
  const editId = ele.closest(".col-md-3").id;
  const editObj = localState.moviesArray.find(m => m.id === editId);
  localState.editId = editId;
  titleControl.value = editObj.title;
  genreControl.value = editObj.genre;
  posterControl.value = editObj.poster;
  ratingControl.value = editObj.rating;
  releaseDateControl.value = editObj.releaseDate;
  descriptionControl.value = editObj.description;
  addMovBtn.classList.add("d-none");
  updateMovBtn.classList.remove("d-none");
  changeUpdateAddText.innerText = "Update Movie Details";
}

//update
function onUpdate() {
  const titleControl = gE("title");
  const genreControl = gE("genre");
  const posterControl = gE("poster");
  const ratingControl = gE("rating");
  const releaseDateControl = gE("releaseDate");
  const descriptionControl = gE("description");

  const udpateId = localState.editId;
  const existingObj = localState.moviesArray.find(m => m.id === udpateId);
  const updateUrl = `${baseUrl}/movies/${udpateId}.json`;
  const updatedObj = {
    ...existingObj,
    updatedAt: Date.now(),
    description: descriptionControl.value,
    genre: genreControl.value,
    poster: posterControl.value,
    rating: ratingControl.value,
    releaseDate: releaseDateControl.value || "Unknown",
    title: titleControl.value,
  }
  handleSpinner("Updating Movie...");
  makeApiRequest(updateUrl, "PATCH", updatedObj)
  .then(res => {
    onModelToggle();
    let updateIndex = localState.moviesArray.findIndex(m => m.id === udpateId);
    localState.moviesArray[updateIndex] = updatedObj;
    let updateMovieCard = gE(udpateId);
    updateMovieCard.innerHTML = `
            <div class="card h-100" id="movieCard">
              <div class="card-header row">
                <div class="col-10">
                  <h3 id="movieTitle" class="m-0">${updatedObj.title}</h3>
                </div>
                <div class="col-2">
                  <h4 class="badge ${setRating(updatedObj.rating)} align-self-center p-2">
                    <span>${updatedObj.rating}</span>
                  </h4>
                </div>
              </div>
              <small class="text-left pl-3">
              Updated at : ${updatedObj.updatedAt ? new Date(updatedObj.updatedAt).toLocaleString("en-IN") : "Not updated yet"}</small>
              
              <small class="text-left pl-3">
              Created at &nbsp;: ${new Date(updatedObj.createdAt).toLocaleString("en-IN")} 
              </small>
              <div class="card-body p-2" id="updatedObj-cardBody">
                <figure>
                  <img
                    src="${updatedObj.poster}"
                    alt="${updatedObj.title}"
                  />

                  <figcaption>
                    <h3>${updatedObj.title}</h3>
                    <p><strong>Release Date : </strong>${updatedObj.releaseDate}</p>
                    <h5 class="text-info"><strong>Genre : </strong>${updatedObj.genre}</h5>
                    <p>
                      ${updatedObj.description}
                    </p>
                  </figcaption>
                </figure>
              </div>

              <div class="card-footer d-flex justify-content-between">
                <button onclick="onEdit(this)" class="btn btn-sm sec-btn">Edit</button>
                <button onclick="onDelete(this)" class="btn btn-sm pri-btn">Remove</button>
              </div>
            </div>
    `;
    
    snackBar("Updated",`Moive with id : ${udpateId} updated successfully...`, "success");
  })
  .catch(err => {
    snackBar(`${err} : ${err.message}`, "error");
    console.log(err);
  })
  .finally(() => {
    handleSpinner();
  })
}


//delete 
function onDelete(ele) {
  const deleteId = ele.closest(".col-md-3").id;
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this movie",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      const deleteUrl = `${baseUrl}/movies/${deleteId}.json`;
      handleSpinner("Deleting...");
      makeApiRequest(deleteUrl, "DELETE")
      .then(res => {
        const deleteIndex = localState.moviesArray.findIndex(m => m.id === deleteId);
        localState.moviesArray.splice(deleteIndex,1);
        ele.closest(".col-md-3").remove();
        snackBar("Deleted", `Movie with id : ${deleteId} successfully deleted`, "success");
      })
      .catch( err => {
        snackBar("Error", `${err} ${err.message}`, 'error');
      })
      .finally(() => {
        handleSpinner();
      })
    }
  })
}

function onModelToggle() {
  const addMovBtn = gE("addMovBtn");
  const backDrop = gE("backDrop");
  const changeUpdateAddText = gE("movieAddOrUpdateText");

  model.classList.toggle("active");
  backDrop.classList.toggle("active");
  movieForm.reset();
  addMovBtn.classList.remove("d-none");
  updateMovBtn.classList.add("d-none");
  changeUpdateAddText.innerText = "Add Movie details";

}


modelButton.addEventListener("click", onModelToggle);
clodeModel.forEach(btn => {
  btn.addEventListener("click", onModelToggle);
});


movieForm.addEventListener("submit", onSubmit);
updateMovBtn.addEventListener("click", onUpdate);