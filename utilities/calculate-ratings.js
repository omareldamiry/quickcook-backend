module.exports = (recipeRating, newRating) => {
    const ratings = recipeRating.ratings.map(rating => rating.userId);
    
    if (!ratings.includes(newRating.userId)) {
        return ((recipeRating.rating*recipeRating.ratings.length) + newRating.value) / (recipeRating.ratings.length + 1);
    } else {
        return ((recipeRating.rating*recipeRating.ratings.length) - recipeRating.ratings[recipeRating.ratings.findIndex(rating => rating.userId == newRating.userId)].value + newRating.value) / recipeRating.ratings.length;
    }
}