"use client"

import { useRouter } from "expo-router"
import { useEffect, useRef } from "react"
import { Animated, Image, Pressable, StyleSheet, View } from "react-native"

const SplashScreen = () => {
  const router = useRouter()
  const scaleAnim = useRef(new Animated.Value(1)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    )

    pulseAnimation.start()
    glowAnimation.start()

    return () => {
      pulseAnimation.stop()
      glowAnimation.stop()
    }
  }, [])

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace("/(tabs)")
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <Image source={require("@/assets/images/splash.png")} style={styles.splashImage} />
      <Animated.View
        style={[
          styles.glowBackground,
          {
            opacity: opacityAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.splashGO,
          {
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
          },
        ]}
      >
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.buttonContainer}
        >
          <Image source={require("@/assets/images/back-button.png")} style={styles.buttonImage} />
        </Pressable>
      </Animated.View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  splashImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },
  splashGO: {
    position: "absolute",
    bottom: 200,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },
  glowBackground: {
    position: "absolute",
    bottom: 185,
    right: "50%",
    width: 80,
    height: 80,
    borderRadius: 40,
 
    zIndex: 2,
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 35,
    
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
})
