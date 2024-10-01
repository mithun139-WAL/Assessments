import { CommonButton } from "@/components/commonComponents/CommonButton";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { StyleSheet } from "react-native";
import { Colors } from '../../constants/Colors';

export default function HomeScreen() {
  const userName = "Alpha";
  return (
    <ThemedView style={{ flex: 1, justifyContent: "space-between" }}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Good Morning, {userName}!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <CommonButton
          title="View All"
          buttonStyle={styles.button}
          textStyle={{ fontSize: 14, color: Colors.white, paddingVertical: 3 }}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 2,
    paddingVertical: 20,
    fontWeight: "400",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginBottom: 100,
    paddingHorizontal: 50,
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
  },
});
