import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Controller({ onNext, onPrv, onPlayPause, isPlaying }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrv}>
        <MaterialIcons name="skip-previous" size={55} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPlayPause}>
        {!isPlaying ? (
          <MaterialIcons name="play-arrow" size={55} />
        ) : (
        <MaterialIcons name="pause" size={55} />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onNext}>
        <MaterialIcons name="skip-next" size={55} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 30,
  },
});
