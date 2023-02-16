import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event
} from 'react-native-track-player';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  }
  catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });

    isSetup = true;
  }
  finally {
    return isSetup;
  }
}

export async function addTracks() {
  await TrackPlayer.add([
    {
      title: "death bed",
      artist: "Powfu",
      image: require("../assets/album-arts/death-bed.jpg"),
      id: "1",
    },
    {
      title: "bad liar",
      artist: "Imagine Dragons",
      image: require("../assets/album-arts/bad-liar.jpg"),
      id: "2",
    },
    {
      title: "faded",
      artist: "Alan Walker",
      image: require("../assets/album-arts/faded.jpg"),
      id: "3",
    },
    {
      title: "hate me",
      artist: "Ellie Goulding",
      image: require("../assets/album-arts/hate-me.jpg"),
      id: "4",
    },
    {
      title: "Solo",
      artist: "Clean Bandit",
      image: require("../assets/album-arts/solo.jpg"),
      id: "5",
    },
    {
      title: "without me",
      artist: "Halsey",
      image: require("../assets/album-arts/without-me.jpg"),
      id: "6",
    },
  ]);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
  // TODO: Attach remote event handlers
}
