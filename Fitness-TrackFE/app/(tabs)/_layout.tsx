import { router, Tabs } from "expo-router";
import React from "react";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { ThemedView } from "../../components/commonComponents/ThemedView";
import { Pressable } from "react-native";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
          padding: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "700",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          textAlignVertical: "center",
          width: "100%",
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.grey,
        headerLeft: () => {
          return (
            <ThemedView>
              <Pressable onPress={() => router.navigate("/profile")}>
                <TabBarIcon name="person" style={{ marginStart: 20 }} />
              </Pressable>
            </ThemedView>
          );
        },
        headerRight: () => {
          return (
            <ThemedView>
              <Pressable onPress={() => router.navigate("/settings")}>
                <TabBarIcon name="settings" style={{ right: 20 }} />
              </Pressable>
            </ThemedView>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarItemStyle: {
            width: 50,
          },
          headerTitle: "Home",
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "stopwatch" : "stopwatch-outline"}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarItemStyle: {
            width: 50,
          },
          headerTitle: "Workouts",
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "camera-sharp" : "camera-outline"}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarItemStyle: {
            width: 50,
          },
          headerTitle: "Capture",
        }}
      />
      
      <Tabs.Screen
        name="programmes"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "clipboard" : "clipboard-outline"}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarItemStyle: {
            width: 50,
          },
          headerTitle: "Tasks",
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bookmark" : "bookmark-outline"}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarItemStyle: {
            width: 50,
          },
          headerTitle: "Bookmarks",
        }}
      />
    </Tabs>
  );
}

export default TabLayout;