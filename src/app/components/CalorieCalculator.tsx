"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, TrendingDown, TrendingUp, Minus, Flame } from "lucide-react";

const goals = [
  { goal: "Weight Loss", adjustment: -500, icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" },
  { goal: "Mild Loss", adjustment: -250, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { goal: "Maintain", adjustment: 0, icon: Minus, color: "text-green-500", bg: "bg-green-500/10" },
  { goal: "Weight Gain", adjustment: 500, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
];

export default function CalorieCalculator() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");

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
    return Math.round(tdee + adjustment - 200);
  };

  const isFormComplete = age && weight && ((height && !feet) || feet);

  return (
    <section className="py-24 bg-muted/20">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          See your results
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Enter your details to calculate your daily calorie needs
        </p>
      </motion.div>
      <Card className="w-full max-w-2xl mx-auto p-10">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold">
            Calorie Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
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
                className="flex gap-4 mt-2"
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

            <Tabs defaultValue="us" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="us">US</TabsTrigger>
                <TabsTrigger value="metric">Metric</TabsTrigger>
              </TabsList>

              <TabsContent value="metric" className="mt-4 space-y-4">
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
              </TabsContent>

              <TabsContent value="us" className="mt-4 space-y-4">
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
              </TabsContent>
            </Tabs>

            <div>
              <Label>Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Lightly active (1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderately active (3-5 days/week)</SelectItem>
                  <SelectItem value="very">Very active (6-7 days/week)</SelectItem>
                  <SelectItem value="extra">Extra active (very active + physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isFormComplete && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Your daily calorie targets — sign up to unlock
              </p>

              {(() => {
                const system = height ? "metric" : "us";
                const tdee = calculateTDEE(system);

                return (
                  <div className="grid grid-cols-2 gap-4">
                    {goals.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.goal}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                          <Card
                            className="cursor-pointer group relative"
                            onClick={() => router.push("/signup")}
                          >
                            <div className="absolute inset-0 bg-muted/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                              <Lock className="w-5 h-5 mb-2 text-muted-foreground" />
                              <span className="text-sm font-medium text-muted-foreground">
                                Sign up
                              </span>
                            </div>
                            <CardHeader className="pb-2">
                              <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-2`}>
                                <Icon className={`w-4 h-4 ${item.color}`} />
                              </div>
                              <CardTitle className="text-base">{item.goal}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xl font-bold blur-sm select-none">
                                {getCaloriesByGoal(tdee, item.adjustment)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">calories/day</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="text-center pt-4">
                <Button size="lg" onClick={() => router.push("/signup")} className="gap-2">
                  Sign Up for Full Results <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
