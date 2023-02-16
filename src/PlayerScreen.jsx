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

// import { TrackPlayer } from "react-native-track-player";
// import { setupPlayer, addTracks } from './trackPlayerServices';
// import songs from "./data";
import Controller from "./Controller";
import { Audio } from 'expo-av';


const songs = [
  {
    title: 'death bed',
    artist: 'Powfu',
    artwork: require('../assets/album-arts/death-bed.jpg'),
    url: require('../src/mp3/lighthouse.wav'),
    duration: 2 * 60 + 53,
    id: '1',
  },
  {
    title: 'bad liar',
    artist: 'Imagine Dragons',
    artwork: require('../assets/album-arts/bad-liar.jpg'),
    url: require('../src/mp3/ember.wav'),
    duration: 2 * 60,
    id: '2',
  },
  {
    title: 'faded',
    artist: 'Alan Walker',
    artwork: require('../assets/album-arts/faded.jpg'),
    url: 'https://sample-music.netlify.app/Faded.mp3',
    duration: 2 * 60,
    id: '3',
  },
  {
    title: 'hate me',
    artist: 'Ellie Goulding',
    artwork: require('../assets/album-arts/hate-me.jpg'),
    url: 'https://sample-music.netlify.app/Hate%20Me.mp3',
    duration: 2 * 60,
    id: '4',
  },
  {
    title: 'Solo',
    artist: 'Clean Bandit',
    artwork: require('../assets/album-arts/solo.jpg'),
    url: 'https://sample-music.netlify.app/Solo.mp3',
    duration: 2 * 60,
    id: '5',
  },
  {
    title: 'without me',
    artist: 'Halsey',
    artwork: require('../assets/album-arts/without-me.jpg'),
    url: 'https://sample-music.netlify.app/Without%20Me.mp3',
    duration: 2 * 60,
    id: '6',
  },
];

//why is the audio not loading?
// const soundObject = new Audio.Sound();


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
  // console.log(soundObject.current);

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
const [sound, setSound] = React.useState();
const playSound = async (index) => {
  try {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: audioSound } = await Audio.Sound.createAsync(songs[songIndex].url);
    setSound(audioSound);

    await audioSound.playAsync();
    setIsPlaying(true);
    setCurrentSong(index);
  } catch (error) {
    console.log(error);
  }
};


React.useEffect(() => {
  return sound
    ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
    }
    : undefined;
}, [sound]);

////////////////////////////////////////////////////////////////////
  const playPause = async () => {
    try {
      if (isPlaying) {
        await soundObject.current.pauseAsync();
      } else {
        await soundObject.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.log(error);
    }
  };

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
      if (soundObject.current) {
        await soundObject.current.unloadAsync();
        isPlaying && setIsPlaying(!isPlaying);
      }
      const nextIndex = (currentSong + 1) % songs.length;
      setCurrentSong(nextIndex);
      soundObject.current = new Audio.Sound(songs[nextIndex].url, null, error => {
        if (error) {
          console.log(error);
        }
      });
      await soundObject.current.loadAsync();
      await soundObject.current.playAsync();
    } catch (error) {
      console.log(error);
    }
  };
  const goPrv = async () => {
    slider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });

    try {
      if (soundObject.current) {
        await soundObject.current.unloadAsync();
        isPlaying && setIsPlaying(!isPlaying);
      }
      const prevIndex = currentSong === 0 ? songs.length - 1 : (currentSong - 1) % songs.length;
      setCurrentSong(prevIndex);
      soundObject.current = new Audio.Sound(songs[nextIndex].url, null, error => {
        if (error) {
          console.log(error);
        }
      });
      await soundObject.current.loadAsync();
      await soundObject.current.playAsync();
    } catch (error) {
      console.log(error);
    }
  };


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

      <Controller onNext={goNext} onPrv={goPrv} onPlayPause={playSound} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: "center",
    textTransform: "capitalize",
  },
  artist: {
    fontSize: 18,
    textAlign: "center",
    textTransform: "capitalize",
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
