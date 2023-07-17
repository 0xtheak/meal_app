const searchMealDiv = document.getElementById('search-meal');
const foodSearchList = document.getElementById('food-search-list');
const foodLikeButton = document.getElementsByClassName('fa-heart-o');
const loader = document.getElementsByClassName('loader')[0];
const foodDataSearch = document.getElementById('food-data-search');
let favouriteFoodList = [];

const categories_food_url = "https://www.themealdb.com/api/json/v1/1/categories.php";
const foodSearchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="
const search_by_id = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

// retrieve data using fetch function and return promise data
function fetchUrl(url){
  return fetch(url)
    .then(response => response.json())
    .then(data => data)
}

// return food suggestion list
async function getSuggestion() {
  const suggestDataList = await fetchUrl(foodSearchUrl + searchMealDiv.value);
  return suggestDataList?.meals;
}

// food suggestion for search bar
async function showSearchSuggestions() {
  const searchInput = document.getElementById('search-meal');
  const searchValue = searchInput.value.trim().toLowerCase();
  const suggestionsContainer = document.getElementById('search-suggestions');
  suggestionsContainer.innerHTML = '';

  if (searchValue === '') {
    return;
  }

  const suggestions = await getSuggestion();

  if (suggestions) {
    const matchingSuggestions = suggestions.filter(suggestion => suggestion.strMeal.toLowerCase().includes(searchValue));

    matchingSuggestions.forEach(suggestion => {
      const suggestionElement = document.createElement('div');
      suggestionElement.textContent = suggestion.strMeal;
      suggestionElement.classList.add('suggestion');
      suggestionElement.addEventListener('click', () => {
        searchInput.value = suggestion.strMeal;
        suggestionsContainer.innerHTML = '';
      });
      suggestionsContainer.appendChild(suggestionElement);
    });
  }
}


function addToFavList(id) {

  if (window.localStorage.getItem("favouritesFood")) {
    favouriteFoodList = JSON.parse(window.localStorage.getItem("favouritesFood"));
  }

  // if the id not present in the existing array add it;
  const index = favouriteFoodList.indexOf(id);
  if (index == -1) {
    favouriteFoodList.push(id); 
  }
  // Store the updated array in localStorage
  window.localStorage.setItem("favouritesFood", JSON.stringify(favouriteFoodList)); 
}

function checkFavourite(id){
  console.log(id);
  const index = favouriteFoodList.indexOf(id);
  if (index !== -1) {
    let likedBtn = document.querySelector('#'+id);
    console.log(likedBtn);
  }
}


// meal details page
function showDetailed(id) {
  foodSearchList.innerHTML = '';
  loader.style.display = 'block';
  foodDataSearch.style.display = 'none';

  fetchUrl(search_by_id + id)
    .then((data) => {
      if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0];
        console.log(meal);
        let div = document.createElement('div');
        div.setAttribute('class', 'meals-detail');
        div.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <p>Category : ${meal.strCategory} </p>
                        <p>Meal name : ${meal.strMeal} </p>
                        <p>Meal recipe : ${meal.strInstructions} </p>
                        <div class="like-and-details">
                        <a href="${meal.strYoutube}" target="_blank">Meal recipe instruction video</a>
                        <i class="fa fa-heart-o" onload="checkFavourite(${meal.idMeal})" onClick="addToFavList(${meal.idMeal})"> </i>
                        </div>
        `;
        document.body.appendChild(div); 
        loader.style.display = 'none';
      } else {
        loader.style.display = 'none';
        // Handle the case when data is empty or not found.
        console.log('Meal not found');
      }
    })
    .catch((error) => {
      loader.style.display = 'none';
      console.error('Error fetching data:', error);
    });
}




// showing searched with in the list
function searchMeal() {
  foodSearchList.innerHTML = '';
  if (searchMealDiv.value !== "") {
    loader.style.display = "block";
    fetchUrl(foodSearchUrl + searchMealDiv.value)
      .then((data) => {
        if(data?.meals?.length>0){
          let ul = document.createElement('ul');
        ul.setAttribute("id", "searched-food");
        data?.meals?.forEach((meal) => {
          let li = document.createElement('li');
          li.setAttribute("id", meal.idMeal);
          li.innerHTML = `<img src="${meal.strMealThumb}">
                          <p>Category : ${meal.strCategory} </p>
                          <p>Meal name : ${meal.strMeal} </p>
                          <div class="like-and-details">
                            <div class="more-details-btn" onClick="showDetailed(${meal.idMeal})"  >
                              <p>More details</p>
                            </div>
                            <i class="fa fa-heart-o" onload="checkFavourite(${meal.idMeal})" onClick="addToFavList(${meal.idMeal})"></i>
                          </div>`;
          ul.appendChild(li);
        });
        foodSearchList.appendChild(ul);
        // Hide the loader once data is loaded
        loader.style.display = "none"; 
        }else {
           // Hide the loader once data is loaded
          loader.style.display = "none";
          foodSearchList.innerHTML = "<p>404 No results found!</p>";
        }
      })
      .catch((error) => {
        console.error(error);
        // Hide the loader in case of an error
        loader.style.display = "none"; 
      });
  }
}
  

// onload page search
window.addEventListener("load", ()=> {
  if(searchMealDiv.value !=""){
    searchMeal();
  }
});