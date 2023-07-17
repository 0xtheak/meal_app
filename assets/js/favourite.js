const favFoodLists = document.getElementById("favourite-foods-list");
let favouriteFoodList = JSON.parse(localStorage.getItem('favouritesFood'));
const loader = document.querySelector('.loader');
const search_by_id = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

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
// Show detailed meal information
async function showDetailed(id) {
  try {
    favFoodLists.style.display = "none";
    loader.style.display = 'block';

    const data = await fetchUrl(search_by_id + id);
    if (data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      const div = document.createElement('div');
      div.setAttribute('class', 'meals-detail');
      div.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>Category : ${meal.strCategory} </p>
        <p>Meal name : ${meal.strMeal} </p>
        <p>Meal recipe : ${meal.strInstructions} </p>
        <div class="like-and-details">
          <a href="${meal.strYoutube}" target="_blank">Meal recipe instruction video</a>
          <i class="fa fa-heart" id="${meal.idMeal}" onclick="addToFavList(${meal.idMeal})"> </i>
        </div>
      `;
      
      document.body.appendChild(div);
    } else {
      console.log('Meal not found');
    }

    loader.style.display = 'none';
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function renderFavouriteMeals(){
    try{
        favFoodLists.innerHTML = '';
        if(favouriteFoodList){
            let ul = document.createElement('ul');
            ul.setAttribute('id', 'fav-food');
            favouriteFoodList.forEach( async (id) => {
                let data = await fetchUrl(search_by_id + id);
                if(data){
                    console.log(data);
                    let meal = data.meals[0];
                    let li = document.createElement('li');
                    li.innerHTML = `<img src="${meal.strMealThumb}">
                                    <p class="text">Category : ${meal.strCategory} </p>
                                    <p class="text">Meal name : ${meal.strMeal} </p>
                                    <div class="like-and-details">
                                      <div class="more-details-btn" onclick="showDetailed(${meal.idMeal})" >
                                        <p>More details</p>
                                      </div>
                                      <i class="fa fa-heart " id="${meal.idMeal}" ></i>
                                    </div>`;
              ul.appendChild(li);
                favFoodLists.appendChild(ul);
          }     
            })
        }

    }catch{
        console.log("some error");
    }
}

window.addEventListener("load", () => {
    renderFavouriteMeals();
})