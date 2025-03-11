"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

const Page = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMeals = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?` +
          new URLSearchParams(
            Object.entries({
              apiKey: apiKey || "",
              number: "3",
              addRecipeNutrition: "true",
            })
          ).toString()
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
    } catch {
      setError("Failed to fetch meals");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const refetchMeals = () => {
    setLoading(true);
    setError("");
    fetchMeals();
  };

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Random Meals</h2>
        <Button onClick={refetchMeals} className="mt-4">
          Refetch Meals
        </Button>
      </div>
      <div className="mb-6">
        <div className="bg-primary/10">
          <div>
            <h2 className="text-xl">Total Macros</h2>
          </div>
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="font-medium">Calories</p>
                <p className="text-lg">
                  {Math.round(totalMacros.calories)}cal
                </p>
              </div>
              <div>
                <p className="font-medium">Protein</p>
                <p className="text-lg">
                  {Math.round(totalMacros.protein)}g
                </p>
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
        </div>

        <div className="grid gap-4">
          {meals.map((meal, index) => (
            <div key={index} className="flex p-4">
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
    </div>
  );
};

export default Page;
