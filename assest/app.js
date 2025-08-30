const mealsContainer = document.getElementById("meals");
const categoriesContainer = document.getElementById("categories");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const searchInput = document.getElementById("search");

function toggleSidebar() {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
}

window.onload = function () {
    loadCategories();
    getRandomMeal();
};

function loadCategories() {
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
        .then(response => response.json())
        .then(data => displayCategories(data.meals))
        .catch(err => console.error(err));
}

function displayCategories(categories) {
    categoriesContainer.innerHTML = "";
    categories.forEach(cat => {
        const li = document.createElement("li");
        li.innerHTML = `
            <button onclick="filterByCategory('${cat.strCategory}')" 
            class="w-full text-left p-2 rounded-lg hover:bg-red-500 transition">
            ${cat.strCategory}</button>`;
        categoriesContainer.appendChild(li);
    });
}

function filterByCategory(category) {
    toggleSidebar();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals))
        .catch(err => console.error(err));
}

function searchMeal() {
    let meal_name = searchInput.value;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal_name}`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals))
        .catch(err => console.error(err));
}

function getRandomMeal() {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(res => res.json())
        .then(data => displayMeals(data.meals))
        .catch(err => console.error(err));
}

function displayMeals(meals) {
    mealsContainer.innerHTML = "";
    if (!meals) {
        mealsContainer.innerHTML = "<p class='text-center text-lg'>No meals found. Try another search.</p>";
        return;
    }
    meals.forEach(meal => {
        const mealDiv = document.createElement("div");
        mealDiv.className = "bg-gray-600 shadow-md rounded-xl overflow-hidden hover:scale-105 transition transform ";
        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-56 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-bold mb-2">${meal.strMeal}</h3>
                <button onclick="showDetails(${meal.idMeal})" 
                class="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                View Recipe</button>
            </div>
        `;
        mealsContainer.appendChild(mealDiv);
    });
}

function showDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            mealsContainer.innerHTML = `
                <div class="bg-gray-600 shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
                    <h2 class="text-2xl font-bold mb-4">${meal.strMeal}</h2>
                    <img src="${meal.strMealThumb}" class="w-full rounded-xl mb-4">
                    <p><strong>Category:</strong> ${meal.strCategory}</p>
                    <p><strong>Area:</strong> ${meal.strArea}</p>

                    <h3 class="text-xl font-semibold mt-4 mb-2">Ingredients</h3>
                    <ul class="list-disc list-inside">
                        ${getIngredients(meal).map(ing => `<li>${ing}</li>`).join("")}
                    </ul>

                    <h3 class="text-xl font-semibold mt-4 mb-2">Instructions</h3>
                    <p class="leading-relaxed">${meal.strInstructions}</p>

                    ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" class="block mt-4 bg-red-500 text-white py-2 rounded-lg text-center hover:bg-red-600">▶ Watch on YouTube</a>` : ""}
                    
                    <button onclick="getRandomMeal()" class="mt-6 bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-800">🔙 Back</button>
                </div>
            `;
        })
        .catch(err => console.error(err));
}

function getIngredients(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else break;
    }
    return ingredients;
}

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchMeal();
});