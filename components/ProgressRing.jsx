import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressRing = ({
  radius,
  strokeWidth,
  progress,
  color,
  backgroundColor,
  isBreak, // new prop to determine work or break mode
}) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const animatedValue = useRef(new Animated.Value(progress)).current;
  const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0 });

  const markerRadius = 20;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      const angle = 2 * Math.PI * value - Math.PI / 2;
      const x = radius + normalizedRadius * Math.cos(angle);
      const y = radius + normalizedRadius * Math.sin(angle);
      setMarkerPosition({ x, y });
    });

    return () => animatedValue.removeListener(listener);
  }, [animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg height={radius * 2} width={radius * 2}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={color}
          fill="none"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={270}
          originX={radius}
          originY={radius}
        />
      </Svg>
      <Animated.Image
        source={
          isBreak
            ? require('../assets/images/closedbook.png')
            : require('../assets/images/tomato.png')
        }
        style={{
          position: 'absolute',
          width: markerRadius * 2,
          height: markerRadius * 2,
          left: markerPosition.x - markerRadius,
          top: markerPosition.y - markerRadius - 4, // moved icon slightly higher
        }}
      />
    </View>
  );
};

export default ProgressRing;

