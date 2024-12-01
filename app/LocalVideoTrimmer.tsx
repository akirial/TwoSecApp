import { useVideoPlayer, VideoView } from 'expo-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Button, Text, ScrollView, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';

interface LocalVideoTrimmerProps {
  route: {
    params: {
      videoUri: string;
    };
  };
}

export default function LocalVideoTrimmer({ route }: LocalVideoTrimmerProps) {
  const videoUri = route.params?.videoUri;
  const navigation = useNavigation();

  const player = useVideoPlayer(videoUri);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(2);
  const [isPlayingClip, setIsPlayingClip] = useState<boolean>(false);
  const [isLoopingClip, setIsLoopingClip] = useState<boolean>(false);

  const currentTimeRef = useRef(currentTime);
  const isLoopingClipRef = useRef(isLoopingClip);

  // Generate thumbnails
  const generateThumbnails = async () => {
    if (!videoUri) return;
    const videoDuration = player?.duration || 10;
    const numberOfThumbnails = 20;
    const interval = videoDuration / numberOfThumbnails;

    const generatedThumbnails: any[] = [];
    for (let i = 0; i < numberOfThumbnails; i++) {
      const time = Math.floor(i * interval * 1000);
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time });
        generatedThumbnails.push({ uri, time: time / 1000 });
      } catch (error) {
        generatedThumbnails.push({ uri: null, time: time / 1000 });
      }
    }
    setThumbnails(generatedThumbnails);
  };

  const handleScrub = useCallback(
    (time: number) => {
      if (player) {
        player.currentTime = time;
        setCurrentTime(time);
      }
    },
    [player]
  );

  const markStartTime = () => {
    if (player) {
      const newStartTime = currentTime;
      const newEndTime = Math.min(player.duration || 10, newStartTime + 2);

      if (newEndTime === player.duration) {
        alert('Clip end time cannot exceed video duration. Try a smaller clip length.');
      } else {
        setStartTime(newStartTime);
        setEndTime(newEndTime);
      }
    }
  };

  const playVideo = () => {
    if (player) {
      player.pause(); // Ensure no residual playback
      player.currentTime = currentTime; // Start from the current time
      player.play();
      setIsPlaying(true); // Set the playing state to true
  
      const interval = setInterval(() => {
        const current = player.currentTime;
        setCurrentTime(current); // Update the current time
  
        if (current >= player.duration) {
          clearInterval(interval); // Stop interval when video finishes
          setIsPlaying(false); // Set isPlaying to false when video ends
        }
      }, 100); // Update every 100ms
  
      return () => clearInterval(interval); // Cleanup interval when component unmounts or video ends
    }
  };

  const playClip = () => {
    if (player) {
      player.pause(); // Ensure no residual playback
      player.currentTime = startTime; // Set to clip start
      player.play(); // Start playback
      setIsPlayingClip(true);
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (player) {
      player.pause();
      setIsPlaying(false);
      setIsPlayingClip(false);
    }
  };

  const toggleLoopClip = () => {
    setIsLoopingClip((prev) => !prev);
  };

  // Update current time using playback status
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isPlaying) {
      setCurrentTime(status.position);
    }
  };

  useEffect(() => {
    if (isPlayingClip && player) {
      const interval = setInterval(() => {
        const current = player.currentTime;
        setCurrentTime(current);
        if (current >= endTime) {
          if (isLoopingClip) {
            player.pause();
            player.currentTime = startTime;
            player.play();
          } else {
            pauseVideo();
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlayingClip, player, startTime, endTime, isLoopingClip]);

  useEffect(() => {
    generateThumbnails();
    setDuration(player?.duration || 0);
  }, [videoUri]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    isLoopingClipRef.current = isLoopingClip;
  }, [isLoopingClip]);

  return (
    <View style={styles.contentContainer}>
      <View style={styles.backButtonContainer}>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>

      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        // Add this line
      />

      <View style={styles.timeDisplay}>
        <Text>Current Time: {currentTime.toFixed(2)} seconds</Text>
        <Text>Clip Start Time: {startTime.toFixed(2)} seconds</Text>
        <Text>Clip End Time: {endTime.toFixed(2)} seconds</Text>
      </View>

      <View style={styles.thumbnailContainer}>
        <Text>Video Thumbnails:</Text>
        <ScrollView horizontal contentContainerStyle={styles.thumbnailScrollView}>
          {thumbnails.map((thumbnail, index) => (
            <Image key={index} source={{ uri: thumbnail.uri }} style={styles.thumbnail} resizeMode="cover" />
          ))}
        </ScrollView>
      </View>

      <View style={styles.timelineContainer}>
        <Text>Scrub Through Video:</Text>
        <Slider
          minimumValue={0}
          maximumValue={player.duration || 100}
          value={currentTime}
          onValueChange={handleScrub}
          minimumTrackTintColor="#0000FF"
          maximumTrackTintColor="#000000"
          thumbTintColor="#0000FF"
          style={styles.slider}
        />
      </View>

      <View style={styles.controlsContainer}>
        <Button title="Mark Clip Start" onPress={markStartTime} />
        <Button title={isPlaying ? '⏹️' : '▶️'} onPress={() => (isPlaying ? pauseVideo() : playVideo())} />
        <Button title={isPlayingClip ? 'Pause Clip' : 'Play Clip'} onPress={() => (isPlayingClip ? pauseVideo() : playClip())} />
        <Button title={isLoopingClip ? 'Looping' : 'Loop Clip'} onPress={toggleLoopClip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  video: {
    width: 231,
    height: 230,
    marginBottom: 100,
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  controlsContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
  thumbnailContainer: {
    width: '100%',
    paddingTop: 20,
    alignItems: 'center',
  },
  thumbnailScrollView: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  thumbnail: {
    width: 20,
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  timelineContainer: {
    width: '100%',
    paddingTop: 30,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 20,
  },
  timeDisplay: {
    paddingTop: 20,
    alignItems: 'center',
  },
});
