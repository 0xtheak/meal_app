"use strict"
const searchMealDiv = document.getElementById('search-meal');
const foodSearchList = document.getElementById('food-search-list');
const foodDataSearch = document.getElementById('food-data-search');
const suggestionsContainer = document.getElementById('search-suggestions');
const loader = document.querySelector('.loader');
const favFoodLists = document.getElementById("favourite-foods-list");
let favouriteFoodList = window.localStorage.getItem("favouritesFood")?JSON.parse(localStorage.getItem('favouritesFood') ):[];


// data fetching urls
const categories_food_url = "https://www.themealdb.com/api/json/v1/1/categories.php";
const foodSearchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const search_by_id = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

// Retrieve data using fetch function and return promise data
async function fetchUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Error fetching data:', error);
  }
}

// Get food suggestions based on search input
async function getSuggestion() {
  const suggestDataList = await fetchUrl(foodSearchUrl + searchMealDiv.value);
  if(suggestDataList?.meals==null){
    document.getElementById('search-suggestions').style.display = "none";
    return [];
  }
  return suggestDataList?.meals || [];
}

// Show search suggestions as user types
async function showSearchSuggestions() {
  const searchValue = searchMealDiv.value.trim().toLowerCase();
  suggestionsContainer.innerHTML = '';

  if (searchValue === '') {
    document.getElementById('search-suggestions').style.display = "none";
    return;
  }

  
  const suggestions = await getSuggestion();
  suggestionsContainer.innerHTML = suggestions
    .filter(suggestion => suggestion.strMeal.toLowerCase().includes(searchValue))
    .map(suggestion => `<div class="suggestion" onclick="selectSuggestion('${suggestion.strMeal}')">${suggestion.strMeal}</div>`)
    .join('');
    document.getElementById('search-suggestions').style.display = "block";
}

// Handle selecting a suggestion from search
function selectSuggestion(mealName) {
  
  document.getElementById('search-suggestions').style.display = "block";
  searchMealDiv.value = mealName;
  suggestionsContainer.innerHTML = '';
  searchMeal();
}

// Add or remove meal from favorite list
function addToFavList(id) {
  if (favouriteFoodList?.includes(parseInt(id))) {
    favouriteFoodList = favouriteFoodList.filter(mealId => mealId !== id);
  } else {
    favouriteFoodList.push(id);
  }
  localStorage.setItem('favouritesFood', JSON.stringify(favouriteFoodList));
  updateLikeBtn(id);
}

// Update like button class
function updateLikeBtn(id) {
  const likedBtn = document.getElementById(id);
  likedBtn.classList.toggle('fa-heart');
  likedBtn.classList.toggle('fa-heart-o');
  if(likedBtn.classList.contains('fa-heart')){
    alert('meal added to favourites list');
  }else {
    alert('meal removed from favourites list');
  }
}

// Check if a meal is in the favorite list
function checkFavourite(id) {
  favouriteFoodList = window.localStorage.getItem("favouritesFood")?JSON.parse(localStorage.getItem('favouritesFood') ):[];

  return favouriteFoodList?.indexOf(parseInt(id))==-1?false:true;
}

// Show detailed meal information
async function showDetailed(id) {
  try {
    foodSearchList.innerHTML = '';
    loader.style.display = 'block';
    favFoodLists.style.display = 'none';
    foodDataSearch.style.display = 'none';

    const data = await fetchUrl(search_by_id + id);
    if (data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      const div = document.createElement('div');
      div.setAttribute('class', 'meals-detail');
      div.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p class="text"><strong>Meal name</strong> : ${meal.strMeal} </p>
        <p class="text"><strong>Category</strong> : ${meal.strCategory} </p>
        <p>Meal recipe : ${meal.strInstructions} </p>
        <div class="like-and-details">
          <a href="${meal.strYoutube}" target="_blank">Meal recipe instruction video</a>
          <i class="fa ${checkFavourite(parseInt(meal.idMeal)) ? 'fa-heart' : 'fa-heart-o'}" id="${meal.idMeal}" onclick="addToFavList(${parseInt(meal.idMeal)})"> </i>
        </div>
      `;
      foodDataSearch.innerHTML = '';
      foodDataSearch.appendChild(div);
    } else {
      console.log('Meal not found');
    }

    loader.style.display = 'none';
    foodDataSearch.style.display = 'block';
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Search for meals
async function searchMeal() {
  try {
    foodSearchList.innerHTML = '';
    if (searchMealDiv.value !== '') {
      document.getElementById('search-suggestions').style.display = "none";
      loader.style.display = 'block';
      let data = await fetchUrl(foodSearchUrl + searchMealDiv.value);
      if (data?.meals?.length > 0) {
        let ul = document.createElement('ul');
        ul.setAttribute('id', 'searched-food');
        data.meals.forEach(meal => {
          let li = document.createElement('li');
          li.innerHTML = `<img src="${meal.strMealThumb}">
            <p class="text"><strong>Meal name</strong> : ${meal.strMeal} </p>
            <p class="text"><strong>Category</strong> : ${meal.strCategory} </p>
            <div class="like-and-details">
              <div class="more-details-btn" onclick="showDetailed(${meal.idMeal})" >
                <p>More details</p>
              </div>
              <i class="fa ${checkFavourite(meal.idMeal) ? 'fa-heart' : 'fa-heart-o'}" id="${meal.idMeal}" onclick="addToFavList(${meal.idMeal})"></i>
            </div>`;
          ul.appendChild(li);
        });
        foodSearchList.appendChild(ul);
      } else {
        foodSearchList.innerHTML = '<p>404 No results found!</p>';
      }
      loader.style.display = 'none';
    }
  } catch (error) {
    console.log(error);
    loader.style.display = 'none';
  }
}

// render favourites food list
async function renderFavouriteMeals(){
  try{
    loader.style.display = 'block';
    favFoodLists.style.display = 'block';
    foodSearchList.style.display = 'none';
    foodDataSearch.style.display = 'none';
    favFoodLists.innerHTML = '';
      if(favouriteFoodList?.length>0){
          let ul = document.createElement('ul');
          ul.setAttribute('id', 'fav-food');
          favouriteFoodList.forEach( async (id) => {
              let data = await fetchUrl(search_by_id + id);
              if(data){
                  let meal = data.meals[0];
                  let li = document.createElement('li');
                  li.innerHTML = `<img src="${meal.strMealThumb}">
                                  <p class="text"><strong>Meal name</strong> : ${meal.strMeal} </p>
                                  <p class="text"><strong>Category</strong> : ${meal.strCategory} </p>
                                  
                                  <div class="like-and-details">
                                    <div class="more-details-btn" onclick="showDetailed(${meal.idMeal})" >
                                      <p>More details</p>
                                    </div>
                                    <i class="fa ${checkFavourite(meal.idMeal) ? 'fa-heart' : 'fa-heart-o'}" id="${meal.idMeal}" onclick="addToFavList(${meal.idMeal})"></i>
                                  </div>`;
            ul.appendChild(li);
              favFoodLists.appendChild(ul);
              loader.style.display = 'none';
        }     
          });
      }else {
        let p = document.createElement('p');
        p.innerText = "Currently there is no favourites meal!";
        favFoodLists.appendChild(p);
        loader.style.display = 'none';
      }
      

  }catch(error){
    loader.style.display = 'none';
      console.log(error);
  }
}

// Onload page search
window.addEventListener('load', () => {
  if (searchMealDiv.value !== '') {
    searchMeal();
  }
});