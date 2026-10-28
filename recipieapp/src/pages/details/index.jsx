import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Details() {
  const { id } = useParams();

  const {
    recipeDetailsData,
    setRecipeDetailsData,
    favoritesList,
    handleAddToFavorite,
  } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function getRecipeDetails() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load recipe. Please try again.");
        }

        const data = await response.json();

        if (isMounted) {
          setRecipeDetailsData(data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      getRecipeDetails();
    } else {
      setError("Recipe ID is missing.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id, setRecipeDetailsData]);

  if (loading) {
    return <p className="text-center p-10">Loading recipe details...</p>;
  }

  if (error) {
    return <p className="text-center p-10 text-red-600">{error}</p>;
  }

  const recipe = recipeDetailsData?.recipe;

  if (!recipe) {
    return <p className="text-center p-10">Recipe details not found.</p>;
  }

  const isFavorite =
    favoritesList?.some((item) => item.id === recipe.id) ?? false;

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="row-start-2 lg:row-start-auto">
        <div className="h-96 overflow-hidden rounded-xl group">
          <img
            src={recipe.image_url}
            alt={recipe.title || "Recipe"}
            className="w-full h-full object-cover block group-hover:scale-105 duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm text-cyan-700 font-medium">
          {recipe.publisher}
        </span>

        <h3 className="font-bold text-2xl text-black">{recipe.title}</h3>

        <button
          onClick={() => handleAddToFavorite(recipe)}
          className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
        >
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </button>

        <div>
          <span className="text-2xl font-semibold text-black">
            Ingredients:
          </span>

          <ul className="flex flex-col gap-3">
            {recipe.ingredients?.map((ingredient, index) => (
              <li key={`${ingredient.description}-${index}`}>
                <span className="text-lg font-semibold text-black">
                  {ingredient.quantity} {ingredient.unit}{" "}
                </span>

                <span className="text-lg text-black">
                  {ingredient.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}