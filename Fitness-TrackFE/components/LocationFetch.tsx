import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';


type Coordinates = {
  latitude: number;
  longitude: number;
};

const LocationFetch: React.FC = () => {
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState<string>('Location Loading...');
  const [locationServicesEnabled, setLocationServicesEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      await checkIfLocationEnabled();
      await getCurrentLocation();
      setLoading(false);
    })();
  }, []);

  const checkIfLocationEnabled = async (): Promise<void> => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert('Location Not Enabled', 'Please enable your Location services', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Enable', onPress: () => console.log('Enable Pressed') },
      ]);
    }
    setLocationServicesEnabled(enabled);
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow the app to use location services', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        const { latitude, longitude } = coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        await reverseGeocodeWithTimeout({ latitude, longitude });
      }
    } catch (error) {
      console.error('Error getting location: ', error);
      Alert.alert('Error', 'Unable to fetch location. Please try again later.');
    }
  };

  const reverseGeocodeWithTimeout = async (coords: Coordinates): Promise<void> => {
    try {
      const retryLimit = 2;
      let attempt = 0;
      let response: Location.LocationGeocodedAddress[] | undefined;
  
      while (attempt < retryLimit) {
        try {
          const reverseGeocodePromise = Location.reverseGeocodeAsync(coords);
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Geocoding request timed out')), 10000)
          );
  
          response = (await Promise.race([reverseGeocodePromise, timeoutPromise])) as Location.LocationGeocodedAddress[];
          
          if (response && Array.isArray(response)) {
            break;
          }
        } catch (error) {
          attempt += 1;
          console.warn(`Attempt ${attempt} failed: ${error}`);
        }
      }
  
      if (response && Array.isArray(response)) {
        for (let item of response) {
          let address = `${item.name}, ${item.street}, ${item.city}, ${item.postalCode}`;
          setDisplayCurrentAddress(address || 'Address not found');
        }
      } else {
        throw new Error('Unable to fetch address. All attempts failed.');
      }
    } catch (error) {
      console.error('Reverse Geocoding Error: ', error);
      setDisplayCurrentAddress('Unable to fetch address. Please try again later.');
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.addressContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Text style={styles.addressText}>{displayCurrentAddress}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LocationFetch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  addressContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  addressText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
