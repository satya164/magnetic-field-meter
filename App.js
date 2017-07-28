import React, { PureComponent } from 'react';
import { Animated, StatusBar, StyleSheet, Platform, Text, View, Image } from 'react-native';
import { Magnetometer } from 'expo';

StatusBar.setBarStyle('light-content');

export default class App extends PureComponent {
  state = {
    reading: '0',
    rotate: new Animated.Value(0),
  };

  componentDidMount() {
    this._subscription = Magnetometer.addListener(({ x, y, z }) => {
      const value = Math.sqrt(x * x + y * y + z * z);
      this.setState({ reading: value.toFixed(5) });
      Animated.spring(this.state.rotate, {
        toValue: value
      }).start();
    });
  }

  componentWillUnmount() {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {
    const rotate = this.state.rotate.interpolate({
      inputRange: [0, 360],
      outputRange: ['-120deg', '120deg']
    });

    return (
      <View style={styles.container}>
        <View>
          <Image
            style={styles.dial}
            source={require('./assets/dial.png')}
          />
          <Animated.Image
            style={[styles.hand, {transform:[{rotate}]}]}
            source={require('./assets/hand.png')}
          />
        </View>
        <Text style={styles.reading}>
          {this.state.reading} μTesla
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B3D51',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dial: {
    height: 180,
    width: 240,
    resizeMode: 'contain'
  },
  hand: {
    position: 'absolute',
    height: 170,
    width: 22,
    left: 109,
    bottom: -25,
  },
  reading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    margin: 16,
  }
});
