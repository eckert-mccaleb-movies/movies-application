import $ from 'jquery';

/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');


//=======================================================
//adds movies from json movie list to html
  function updateMovieList() {
    getMovies().then((movies) => {
      $('.movieBucket').html('');
      console.log(movies);
      movies.forEach(({title, rating, id}) => {
        // console.log(`id#${id} - ${title} - rating: ${rating}`);
        $('.movieBucket').append(
            `<div class="card m-3 d-flex flex-column" style="width: 15rem; height: 17rem;">
                <div class="card-header d-flex justify-content-center">${title}</div>
                <div class="card-body p-0">
                    <p class="card-text d-flex justify-content-center">Rating: ${rating}</p>
                    <p class="card-text d-flex justify-content-center">Movie #: ${id}</p>
                </div>
                <div class="card-footer d-flex justify-content-center">
                    <button type="submit" value="${id}" class="deleteBtn btn btn-outline-danger">Delete</button>
                </div>
            </div>`
        );
      });
    }).catch((error) => {
      alert('Oh no! Something went wrong.\nCheck the console for details.');
      console.log(error);
    });
  }
  updateMovieList();

//=======================================================
//Click event that updates json movie list with user input
  $('#mbutton').click((e) => {
    e.preventDefault();

    // store inputs for new movie
    const newTitle = $('#mtitle').val();
    const newRating = $('#mrating').val();

  console.log(`${newTitle}`);
  console.log(`${newRating}`);

    const moviePostTest = {title: `${newTitle}`, rating: `${newRating}`};
    const url = '/api/movies';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moviePostTest),
    };
    fetch(url, options)
        .then(response => {
          return response;
        })
        .catch(response => console.log('Failed'));


    updateMovieList();
    $('#mtitle').val('');
    $('#mrating').val('');
    $('#movieDropDown').html('');
    modifyMovieList();

  });

//=======================================================
// function to populate dropdown menu with movies
  function modifyMovieList() {

    getMovies()

        .then((movies) => {
            movies.forEach(({title, rating, id}) => {
              $('#movieDropDown').append(`<option value="${id}">${title}</option>`);
            });
        })


        .catch((error) => {
            alert('Oh no! Something went wrong.\nCheck the console for details.');
            console.log(error);

        });


  }
modifyMovieList();

//=======================================================
// function that finds and populates movie for editing
function findMovie() {
        getMovies()
            
            .then((movies) => {
                let dropDownId = (
                    $('#movieDropDown').val()
                );
                const findMovie = movies.filter(movie => movie.id == dropDownId);
                // console.log(findMovie);
                // console.log(dropDownId);
                $('#mtitle').val(findMovie[0].title);
                $('#mrating').val(findMovie[0].rating);
            });
}

// event listener for find-movie button
$('#dropDownButton').click((e) => {
    e.preventDefault();
    findMovie();
});

//=======================================================
// function to update movie in db
function updateMovie() {
    const newTitle = $('#mtitle').val();
    const newRating = $('#mrating').val();
    let dropDownId = (
        $('#movieDropDown').val()
    );
    
    const moviePatchTest = {title: `${newTitle}`, rating: `${newRating}`};
    const url = `/api/movies/${dropDownId}`;
    const options = {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(moviePatchTest),
        completed: true
    };
    fetch(url, options)
        .then(response => {
            return response.json();
        })
        .catch(response => console.log('Failed'));
    
    
    updateMovieList();
    $('#mtitle').val('');
    $('#mrating').val('');
    $('#movieDropDown').html('');
    modifyMovieList();
}

// event listener for update-movie button
$('#mbutton-update').click((e) => {
    e.preventDefault();
    updateMovie();
});

//=======================================================
// function to delete movie
function deleteMovie() {
    let dropDownId = (
        $('#movieDropDown').val()
    );

    const moviePatchTest = {};
    const url = `/api/movies/${dropDownId}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(moviePatchTest),
        completed: true
    };
    fetch(url, options)
        .then(response => {
            return response.json();
        })
        .catch(response => console.log('Failed'));


    updateMovieList();
    $('#mtitle').val('');
    $('#mrating').val('');
    $('#movieDropDown').html('');
    modifyMovieList();
}

// event listener for movie delete button
$(document).on('click', '.deleteBtn', function () {
   console.log('test test test');
   deleteMovie();
});