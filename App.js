import * as Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PushNotification from 'react-native-push-notification';

const DH = {
  identifier: 'DH',
  latitude: 46.0946322,
  longitude: 19.6530557,
  radius: 500
};

const ZSINAGOGA = {
  identifier: 'ZSINAGOGA',
  latitude: 46.1011812,
  longitude: 19.6599643,
  radius: 500
};

const REGIONS = [
  DH,
  ZSINAGOGA,
];


TaskManager.defineTask(
  'geoFencingTask',
  ({data: {eventType, region}, error}) => {
    if (error) {
      console.log(error);
      return;
    }
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log("You've entered region:", region.identifier);
      PushNotification.localNotification({
        message: `You've entered region: ${region.identifier}`
      });
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log("You've left region:", region.identifier);
      PushNotification.localNotification({
        message: `You've left region: ${region.identifier}`
      });
    }
  },
);
export default class App extends Component {
  constructor() {
    super();
  }

  state = {
    hasLocationPermissions: false,
    locationResult: null,
  };

  getLocationPermission = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({hasLocationPermissions: true});
    }
  };

  componentDidMount() {
    this.getLocationPermission().then(()=>Location.startGeofencingAsync('geoFencingTask', REGIONS));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello world.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
