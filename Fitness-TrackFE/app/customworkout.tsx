import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import CommonTextInput from "@/components/commonComponents/CommonTextInput";
import { useWorkout } from "@/context/WorkoutContext";
import { router } from "expo-router";
import { TabBarIcon } from "../components/commonComponents/TabBarIcon";
import {
  forceOptions,
  levelOptions,
  mechanicOptions,
  equipmentOptions,
  categoryOptions,
} from "../data/customWorkoutData";
import CommonDropDown from "@/components/commonComponents/CommonDropDown";
import { Colors } from "@/constants/Colors";

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

  const [openForce, setOpenForce] = useState(false);
  const [openLevel, setOpenLevel] = useState(false);
  const [openMechanic, setOpenMechanic] = useState(false);
  const [openEquipment, setOpenEquipment] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

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

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter an exercise name.");
      return false;
    }
    if (!primaryMuscles[0].trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter at least one primary muscle."
      );
      return false;
    }
    if (!instructions[0].trim()) {
      Alert.alert("Validation Error", "Please enter at least one instruction.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
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
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <ThemedText style={styles.label}>{label}:</ThemedText>
        <Pressable onPress={() => addField(setState)} style={styles.addButton}>
          <TabBarIcon name="checkmark" size={16} style={styles.addButtonText} />
        </Pressable>
      </ThemedView>
      {array.map((value, index) => (
        <ThemedView key={index} style={styles.arrayItem}>
          <CommonTextInput
            style={styles.input}
            placeholder={`Enter ${label.toLowerCase()} #${index + 1}`}
            value={value}
            onChangeText={(text) => handleArrayChange(index, text, setState)}
          />
          <Pressable
            onPress={() => removeField(index, setState)}
            style={styles.removeButton}
          >
            <TabBarIcon
              name="close"
              size={16}
              style={styles.addButtonText}
            />
          </Pressable>
        </ThemedView>
      ))}
    </ThemedView>
  );

  const renderDropdown = (
    label: string,
    selectedValue: string,
    options: { label: string; value: string }[],
    setValue: React.Dispatch<React.SetStateAction<string>>,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => (
    <ThemedView style={styles.dropdownContainer}>
      <ThemedText style={styles.label}>{label}:</ThemedText>
      <CommonDropDown
        items={options}
        placeholder={`Select ${label}`}
        defaultValue={selectedValue}
        onChangeValue={setValue}
        open={open}
        setOpen={setOpen}
      />
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.formContainer}
        data={[{}]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ThemedView />}
        ListHeaderComponent={
          <>
            <ThemedText style={styles.label}>Exercise Name:</ThemedText>
            <CommonTextInput
              placeholder="Enter exercise name"
              value={name}
              onChangeText={setName}
            />
            {renderDropdown(
              "Force",
              force,
              forceOptions,
              setForce,
              openForce,
              setOpenForce
            )}
            {renderDropdown(
              "Level",
              level,
              levelOptions,
              setLevel,
              openLevel,
              setOpenLevel
            )}
            {renderDropdown(
              "Mechanic",
              mechanic,
              mechanicOptions,
              setMechanic,
              openMechanic,
              setOpenMechanic
            )}
            {renderDropdown(
              "Equipment",
              equipment,
              equipmentOptions,
              setEquipment,
              openEquipment,
              setOpenEquipment
            )}
            {renderDropdown(
              "Category",
              category,
              categoryOptions,
              setCategory,
              openCategory,
              setOpenCategory
            )}

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
          </>
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: {
    flexGrow: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    padding: 10,
    marginBottom: 15,
    width: "70%",
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
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    right: 10,
  },
  addButtonText: {
    color: Colors.white,
  },
  removeButton: {
    marginHorizontal: 15,
    backgroundColor: Colors.orange,
    padding: 5,
    borderRadius: 30,
  },
});

export default CustomWorkout;
