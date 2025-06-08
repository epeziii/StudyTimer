import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import images from '../constants/images';

const PaginationDots = ({ currentIndex }) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <Image
          key={i}
          source={currentIndex === i ? images.active : images.notactive}
          style={styles.dot}
          resizeMode="contain"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 20,
    height: 20,
    marginHorizontal: 6,
  },
});

export default PaginationDots;