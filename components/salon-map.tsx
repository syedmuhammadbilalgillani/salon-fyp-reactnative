import { fetchNearbySalons } from '@/services/places';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Salon {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

export default function SalonNearMe() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(loc.coords);
      loadSalons(loc.coords.latitude, loc.coords.longitude);
    } catch (err: any) {
      setError('Failed to get location: ' + err.message);
    }
  };

  const loadSalons = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const results = await fetchNearbySalons(lat, lng);
      setSalons(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (lat: number, lng: number, name: string) => {
    const url = Platform.select({
      ios: `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(name)}`,
      android: `geo:${lat},${lng}?q=${encodeURIComponent(name)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) {
      Linking.openURL(url).catch(err => console.error('Error opening maps:', err));
    }
  };

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9B1B30" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with location info */}
      <View style={styles.header}>
        <View style={styles.locationIconContainer}>
          <Ionicons name="location" size={24} color="#9B1B30" />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Your Location</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#D32F2F" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && salons.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9B1B30" />
          <Text style={styles.loadingText}>Finding nearby salons...</Text>
        </View>
      ) : (
        <FlatList
          data={salons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            salons.length === 0 && styles.emptyList
          ]}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="business" size={24} color="#9B1B30" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.address} numberOfLines={2}>
                      {item.address}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => openInMaps(item.latitude, item.longitude, item.name)}
                activeOpacity={0.8}
              >
                <Ionicons name="map-outline" size={20} color="#FFFFFF" />
                <Text style={styles.mapButtonText}>Open in Maps</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#CCC" />
                <Text style={styles.emptyText}>No salons found nearby</Text>
                <Text style={styles.emptySubtext}>
                  Try expanding your search radius or check your location settings
                </Text>
              </View>
            ) : null
          }
          ListHeaderComponent={
            salons.length > 0 ? (
              <View style={styles.resultHeader}>
                <Text style={styles.resultCount}>
                  Found {salons.length} salon{salons.length !== 1 ? 's' : ''} nearby
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {loading && salons.length > 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#9B1B30" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5E6E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE6E6',
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  resultHeader: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  resultCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9B1B30',
  },
  list: {
    padding: 10,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5E6E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9B1B30',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  address: {
    color: '#666',
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
    lineHeight: 20,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9B1B30',
    padding: 14,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});