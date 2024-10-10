import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useTracking } from "@/context/TrackingContext";
import { SafeAreaView } from "react-native-safe-area-context";

type GalleryViewProps = {
  onPressPhoto: (index: number) => void;
};

const GalleryView: React.FC<GalleryViewProps> = ({ onPressPhoto }) => {
  const { photos } = useTracking();

  return (
    <SafeAreaView>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={4}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => onPressPhoto(index)}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: 100,
    height: 100,
    margin: 1,
  },
});

export default GalleryView;

// import React, { useMemo } from "react";
// import {
//   StyleSheet,
//   Image,
//   Pressable,
//   Text,
//   SectionList,
//   FlatList,
// } from "react-native";
// import { useTracking } from "@/context/TrackingContext";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from "react-native-reanimated";
// import { ThemedView } from "./commonComponents/ThemedView";

// type Photo = {
//   id: string;
//   uri: string;
//   date: string;
//   title: string;
// };

// type SectionData = {
//   title: string;
//   data: Photo[];
// };

// type GalleryViewProps = {
//   onPressPhoto: (index: number) => void;
// };

// const GalleryView: React.FC<GalleryViewProps> = ({ onPressPhoto }) => {
//   const { photos } = useTracking();
//   const headerHeight = useSharedValue(0);

//   const groupedPhotos = useMemo(() => {
//     const grouped: Record<string, Photo[]> = {};

//     photos.forEach((photo) => {
//       const date = new Date(photo.date).toDateString();
//       if (!grouped[date]) {
//         grouped[date] = [];
//       }
//       grouped[date].push(photo);
//     });

//     return Object.entries(grouped)
//       .map(([title, data]) => ({ title, data }))
//       .sort(
//         (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime()
//       );
//   }, [photos]);

//   const renderItem = ({ item, index }: { item: Photo; index: number }) => {
//     return (
//       <Pressable
//         onPress={() => onPressPhoto(index)}
//         style={styles.photoContainer}
//       >
//         <Image source={{ uri: item.uri }} style={styles.photo} />
//       </Pressable>
//     );
//   };

//   const animatedHeaderStyle = useAnimatedStyle(() => {
//     return {
//       height: headerHeight.value,
//     };
//   });
//   const renderHeader = ({ section }: { section: SectionData }) => {
//     return (
//       <Animated.View style={[styles.header, animatedHeaderStyle]}>
//         <Text style={styles.headerText}>{section.title}</Text>
//       </Animated.View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <SectionList
//         sections={groupedPhotos}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         renderSectionHeader={renderHeader}
//         onScrollBeginDrag={() => {
//           headerHeight.value = 50;
//         }}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     padding: 10,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   photoContainer: {
//     width: "25%",
//     padding: 2,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     flex: 1,
//   },
//   photo: {
//     width: "100%",
//     height: 100,
//     margin: 1,
//     overflow: "hidden",
//   },
// });

// export default GalleryView;
