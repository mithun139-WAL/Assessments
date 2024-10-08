import React, { useState } from "react";
import { StyleSheet, TextInput, Pressable, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import CommonTextInput from "@/components/commonComponents/CommonTextInput";
import { useWorkout } from "@/context/WorkoutContext";
import { router } from "expo-router";

const forceOptions = ["pull", "push", "static"];
const levelOptions = ["beginner", "intermediate", "expert"];
const mechanicOptions = ["compound", "isolation"];
const equipmentOptions = [
  "body only",
  "machine",
  "kettlebells",
  "dumbbell",
  "cable",
  "barbell",
  "bands",
  "medicine ball",
  "exercise ball",
  "e-z curl bar",
  "foam roll",
];
const categoryOptions = [
  "strength",
  "stretching",
  "plyometrics",
  "strongman",
  "powerlifting",
  "cardio",
  "olympic weightlifting",
  "crossfit",
  "weighted bodyweight",
  "assisted bodyweight",
];

const CustomWorkout = () => {
  const { addWorkout } = useWorkout();

  const [name, setName] = useState<string>("");
  const [force, setForce] = useState<string>("pull");
  const [level, setLevel] = useState<string>("beginner");
  const [mechanic, setMechanic] = useState<string>("compound");
  const [equipment, setEquipment] = useState<string>("body only");
  const [category, setCategory] = useState<string>("strength");
  const [primaryMuscles, setPrimaryMuscles] = useState<string[]>([""]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  const handleArrayChange = (
    index: number,
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = value;
      return newArray;
    });
  };

  const addField = (
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prevArray) => [...prevArray, ""]);
  };

  const removeField = (
    index: number,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(index, 1);
      return newArray;
    });
  };

  const handleSubmit = () => {
    const newWorkout = {
      id: name.replace(/\s+/g, "_"),
      name,
      force,
      level,
      mechanic,
      equipment,
      primaryMuscles,
      secondaryMuscles,
      instructions,
      category,
    };
    console.log("NewWorkout",newWorkout);
    
    addWorkout(newWorkout);
    setName("");
    setForce("pull");
    setLevel("beginner");
    setMechanic("compound");
    setEquipment("body only");
    setCategory("strength");
    setPrimaryMuscles([""]);
    setSecondaryMuscles([""]);
    setInstructions([""]);
    alert("Workout Added Successfully!");
    router.navigate("/(tabs)/workouts");
  };

  const renderArrayFields = (
    label: string,
    array: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <ThemedView style={styles.arrayContainer}>
      <ThemedText style={styles.label}>{label}:</ThemedText>
      {array.map((value, index) => (
        <ThemedView key={index} style={styles.arrayItem}>
          <TextInput
            style={styles.input}
            placeholder={`Enter ${label.toLowerCase()} #${index + 1}`}
            value={value}
            onChangeText={(text) => handleArrayChange(index, text, setState)}
          />
          <Pressable
            onPress={() => removeField(index, setState)}
            style={styles.removeButton}
          >
            <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
          </Pressable>
        </ThemedView>
      ))}
      <Pressable onPress={() => addField(setState)} style={styles.addButton}>
        <ThemedText style={styles.addButtonText}>Add {label}</ThemedText>
      </Pressable>
    </ThemedView>
  );

  const renderDropdown = (
    label: string,
    selectedValue: string,
    options: string[],
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <ThemedView style={styles.dropdownContainer}>
      <ThemedText style={styles.label}>{label}:</ThemedText>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue) => setValue(itemValue)}
      >
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </ThemedView>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText style={styles.label}>Exercise Name:</ThemedText>
        <CommonTextInput
          placeholder="Enter exercise name"
          value={name}
          onChangeText={setName}
        />

        {renderDropdown("Force", force, forceOptions, setForce)}
        {renderDropdown("Level", level, levelOptions, setLevel)}
        {renderDropdown("Mechanic", mechanic, mechanicOptions, setMechanic)}
        {renderDropdown("Equipment", equipment, equipmentOptions, setEquipment)}
        {renderDropdown("Category", category, categoryOptions, setCategory)}
        {renderArrayFields(
          "Primary Muscles",
          primaryMuscles,
          setPrimaryMuscles
        )}
        {renderArrayFields(
          "Secondary Muscles",
          secondaryMuscles,
          setSecondaryMuscles
        )}
        {renderArrayFields("Instructions", instructions, setInstructions)}
        <Pressable style={styles.addButton} onPress={handleSubmit}>
          <ThemedText style={styles.addButtonText}>Save Workout</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  arrayContainer: {
    marginVertical: 10,
  },
  arrayItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#ff6347",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
  },
});

export default CustomWorkout;
