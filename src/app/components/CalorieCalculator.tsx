"use client";

import { motion } from "framer-motion";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CalorieCalculator() {
  // const router = useRouter();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [selectedCalories, setSelectedCalories] = useState<number | null>(null);

  const calculateBMR = (system: "metric" | "us") => {
    if (
      !weight ||
      (!height && system === "metric") ||
      (!feet && system === "us") ||
      !age
    )
      return 0;

    const heightInCm =
      system === "metric"
        ? parseFloat(height)
        : parseFloat(feet) * 30.48 + parseFloat(inches || "0") * 2.54;

    const weightInKg =
      system === "metric" ? parseFloat(weight) : parseFloat(weight) * 0.453592;

    // Harris-Benedict Formula
    if (gender === "male") {
      return (
        88.362 +
        13.397 * weightInKg +
        4.799 * heightInCm -
        5.677 * parseFloat(age)
      );
    } else {
      return (
        447.593 +
        9.247 * weightInKg +
        3.098 * heightInCm -
        4.33 * parseFloat(age)
      );
    }
  };

  const getActivityMultiplier = () => {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9,
    };
    return multipliers[activityLevel as keyof typeof multipliers];
  };

  const calculateTDEE = (system: "metric" | "us") => {
    const bmr = calculateBMR(system);
    return bmr * getActivityMultiplier();
  };

  const getCaloriesByGoal = (tdee: number, adjustment: number) => {
    return Math.round(tdee + adjustment - 200); // Subtracting 200 to adjust the calorie calculations
  };

  const handleCardClick = (calories: number) => {
    setSelectedCalories(calories);
    // Save to localStorage
    localStorage.setItem("selectedCalories", calories.toString());
    console.log(`Selected calorie goal: ${calories}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-10">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold text-center">
          Calorie Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Age</Label>
            <Input
              type="number"
              placeholder="Age in years"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <Label>Gender</Label>
            <RadioGroup
              value={gender}
              onValueChange={setGender}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <Tabs defaultValue="metric" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="us">US</TabsTrigger>
              <TabsTrigger value="metric">Metric</TabsTrigger>
            </TabsList>

            <TabsContent value="metric">
              <div className="space-y-4">
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="Height in cm"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    placeholder="Weight in kg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="us">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Height (feet)</Label>
                    <Input
                      type="number"
                      placeholder="Feet"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Height (inches)</Label>
                    <Input
                      type="number"
                      placeholder="Inches"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Weight (lbs)</Label>
                  <Input
                    type="number"
                    placeholder="Weight in pounds"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <Label>Activity Level</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">
                  Sedentary (little or no exercise)
                </SelectItem>
                <SelectItem value="light">
                  Lightly active (1-3 days/week)
                </SelectItem>
                <SelectItem value="moderate">
                  Moderately active (3-5 days/week)
                </SelectItem>
                <SelectItem value="very">
                  Very active (6-7 days/week)
                </SelectItem>
                <SelectItem value="extra">
                  Extra active (very active + physical job)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {age && weight && ((height && !feet) || feet) && (
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold">Daily Calorie Needs:</h3>
            <div className="space-y-1">
              {(() => {
                const system = height ? "metric" : "us";
                const tdee = calculateTDEE(system);
                return (
                  <div className="grid grid-cols-2 gap-4 ">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <Card
                        className={`transition-all hover:scale-105 cursor-pointer ${
                          selectedCalories === getCaloriesByGoal(tdee, -500)
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() =>
                          handleCardClick(getCaloriesByGoal(tdee, -500))
                        }
                      >
                        <CardHeader>
                          <CardTitle className="text-base">
                            Weight Loss (1 lb/week)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg">
                            {getCaloriesByGoal(tdee, -500)} calories
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <Card
                        className={`transition-all hover:scale-105 cursor-pointer ${
                          selectedCalories === getCaloriesByGoal(tdee, -250)
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() =>
                          handleCardClick(getCaloriesByGoal(tdee, -250))
                        }
                      >
                        <CardHeader>
                          <CardTitle className="text-base">
                            Mild Loss (0.5 lb/week)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg">
                            {getCaloriesByGoal(tdee, -250)} calories
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
                    >
                      <Card
                        className={`transition-all hover:scale-105 cursor-pointer ${
                          selectedCalories === getCaloriesByGoal(tdee, 0)
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() =>
                          handleCardClick(getCaloriesByGoal(tdee, 0))
                        }
                      >
                        <CardHeader>
                          <CardTitle className="text-base">
                            Maintain Weight
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg">
                            {getCaloriesByGoal(tdee, 0)} calories
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      <Card
                        className={`transition-all hover:scale-105 cursor-pointer ${
                          selectedCalories === getCaloriesByGoal(tdee, 500)
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() =>
                          handleCardClick(getCaloriesByGoal(tdee, 500))
                        }
                      >
                        <CardHeader>
                          <CardTitle className="text-base">
                            Weight Gain
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg">
                            {getCaloriesByGoal(tdee, 500)} calories
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
