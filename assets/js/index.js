const searchMealDiv = document.getElementById('search-meal');
const foodSearchList = document.getElementById('food-search-list');
const randomFoodsList = document.getElementById('random-foods-list');
const foodLikeButton = document.getElementsByClassName('fa-heart-o');
const loader = document.getElementsByClassName('loader')[0];

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



let favouriteFoodList = [];

function addToFavList(id) {

  if (window.localStorage.getItem("favouritesFood")) {
    favouriteFoodList = JSON.parse(window.localStorage.getItem("favouritesFood"));
  }

  // if the id not present in the existing array add it;
  const index = favouriteFoodList.indexOf(id);
  if (index == -1) {
    favouriteFoodList.push(id); 
  }

  
  window.localStorage.setItem("favouritesFood", JSON.stringify(favouriteFoodList)); // Store the updated array in localStorage
}

function checkFavourite(id){
  console.log(id);
  const index = favouriteFoodList.indexOf(id);
  if (index !== -1) {
    let likedBtn = document.querySelector('#'+id);
    console.log(likedBtn);
  }
}



function showDetailed(id){
  foodSearchList.innerHTML = '';
  loader.style.display = "block";
  fetchUrl(search_by_id+id)
    .then((data) => {
      let div = document.createElement('div');

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
                          <p>category : ${meal.strCategory} </p>
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
	




// showing search suggestion
searchMealDiv.addEventListener("input", (e) => {
	// console.log('input has been changed');
  
});


// foods categories
// window.addEventListener("load", ()=> {
// 	console.log("page loaded")
// 	let foodData = fetchUrl(categories_food_url);
// 	foodData.then((data) => {
// 		if(data){
// 			let ul = document.createElement('ul');
// 			ul.setAttribute("id", "foods-categories");
// 			data?.categories?.forEach((cate) => {
// 				let li = document.createElement('li');
// 				li.setAttribute("id", cate.idCategory);
// 				li.innerHTML = `<img src="${cate.strCategoryThumb}">
// 								<p>category : ${cate.strCategory} </p>
//                 <div class="like-and-details">
//                   <div class="more-details-btn">
//                     <p>More details</p>
//                   </div>
//                   <i class="fa fa-heart-o"></i>
//                 </div>
// 								<!-- <p >Description: ${cate.strCategoryDescription}</p> -->`
// 				ul.appendChild(li);
// 			})
// 			randomFoodsList.appendChild(ul);
// 		}
// 	});
// });

  window.addEventListener("load", ()=> {
    if(searchMealDiv.value !=""){
      searchMeal();
    }
  });

