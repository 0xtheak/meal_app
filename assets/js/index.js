const searchMealDiv = document.getElementById('search-meal');
const foodSearchList = document.getElementById('food-search-list');
const randomFoodsList = document.getElementById('random-foods-list')

const categories_food_url = "https://www.themealdb.com/api/json/v1/1/categories.php";
const foodSearchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="
const search_by_id = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

function searchMeal(){
	foodSearchList.innerHTML = '';
	console.log("fucntion clicked");
  if(searchMealDiv.value !=""){
    let searchedFood  = fetchUrl(foodSearchUrl+searchMealDiv.value);
    searchedFood.then((data) => {
      let ul = document.createElement('ul');
      ul.setAttribute("id", "searched-food");
      console.log(data);
      data?.meals?.forEach((meal) => {
				let li = document.createElement('li');
				li.setAttribute("id", meal.idMeal);
				li.innerHTML = `<img src="${meal.strMealThumb}">
								<p>category : ${meal.strCategory} </p>
                <div class="like-and-details">
                  <div class="more-details-btn">
                    <p>More details</p>
                  </div>
                  <i class="fa fa-heart-o"></i>
                </div>
								<!-- <p >Description: ${meal.strCategoryDescription}</p> -->`
				ul.appendChild(li);
			});
      foodSearchList.appendChild(ul);
    })
  }
	

}

function fetchUrl(url){
	return fetch(url)
		.then(response => response.json())
		.then(data => data)
}

// showing show result
searchMealDiv.addEventListener("input", (e) => {
	console.log('input has been changed');
  
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
      searchMealDiv.value = "";
    }
  })