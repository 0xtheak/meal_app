let foodData = document.getElementById('search-meal');

const search_url = "https://www.themealdb.com/api/json/v1/1/search.php?s="
function searchMeal(){
	console.log("fucntion clicked");
	
	fetch(search_url+foodData.value)
	.then(response => response.json())
	.then(data => console.log(data));

}

foodData.addEventListener("input", () => {
	console.log('input has been changed');
	fetch(search_url+foodData.value)
	.then(response => response.json())
	.then(data => console.log(data));

})