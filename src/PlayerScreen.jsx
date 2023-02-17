import React, { useRef, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import songs from "./data";
import Controller from "./Controller";
import { Audio } from 'expo-av';
import Slider from "@react-native-community/slider";

const { width, height } = Dimensions.get("window");

export default function PlayerScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;

  const slider = useRef(null);
  const [songIndex, setSongIndex] = useState(0);
  

  // for tranlating the album art
  const position = useRef(Animated.divide(scrollX, width)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  // const {soundObject} = useRef(Audio.Sound.createAsync());
  // // console.log(soundObject.current);

  // useEffect(() => {
  //     (async () => {
  //       try {
  //         await soundObject.current.createAsync(songs[currentSong].url);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     })();
  //   }, [currentSong]);

  ///////////////////////////////////////////////////////////
const [sound, setSound] = useState();
const playPause = async () => {
  // try {
  //   if (isPlaying) {
  //     await soundObject.current.pauseAsync();
  //   } else {
  //     await soundObject.current.playAsync();
  //   }
  //   setIsPlaying(!isPlaying);
  // } catch (error) {
  //   console.log(error);
  // }


    const { sound: audioSound } = await Audio.Sound.createAsync(songs[songIndex].url);
    setSound(audioSound);
    console.log(sound);
    console.log(audioSound);

    try {
      if (isPlaying) {
        await audioSound.pauseAsync();
      }
      else {
        await audioSound.playAsync();
      }

    // await audioSound.playAsync();
    setIsPlaying(!isPlaying);
    // setCurrentSong(index);
  } catch (error) {
    console.log("error inside playpause", message.error);
  }
};


useEffect(() => {
  return sound
    ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
    }
    : undefined;
}, [sound]);

const [currentPosition, setCurrentPosition] = useState(0);
// const context = useContext(AudioContext);
// const { playbackPosition, playbackDuration, currentAudio } = sound;
const playbackPosition = 0;
const playbackDuration = songs[songIndex].duration;

const calculateSeekBar = () => {
  if (playbackPosition != null && playbackDuration != null) {
    return playbackPosition / playbackDuration;
  }

  // if (currentAudio.lastPosition) {
  //   return currentAudio.lastPosition / (currentAudio.duration * 1000);
  // }

  return 0;
}

////////////////////////////////////////////////////////////////////
  // const playPause = async () => {
  //   try {
  //     if (isPlaying) {
  //       await soundObject.current.pauseAsync();
  //     } else {
  //       await soundObject.current.playAsync();
  //     }
  //     setIsPlaying(!isPlaying);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  useEffect(() => {
      if (isPlaying) (
        playPause()
        );
    //     try {
    //       await sound.playAsync();
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // };
  
  }, [songIndex]);
  

  useEffect(() => {
    // position.addListener(({ value }) => {
    //   console.log(value);
    // });

    scrollX.addListener(({ value }) => {
      const val = Math.round(value / width);

      setSongIndex(val);
    });



    // TrackPlayer.setupPlayer().then(async () => {
    //   console.log("Player is ready to use!");
    //   await TrackPlayer.reset()
    //   await TrackPlayer.add(songs)
    //   TrackPlayer.play()
    // little buggy
    //if previous index is not same then only update it
    // if (val !== songIndex) {
    //   setSongIndex(val);
    //   console.log(val);
    // }
    // });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);



  const goNext = async () => {
    slider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  
    try {
      if (sound) {
        await sound.unloadAsync();
        setIsPlaying(false);
      }
  
      const nextIndex = 
      songIndex === songs.length - 1 ? 0 : (songIndex + 1); // % songs.length;
  
      setCurrentSong(nextIndex);
      const { sound: audioSound } = await Audio.Sound.createAsync(
        songs[nextIndex].url
      );
      setSound(audioSound);

      if (isPlaying) (
      await audioSound.playAsync(),
      setIsPlaying(true)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  const goPrv = async () => {
    slider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  
    try {
      if (sound) {
        await sound.unloadAsync();
        setIsPlaying(false);
      }
  
      const prevIndex =
        songIndex === 0 ? songs.length - 1 : (songIndex - 1); // % songs.length;
  
      setCurrentSong(prevIndex);
      const { sound: audioSound } = await Audio.Sound.createAsync(
        songs[prevIndex].url
      );
      setSound(audioSound);

      if (isPlaying) (
      await audioSound.playAsync(),
      setIsPlaying(true)
      );

    } catch (error) {
      console.log(error);
    }
  };
  


  // const goPrv = async () => {
  //   slider.current.scrollToOffset({
  //     offset: (songIndex - 1) * width,
  //   });

  //   try {
  //     if (soundObject.current) {
  //       await soundObject.current.unloadAsync();
  //       isPlaying && setIsPlaying(!isPlaying);
  //     }
  //     const prevIndex = currentSong === 0 ? songs.length - 1 : (currentSong - 1) % songs.length;
  //     setCurrentSong(prevIndex);
  //     soundObject.current = new Audio.Sound(songs[nextIndex].url, null, error => {
  //       if (error) {
  //         console.log(error);
  //       }
  //     });
  //     await soundObject.current.loadAsync();
  //     await soundObject.current.playAsync();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  const renderItem = ({ index, item }) => {
    return (
      <Animated.View
        style={{
          alignItems: "center",
          width: width,
          transform: [
            {
              translateX: Animated.multiply(
                Animated.add(position, -index),
                -100
              ),
            },
          ],
        }}
      >
        <Animated.Image
          source={item.artwork}
          style={{ width: 320, height: 320, borderRadius: 5 }}
        />
      </Animated.View>
    );
  };



  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={{ height: 320 }}>
        <Animated.FlatList
          ref={slider}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        />
      </SafeAreaView>
      <View>
        <Text style={styles.title}>{songs[songIndex].title}</Text>
        <Text style={styles.artist}>{songs[songIndex].artist}</Text>
      </View>
      <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15
            }}
          >
            <Text>{songs[songIndex].duration}</Text>
            {/* <Text>{currentPosition ? currentPosition : renderCurrentTime()}</Text> */}
          </View>
      <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor={"red"}
            maximumTrackTintColor={"green"}
            // onValueChange={value => {
            //   setCurrentPosition(
            //     convertTime(value * currentAudio.duration));
            // }}
            onSlidingStart={async () => {
              if (!context.isPlaying)
                return;
              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log("error inside onSlidingStart callback", error.message)
              }
            }}
            onSlidingComplete={async value => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
      <Controller onNext={goNext} onPrv={goPrv} onPlayPause={playPause} isPlaying={isPlaying}/>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: "center",
    textTransform: "capitalize",
   marginTop: 20,
  },
  artist: {
    fontSize: 18,
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  container: {
    justifyContent: "space-evenly",
    height: height,
    maxHeight: 500,
  },
  albumArt: {
    width: 320,
    height: 320,
  },
});
