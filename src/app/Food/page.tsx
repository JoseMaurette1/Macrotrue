"use client";
import React, { useEffect, useState } from "react";

interface Recipe {
  id: number;
  title: string;
  image: string;
  nutrition: {
    nutrients: {
      name: string;
      amount: number;
      unit: string;
    }[];
  };
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
}

const page = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(
          "https://api.spoonacular.com/recipes/complexSearch?" +
            new URLSearchParams({
              apiKey: "5b291ddc26bc4451a00e6c3ce02ce27b",
              number: "3",
              addRecipeNutrition: "true",
            })
        );
        const data = await response.json();

        const formattedMeals = data.results.map((recipe: Recipe) => {
          const nutrients = recipe.nutrition.nutrients;
          return {
            name: recipe.title,
            image: recipe.image,
            calories: nutrients.find((n) => n.name === "Calories")?.amount || 0,
            protein: nutrients.find((n) => n.name === "Protein")?.amount || 0,
            carbs:
              nutrients.find((n) => n.name === "Carbohydrates")?.amount || 0,
            fat: nutrients.find((n) => n.name === "Fat")?.amount || 0,
          };
        });

        setMeals(formattedMeals);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch meals");
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) return <div>Loading meals...</div>;
  if (error) return <div>{error}</div>;

  const totalMacros = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Random Meals</h1>
      <div className="mb-6 p-4 bg-primary/10 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Total Macros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="font-medium">Calories</p>
            <p className="text-lg">{Math.round(totalMacros.calories)}cal</p>
          </div>
          <div>
            <p className="font-medium">Protein</p>
            <p className="text-lg">{Math.round(totalMacros.protein)}g</p>
          </div>
          <div>
            <p className="font-medium">Carbs</p>
            <p className="text-lg">{Math.round(totalMacros.carbs)}g</p>
          </div>
          <div>
            <p className="font-medium">Fat</p>
            <p className="text-lg">{Math.round(totalMacros.fat)}g</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        {meals.map((meal, index) => (
          <div key={index} className="border p-4 rounded-lg flex">
            <img
              src={meal.image}
              alt={meal.name}
              className="w-32 h-32 object-cover rounded-lg mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{meal.name}</h2>
              <div className="mt-2">
                <p>Calories: {Math.round(meal.calories)}cal</p>
                <p>Protein: {Math.round(meal.protein)}g</p>
                <p>Carbs: {Math.round(meal.carbs)}g</p>
                <p>Fat: {Math.round(meal.fat)}g</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
